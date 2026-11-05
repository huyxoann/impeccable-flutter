/**
 * Tests for project-local Impeccable path resolution.
 * Run with: node --test tests/impeccable-paths.test.mjs
 */

import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

import {
  getDesignSidecarPath,
  getLegacyLiveServerPath,
  getLiveAnnotationsDir,
  getLiveConfigPath,
  getLiveServerPath,
  getLiveSessionsDir,
  getPreviewEntryPath,
  readLiveServerInfo,
  resolveDesignSidecarPath,
  resolveLiveConfigPath,
} from '../skill/scripts/impeccable-flutter-paths.mjs';

describe('impeccable project paths', () => {
  let tmp;

  beforeEach(() => {
    tmp = mkdtempSync(join(tmpdir(), 'impeccable-paths-'));
  });

  afterEach(() => {
    rmSync(tmp, { recursive: true, force: true });
  });

  it('resolves the generated design sidecar under .impeccable-flutter', () => {
    assert.equal(getDesignSidecarPath(tmp), join(tmp, '.impeccable-flutter', 'design.json'));

    mkdirSync(join(tmp, '.impeccable-flutter'), { recursive: true });
    writeFileSync(join(tmp, 'DESIGN.json'), '{"source":"legacy"}');
    writeFileSync(getDesignSidecarPath(tmp), '{"source":"new"}');

    assert.equal(resolveDesignSidecarPath(tmp), getDesignSidecarPath(tmp));
  });

  it('falls back to legacy root DESIGN.json when the new sidecar is missing', () => {
    const legacyPath = join(tmp, 'DESIGN.json');
    writeFileSync(legacyPath, '{"source":"legacy"}');

    assert.equal(resolveDesignSidecarPath(tmp), legacyPath);
  });

  it('uses .impeccable-flutter/live/config.json as the default live config path', () => {
    assert.equal(resolveLiveConfigPath({ cwd: tmp, scriptsDir: join(tmp, 'scripts'), env: {} }), getLiveConfigPath(tmp));
  });

  it('falls back to legacy scripts/config.json when no new live config exists', () => {
    const scriptsDir = join(tmp, 'skills', 'impeccable', 'scripts');
    mkdirSync(scriptsDir, { recursive: true });
    const legacyConfig = join(scriptsDir, 'config.json');
    writeFileSync(legacyConfig, '{"files":["index.html"]}');

    assert.equal(resolveLiveConfigPath({ cwd: tmp, scriptsDir, env: {} }), legacyConfig);
  });

  it('lets IMPECCABLE_LIVE_CONFIG override both new and legacy config locations', () => {
    const override = join(tmp, 'custom-live-config.json');
    mkdirSync(join(tmp, '.impeccable-flutter', 'live'), { recursive: true });
    writeFileSync(getLiveConfigPath(tmp), '{"source":"new"}');
    writeFileSync(override, '{"source":"override"}');

    assert.equal(
      resolveLiveConfigPath({ cwd: tmp, scriptsDir: join(tmp, 'scripts'), env: { IMPECCABLE_LIVE_CONFIG: 'custom-live-config.json' } }),
      override,
    );
  });

  it('places live server, session, and annotation state under .impeccable-flutter/live', () => {
    assert.equal(getLiveServerPath(tmp), join(tmp, '.impeccable-flutter', 'live', 'server.json'));
    assert.equal(getLiveSessionsDir(tmp), join(tmp, '.impeccable-flutter', 'live', 'sessions'));
    assert.equal(getLiveAnnotationsDir(tmp), join(tmp, '.impeccable-flutter', 'live', 'annotations'));
  });

  it('reads new live server state before legacy recovery state', () => {
    mkdirSync(join(tmp, '.impeccable-flutter', 'live'), { recursive: true });
    writeFileSync(getLiveServerPath(tmp), JSON.stringify({ port: 8401, token: 'new' }));
    writeFileSync(getLegacyLiveServerPath(tmp), JSON.stringify({ port: 8400, token: 'legacy' }));

    const record = readLiveServerInfo(tmp);
    assert.equal(record.path, getLiveServerPath(tmp));
    assert.equal(record.info.token, 'new');
  });

  it('reads legacy live server state when the new state file is absent', () => {
    writeFileSync(getLegacyLiveServerPath(tmp), JSON.stringify({ port: 8400, token: 'legacy' }));

    const record = readLiveServerInfo(tmp);
    assert.equal(record.path, getLegacyLiveServerPath(tmp));
    assert.equal(record.info.token, 'legacy');
  });

  it('emits only a single impeccable-flutter skill without fanned-out commands', () => {
    const repoRoot = process.cwd();
    for (const dir of ['.claude/skills', 'plugin/skills']) {
      const entries = readdirSync(join(repoRoot, dir)).filter(e => !e.startsWith('.'));
      assert.deepEqual(entries, ['impeccable-flutter']);
    }
    const skillMd = readFileSync(join(repoRoot, '.claude/skills/impeccable-flutter/SKILL.md'), 'utf-8');
    assert.match(skillMd, /argument-hint: "\[craft\|shape · audit\|critique/);
  });

  it('wraps and accepts variants in .impeccable-flutter/preview/index.html with Flutter widget metadata', () => {
    const repoRoot = process.cwd();
    const wrapScript = join(repoRoot, 'skill/scripts/live-wrap.mjs');
    const acceptScript = join(repoRoot, 'skill/scripts/live-accept.mjs');

    const previewPath = getPreviewEntryPath(tmp);
    mkdirSync(join(tmp, '.impeccable-flutter/preview'), { recursive: true });
    writeFileSync(
      previewPath,
      [
        '<!DOCTYPE html>',
        '<html><body>',
        '  <main id="flutter-screen" data-flutter-file="lib/features/home/home_page.dart" data-flutter-widget="HomePage">',
        '    <section class="hero-card" data-flutter-file="lib/features/home/widgets/hero_card.dart" data-flutter-widget="HeroCard">',
        '      <h1>Welcome back</h1>',
        '    </section>',
        '  </main>',
        '</body></html>',
      ].join('\n'),
      'utf-8',
    );

    const wrapOut = JSON.parse(
      execFileSync('node', [wrapScript, '--id', 'abc12345', '--count', '2', '--classes', 'hero-card', '--tag', 'section'], {
        cwd: tmp,
        encoding: 'utf-8',
      }),
    );
    assert.equal(wrapOut.file, '.impeccable-flutter/preview/index.html');

    // Splice two variants into the wrapped preview file
    const wrappedLines = readFileSync(previewPath, 'utf-8').split('\n');
    wrappedLines.splice(
      wrapOut.insertLine - 1,
      0,
      '    <style data-impeccable-css="abc12345">@scope ([data-impeccable-variant="1"]) { :scope > .hero-card { padding: 24px; } }</style>',
      '    <div data-impeccable-variant="1"><section class="hero-card" data-flutter-file="lib/features/home/widgets/hero_card.dart" data-flutter-widget="HeroCard"><h1>Variant 1</h1></section></div>',
      '    <div data-impeccable-variant="2" style="display: none"><section class="hero-card"><h1>Variant 2</h1></section></div>',
    );
    writeFileSync(previewPath, wrappedLines.join('\n'), 'utf-8');

    const acceptOut = JSON.parse(
      execFileSync(
        'node',
        [acceptScript, '--id', 'abc12345', '--variant', '1', '--param-values', '{"density":"snug"}'],
        { cwd: tmp, encoding: 'utf-8' },
      ),
    );
    assert.equal(acceptOut.handled, true);
    assert.equal(acceptOut.carbonize, true);
    assert.equal(acceptOut.flutterFile, 'lib/features/home/widgets/hero_card.dart');
    assert.equal(acceptOut.flutterWidget, 'HeroCard');
    assert.deepEqual(acceptOut.paramValues, { density: 'snug' });
    assert.match(acceptOut.todo, /translate the accepted HTML\/CSS \+ paramValues into Flutter Dart code/);
  });

  it('supports v4.8.0 hybrid launcher (engine-probe, native context + FLUTTER_WEB_PREVIEW_STAGE, serve-question, live-generate, and 4 subagents)', () => {
    const repoRoot = process.cwd();
    const launcher = join(repoRoot, 'skill/scripts/impeccable');

    const probeOut = execFileSync(launcher, ['engine-probe'], { cwd: tmp, encoding: 'utf-8' }).trim();
    assert.match(probeOut, /^impeccable-engine 0\.1\.\d+$/);

    writeFileSync(join(tmp, 'pubspec.yaml'), 'name: demo_flutter\ndependencies:\n  flutter:\n    sdk: flutter\n', 'utf-8');
    writeFileSync(
      join(tmp, 'PRODUCT.md'),
      '<!-- impeccable-schema: product@2 -->\n# Product\n\n## Platform\nadaptive\n\n## Positioning\nDemo\n\n## Operating Context\nMobile\n\n## Evidence on Hand\nNone\n\n## Product Principles\nFast\n',
      'utf-8',
    );
    const contextOut = execFileSync(launcher, ['context'], { cwd: tmp, encoding: 'utf-8' });
    assert.match(contextOut, /NATIVE PLATFORM REFERENCE: IOS/);
    assert.match(contextOut, /NATIVE PLATFORM REFERENCE: ANDROID/);
    assert.match(contextOut, /FLUTTER_WEB_PREVIEW_STAGE:/);

    const schemaOut = execFileSync(launcher, ['serve-question', '--schema'], { cwd: tmp, encoding: 'utf-8' });
    assert.match(schemaOut, /"title": "Choose the visual world"/);
    assert.match(schemaOut, /"canonCard":/);

    const genDryRun = JSON.parse(
      execFileSync(
        launcher,
        ['live-generate', '--dry-run', '--selector', '#hero-card', '--action', 'bolder', '--count', '4'],
        { cwd: tmp, encoding: 'utf-8' },
      ),
    );
    assert.equal(genDryRun.ok, true);
    assert.equal(genDryRun.dryRun, true);
    assert.equal(genDryRun.element.id, 'hero-card');

    const claudeAgents = readdirSync(join(repoRoot, '.claude/agents')).filter(f => f.endsWith('.md')).sort();
    assert.deepEqual(claudeAgents, [
      'impeccable-asset-producer.md',
      'impeccable-documenter.md',
      'impeccable-finish-reviewer.md',
      'impeccable-manual-edit-applier.md',
    ]);
  });
});
