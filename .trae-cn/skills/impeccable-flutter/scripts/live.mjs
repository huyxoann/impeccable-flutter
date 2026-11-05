/**
 * CLI entry point: prepare everything needed to enter the live variant poll loop.
 *
 * Does (all in one command):
 *   1. Check .impeccable/live/config.json (returns config_missing if first-ever run)
 *   2. Start the live server in the background (or reuse a running one)
 *   3. Inject the browser script tag into the project's entry file
 *   4. Read PRODUCT.md / DESIGN.md for project context
 *   5. Print a single JSON blob with everything the agent needs
 *
 * After this, the agent's only remaining steps are:
 *   - Open the project's live dev/preview URL in the browser (optional, if browser automation exists)—not `serverPort`; that port is the Impeccable helper for /live.js and /poll
 *   - Enter the poll loop: `node live-poll.mjs`
 *
 * Usage:
 *   node live.mjs                   # Prepare everything, print JSON, exit
 *   node live.mjs --help
 */

import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadContext } from './load-context.mjs';
import { resolveFiles } from './live-inject.mjs';
import {
  getLiveConfigPath,
  getPreviewEntryPath,
  readLiveServerInfo,
} from './impeccable-flutter-paths.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function liveCli() {
  const args = process.argv.slice(2);

  if (args.includes('--help') || args.includes('-h')) {
    console.log(`Usage: node live.mjs

Prepare everything for live variant mode in a single command:
  - Checks .impeccable/live/config.json (required, created once per project)
  - Starts (or reuses) the live server in the background
  - Injects the browser script tag
  - Reads PRODUCT.md / DESIGN.md for project context

On success, prints a JSON blob with:
  { ok, serverPort, serverToken, pageFile, hasContext, context }

On config_missing, prints:
  { ok: false, error: "config_missing", configPath, hint }

The agent should then:
  1. If config_missing, create the config and re-run this script
  2. Optionally open the project's dev/preview URL in the browser (see reference/live.md—not serverPort)
  3. Enter the poll loop: node live-poll.mjs`);
    process.exit(0);
  }

  // 0. Auto-bootstrap Flutter Web Preview Stage & live config when in a Flutter project
  //    or when --preview is requested (or when .impeccable-flutter/preview/index.html exists).
  ensureFlutterPreviewBootstrap(process.cwd(), args.includes('--preview'));

  // 1. Check config (fail fast if missing — no point starting anything else)
  const checkOut = runScript('live-inject.mjs', ['--check']);
  const checkResult = safeParse(checkOut);
  if (!checkResult || !checkResult.ok) {
    console.log(JSON.stringify(checkResult || { ok: false, error: 'check_failed', raw: checkOut }));
    process.exit(0);
  }

  // 2. Start server (or reuse existing)
  const serverInfo = ensureServerRunning();
  if (!serverInfo) {
    console.log(JSON.stringify({ ok: false, error: 'server_start_failed' }));
    process.exit(1);
  }

  // 3. Inject the script tag at the current port
  const injectOut = runScript('live-inject.mjs', ['--port', String(serverInfo.port)]);
  const injectResult = safeParse(injectOut);
  if (!injectResult || !injectResult.ok) {
    console.log(JSON.stringify({
      ok: false,
      error: 'inject_failed',
      detail: injectResult || injectOut,
      serverPort: serverInfo.port,
    }));
    process.exit(1);
  }

  // 4. Load PRODUCT.md + DESIGN.md context (auto-migrates legacy .impeccable.md)
  const ctx = loadContext(process.cwd());

  // 5. Compute drift-heal: compare resolved inject targets against the
  //    project's HTML files. Orphans are HTML files not covered by config.
  //    Warning only — the agent decides whether to act.
  const resolvedFiles = resolveFiles(process.cwd(), checkResult.config);
  const drift = scanForDrift(process.cwd(), resolvedFiles, checkResult.config);
  const hasPreviewEntry = fs.existsSync(getPreviewEntryPath(process.cwd()));

  // 6. Emit everything the agent needs
  console.log(JSON.stringify({
    ok: true,
    serverPort: serverInfo.port,
    serverToken: serverInfo.token,
    previewUrl: hasPreviewEntry ? `http://localhost:${serverInfo.port}/preview` : null,
    pageFiles: resolvedFiles,
    configDrift: drift,
    hasProduct: ctx.hasProduct,
    product: ctx.product,
    productPath: ctx.productPath,
    hasDesign: ctx.hasDesign,
    design: ctx.design,
    designPath: ctx.designPath,
    migrated: ctx.migrated,
  }, null, 2));
}

