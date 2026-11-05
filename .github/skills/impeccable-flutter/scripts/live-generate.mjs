#!/usr/bin/env node
/**
 * `impeccable live-generate` — Flutter Web Preview Stage fast-lane into Live Mode.
 *
 * Boots the live server & `.impeccable-flutter/preview/index.html` (when needed),
 * resolves `--selector` in the preview HTML, wraps the target element with a
 * fresh 8-hex session ID via `live-wrap.mjs`, registers the session in the
 * durable session store, and returns the leased `generate` event + `scaffold`
 * so the agent can write variants in one edit and call `live-poll --reply <id> done`.
 */

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { getPreviewEntryPath, readLiveServerInfo } from './impeccable-flutter-paths.mjs';
import { createLiveSessionStore } from './live-session-store.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const VISUAL_ACTIONS = new Set([
  'impeccable',
  'bolder',
  'quieter',
  'distill',
  'polish',
  'typeset',
  'colorize',
  'layout',
  'adapt',
  'animate',
  'delight',
  'overdrive',
]);

function argVal(args, flag) {
  const idx = args.indexOf(flag);
  if (idx !== -1 && idx + 1 < args.length && !args[idx + 1].startsWith('--')) {
    return args[idx + 1];
  }
  const eq = args.find((a) => a.startsWith(`${flag}=`));
  return eq ? eq.slice(flag.length + 1) : null;
}