/**
 * Ensure a Flutter Web Preview Stage (.impeccable-flutter/preview/index.html)
 * and live config (.impeccable-flutter/live/config.json) exist when running
 * in a Flutter workspace (pubspec.yaml present) or when --preview is passed.
 */
function ensureFlutterPreviewBootstrap(cwd, forcePreview = false) {
  const isFlutterProject = fs.existsSync(path.join(cwd, 'pubspec.yaml'));
  const previewEntry = getPreviewEntryPath(cwd);
  const configPath = getLiveConfigPath(cwd);

  if (!isFlutterProject && !forcePreview && !fs.existsSync(previewEntry)) {
    return;
  }

  if (!fs.existsSync(previewEntry)) {
    fs.mkdirSync(path.dirname(previewEntry), { recursive: true });
    fs.writeFileSync(previewEntry, buildDefaultFlutterPreviewHtml(), 'utf-8');
  }

  if (!fs.existsSync(configPath)) {
    fs.mkdirSync(path.dirname(configPath), { recursive: true });
    fs.writeFileSync(
      configPath,
      JSON.stringify(
        {
          files: ['.impeccable-flutter/preview/index.html'],
          exclude: [],
          insertBefore: '</body>',
          commentSyntax: 'html',
          cspChecked: true,
        },
        null,
        2,
      ) + '\n',
      'utf-8',
    );
  }
}

function buildDefaultFlutterPreviewHtml() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Impeccable Flutter — Live Preview Stage</title>
  <style>
    :root {
      /* AppColors / ColorScheme tokens (Light default) */
      --color-bg: #F6F5F2;
      --color-surface: #FFFFFF;
      --color-surface-container: #EFECE6;
      --color-on-surface: #171614;
      --color-on-surface-variant: #65615B;
      --color-primary: #1F5EFF;
      --color-on-primary: #FFFFFF;
      --color-outline: #E2DDD5;
      /* AppSpacing tokens */
      --space-xs: 4px;
      --space-sm: 8px;
      --space-md: 16px;
      --space-lg: 24px;
      --space-xl: 32px;
      /* AppRadius tokens */
      --radius-sm: 8px;
      --radius-md: 14px;
      --radius-lg: 20px;
      --radius-xl: 28px;
      /* AppTypography tokens */
      --font-sans: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
    }
    #flutter-viewport[data-theme="dark"] {
      --color-bg: #111214;
      --color-surface: #1A1C20;
      --color-surface-container: #23262C;
      --color-on-surface: #F4F3EF;
      --color-on-surface-variant: #9B9A95;
      --color-primary: #5B8AFF;
      --color-on-primary: #0D1528;
      --color-outline: #2C3038;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      min-height: 100vh;
      background: #141518;
      color: #F4F3EF;
      font-family: var(--font-sans);
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 16px 16px 96px;
    }
    .stage-toolbar {
      display: flex;
      align-items: center;
      gap: 12px;
      background: #1F2127;
      border: 1px solid #2F333D;
      border-radius: 999px;
      padding: 6px 14px;
      margin-bottom: 18px;
      font-size: 12px;
      color: #B4B7C2;
    }
    .stage-toolbar button {
      background: transparent;
      border: 1px solid transparent;
      color: #D9DCE6;
      padding: 4px 10px;
      border-radius: 999px;
      cursor: pointer;
      font-size: 12px;
    }
    .stage-toolbar button.active {
      background: #2D3240;
      border-color: #454D63;
      color: #FFFFFF;
    }
    #flutter-viewport {
      width: 393px;
      min-height: 852px;
      background: var(--color-bg);
      color: var(--color-on-surface);
      border-radius: 44px;
      border: 8px solid #282B33;
      box-shadow: 0 28px 80px rgba(0, 0, 0, 0.55);
      overflow: hidden;
      display: flex;
      flex-direction: column;
      transition: width 0.2s cubic-bezier(0.22, 1, 0.36, 1), min-height 0.2s cubic-bezier(0.22, 1, 0.36, 1);
    }
    .device-statusbar {
      height: 44px;
      padding: 0 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 12px;
      font-weight: 600;
      color: var(--color-on-surface);
    }
    #flutter-screen {
      flex: 1;
      display: flex;
      flex-direction: column;
      padding: var(--space-md);
      gap: var(--space-md);
    }
  </style>
</head>
<body data-impeccable-stage="true">
  <div class="stage-toolbar" data-impeccable-ignore="true">
    <span>Flutter Stage</span>
    <button type="button" class="active" onclick="setSize(393, 852, 44, this)">Mobile 393×852</button>
    <button type="button" onclick="setSize(430, 932, 48, this)">Max 430×932</button>
    <button type="button" onclick="setSize(834, 1194, 28, this)">Tablet 834×1194</button>
    <button type="button" onclick="toggleTheme(this)">Theme: Light</button>
  </div>

  <div id="flutter-viewport" data-theme="light" data-impeccable-stage="true">
    <div class="device-statusbar" data-impeccable-ignore="true">
      <span>9:41</span>
      <span>5G · 100%</span>
    </div>
    <main id="flutter-screen" data-flutter-file="lib/main.dart" data-flutter-widget="HomeScreen">
      <section class="hero-card" data-flutter-file="lib/main.dart" data-flutter-widget="HeroSection" style="background: var(--color-surface); padding: var(--space-lg); border-radius: var(--radius-lg); border: 1px solid var(--color-outline);">
        <p style="font-size: 12px; font-weight: 600; color: var(--color-primary); text-transform: uppercase; letter-spacing: 0.06em;">Flutter Preview Ready</p>
        <h1 style="font-size: 24px; font-weight: 700; margin-top: 8px; line-height: 1.25;">Select any widget to generate 3 variants</h1>
        <p style="font-size: 14px; color: var(--color-on-surface-variant); margin-top: 8px; line-height: 1.5;">Click an element on this stage, choose an action or type a prompt, tune parameters, and click Accept ✓ to write Flutter Dart code.</p>
      </section>
    </main>
  </div>

  <script data-impeccable-ignore="true">
    function setSize(w, h, r, btn) {
      const vp = document.getElementById('flutter-viewport');
      vp.style.width = w + 'px';
      vp.style.minHeight = h + 'px';
      vp.style.borderRadius = r + 'px';
      btn.parentElement.querySelectorAll('button').forEach((b, i) => { if (i < 3) b.classList.remove('active'); });
      btn.classList.add('active');
    }
    function toggleTheme(btn) {
      const vp = document.getElementById('flutter-viewport');
      const next = vp.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      vp.setAttribute('data-theme', next);
      btn.textContent = 'Theme: ' + (next === 'dark' ? 'Dark' : 'Light');
    }
  </script>