function parseSelectorToWrapArgs(selector) {
  const s = (selector || '').trim();
  const out = { elementId: null, classes: null, tag: null, query: s };
  if (!s) return out;

  // Attribute selector e.g. [data-flutter-widget="HeroCard"]
  const attrMatch = s.match(/^\[([a-zA-Z0-9_-]+)=["']?([^"'\]]+)["']?\]$/);
  if (attrMatch) {
    out.query = `${attrMatch[1]}="${attrMatch[2]}"`;
    return out;
  }

  // Tag#id.class1.class2
  const idMatch = s.match(/#([a-zA-Z0-9_-]+)/);
  if (idMatch) out.elementId = idMatch[1];

  const classMatches = [...s.matchAll(/\.([a-zA-Z0-9_-]+)/g)].map((m) => m[1]);
  if (classMatches.length > 0) out.classes = classMatches.join(',');

  const tagMatch = s.match(/^([a-zA-Z][a-zA-Z0-9-]*)/);
  if (tagMatch) out.tag = tagMatch[1].toLowerCase();

  return out;
}

async function main() {
  const args = process.argv.slice(2);
  if (args.includes('--help') || args.includes('-h')) {
    console.log(
      'Usage: impeccable live-generate --selector <css> [--text <snippet>] [--action <name>] [--count <n>] [--prompt <text>] [--file <path>] [--boot] [--open]',
    );
    process.exit(0);
  }

  const cwd = process.cwd();
  const selector = argVal(args, '--selector');
  if (!selector) {
    console.log(
      JSON.stringify(
        {
          ok: false,
          error: 'selector_required',
          _instructions:
            'Pass --selector with a CSS selector or [data-flutter-widget="..."] for the element in .impeccable-flutter/preview/index.html.',
        },
        null,
        2,
      ),
    );
    process.exit(1);
  }

  const action = argVal(args, '--action') || 'impeccable';
  if (!VISUAL_ACTIONS.has(action)) {
    console.log(
      JSON.stringify(
        {
          ok: false,
          error: 'invalid_action',
          action,
          validActions: [...VISUAL_ACTIONS],
        },
        null,
        2,
      ),
    );
    process.exit(1);
  }

  const count = Math.max(1, Math.min(8, parseInt(argVal(args, '--count') || '3', 10) || 3));
  const prompt = argVal(args, '--prompt') || '';
  const text = argVal(args, '--text') || '';
  const dryRun = args.includes('--dry-run');

  const previewEntry = argVal(args, '--file') || getPreviewEntryPath(cwd);
  const relFile = path.relative(cwd, path.resolve(cwd, previewEntry));
  const sessionId = crypto.randomBytes(4).toString('hex');
  const parsed = parseSelectorToWrapArgs(selector);

  if (dryRun) {
    console.log(
      JSON.stringify(
        {
          ok: true,
          dryRun: true,
          selector,
          file: relFile,
          element: {
            tag: parsed.tag || 'div',
            id: parsed.elementId || '',
            classes: parsed.classes ? parsed.classes.split(',') : [],
          },
        },
        null,
        2,
      ),
    );
    process.exit(0);
  }

  // Ensure live server & Flutter Web Preview Stage are booted
  let boot = null;
  let serverInfo = readLiveServerInfo(cwd)?.info || null;
  if (args.includes('--boot') || !serverInfo || !serverInfo.port) {
    const bootOut = execFileSync(process.execPath, [path.join(__dirname, 'live.mjs')], {
      cwd,
      encoding: 'utf-8',
    });
    boot = JSON.parse(bootOut);
    serverInfo = readLiveServerInfo(cwd)?.info || null;
  }

  const wrapArgs = [path.join(__dirname, 'live-wrap.mjs'), '--id', sessionId, '--count', String(count)];
  if (fs.existsSync(path.resolve(cwd, previewEntry))) {
    wrapArgs.push('--file', relFile);
  }
  if (parsed.elementId) wrapArgs.push('--element-id', parsed.elementId);
  if (parsed.classes) wrapArgs.push('--classes', parsed.classes);
  if (parsed.tag) wrapArgs.push('--tag', parsed.tag);
  if (parsed.query) wrapArgs.push('--query', parsed.query);
  if (text) wrapArgs.push('--text', text);

  let scaffold;
  try {
    const wrapOut = execFileSync(process.execPath, wrapArgs, {
      cwd,
      encoding: 'utf-8',
    });
    scaffold = JSON.parse(wrapOut);
  } catch (err) {
    const detail = (err.stderr || err.stdout || err.message || '').toString().trim();
    console.log(
      JSON.stringify(
        {
          ok: false,
          error: 'selector_not_found',
          selector,
          file: relFile,
          detail,
          _instructions: `Element matching "${selector}" was not found in ${relFile}. Mirror the target Flutter widget into .impeccable-flutter/preview/index.html first (with data-flutter-file and data-flutter-widget attributes), then rerun live-generate.`,
        },
        null,
        2,
      ),
    );
    process.exit(1);
  }

  const port = serverInfo?.port || boot?.serverPort || 8400;
  const previewUrl = `http://localhost:${port}/preview`;

  const event = {
    type: 'generate',
    id: sessionId,
    action,
    count,
    prompt,
    pageUrl: previewUrl,
    element: {
      tagName: parsed.tag || 'div',
      id: parsed.elementId || '',
      classes: parsed.classes ? parsed.classes.split(',') : [],
      textContent: text,
      selector,
    },
    scaffold,
    _instructions: `Session ${sessionId} started on ${scaffold.file} (insertLine: ${scaffold.insertLine}). Write all ${count} variants in ONE edit at insertLine, then run: node ${path.join(__dirname, 'live-poll.mjs')} --reply ${sessionId} done --file ${scaffold.file} and open ${previewUrl} for the user to review & Accept ✓ (which will then be translated into Flutter .dart code).`,
  };

  try {
    const store = createLiveSessionStore({ cwd, sessionId });
    store.appendEvent(event);
  } catch {
    // Non-fatal if session store is locked
  }

  console.log(
    JSON.stringify(
      {
        ok: true,
        sessionId,
        action,
        count,
        previewUrl,
        devUrl: previewUrl,
        boot: boot || {
          ok: true,
          serverPort: port,
          previewUrl,
          pageFiles: [relFile],
        },
        event,
        _instructions: event._instructions,
      },
      null,
      2,
    ),
  );
}

main();