</body>
</html>
`;
}

/**
 * Drift-heal scan. Walks the project for HTML files under common
 * page-source directories (public/, src/, app/, pages/) and reports any
 * that aren't covered by the resolved inject targets. This is purely
 * advisory — the agent can ignore it, or suggest the user add the
 * orphans to config.files.
 *
 * Skipped if config.files already contains at least one glob pattern
 * covering everything in practice (signaled by the orphan count being 0).
 */
function scanForDrift(rootDir, resolvedFiles, config) {
  const SCAN_ROOTS = ['public', 'src', 'app', 'pages'];
  const IGNORE_DIRS = new Set([
    'node_modules', '.git', '.next', '.nuxt', '.svelte-kit', '.astro',
    '.turbo', '.vercel', '.cache', 'coverage', 'dist', 'build',
  ]);

  const resolvedSet = new Set(resolvedFiles.map((f) => f.split(path.sep).join('/')));

  // Files matching the user's `exclude` globs are intentional omissions,
  // not drift. Compile them to regexes so the orphan list stays signal.
  const userExcludeRegexes = (Array.isArray(config.exclude) ? config.exclude : [])
    .map((p) => globToRegex(p));
  const isUserExcluded = (rel) => userExcludeRegexes.some((re) => re.test(rel));

  const orphans = [];

  const walk = (dir, relBase) => {
    let entries;
    try { entries = fs.readdirSync(dir, { withFileTypes: true }); }
    catch { return; }
    for (const e of entries) {
      const rel = relBase ? `${relBase}/${e.name}` : e.name;
      if (e.isDirectory()) {
        if (IGNORE_DIRS.has(e.name) || e.name.startsWith('.')) continue;
        walk(path.join(dir, e.name), rel);
      } else if (e.isFile() && e.name.endsWith('.html')) {
        if (resolvedSet.has(rel)) continue;
        if (isUserExcluded(rel)) continue;
        orphans.push(rel);
      }
    }
  };

  for (const root of SCAN_ROOTS) {
    const abs = path.join(rootDir, root);
    if (fs.existsSync(abs) && fs.statSync(abs).isDirectory()) {
      walk(abs, root);
    }
  }

  if (orphans.length === 0) return null;
  const capped = orphans.slice(0, 20);
  return {
    orphans: capped,
    orphanCount: orphans.length,
    hint: `${orphans.length} HTML file(s) exist but aren't in config.files. Consider adding them, or use a glob pattern like "public/**/*.html".`,
  };
}

/**
 * Same glob-to-regex mapping used by live-inject.mjs. Kept inline here
 * to avoid a circular import (live-inject.mjs already imports nothing
 * from live.mjs). The two must stay in sync.
 */
function globToRegex(pattern) {
  let re = '';
  let i = 0;
  while (i < pattern.length) {
    const c = pattern[i];
    if (c === '*') {
      if (pattern[i + 1] === '*') {
        if (pattern[i + 2] === '/') { re += '(?:.*/)?'; i += 3; }
        else { re += '.*'; i += 2; }
      } else {
        re += '[^/]*';
        i += 1;
      }
    } else if (c === '?') {
      re += '[^/]';
      i += 1;
    } else if (/[.+^${}()|[\]\\]/.test(c)) {
      re += '\\' + c;
      i += 1;
    } else {
      re += c;
      i += 1;
    }
  }
  return new RegExp('^' + re + '$');
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function runScript(name, args) {
  const scriptPath = path.join(__dirname, name);
  const cmd = `node "${scriptPath}" ${args.map(a => `"${a}"`).join(' ')}`;
  try {
    return execSync(cmd, { encoding: 'utf-8', cwd: process.cwd(), timeout: 15_000 });
  } catch (err) {
    // execSync throws on non-zero exit; return stdout if any
    return err.stdout || err.message || '';
  }
}

function safeParse(out) {
  try { return JSON.parse(String(out).trim()); } catch { return null; }
}

/**
 * Return { pid, port, token } for the running live server, starting one if needed.
 */
function ensureServerRunning() {
  // Try to reuse an existing server
  try {
    const existing = readLiveServerInfo(process.cwd())?.info;
    if (existing && existing.pid) {
      try {
        process.kill(existing.pid, 0); // throws if dead
        return existing;
      } catch { /* stale PID file — the server script will clean it up */ }
    }
  } catch { /* no PID file */ }

  // Start a new server
  const out = runScript('live-server.mjs', ['--background']);
  return safeParse(out);
}

// ---------------------------------------------------------------------------
// Auto-execute
// ---------------------------------------------------------------------------

const _running = process.argv[1];
if (_running?.endsWith('live.mjs') || _running?.endsWith('live.mjs/')) {
  liveCli();
}
