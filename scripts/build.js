#!/usr/bin/env node

/**
 * Build System for Cross-Provider Design Skills (Flutter Version)
 *
 * Transforms source skills into provider-specific formats:
 * - Cursor: .cursor/skills/
 * - Claude Code: .claude/skills/
 * - Gemini: .gemini/skills/
 * - Codex: dist/codex/ only (OpenAI-metadata bundle; not synced to repo root)
 * - Agents: .agents/skills/ (Codex repo/user installs)
 * - GitHub: .github/skills/ (GitHub Copilot)
 *
 * Also assembles a universal ZIP containing all providers.
 */

import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { readSourceFiles, stashPerProjectArtifacts, restorePerProjectArtifacts } from './lib/utils.js';
import { createTransformer, PROVIDERS } from './lib/transformers/index.js';
import { createAllZips } from './lib/zip.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const DIST_DIR = path.join(ROOT_DIR, 'dist');

/**
 * Copy directory recursively
 */
function copyDirSync(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

/**
 * Assemble universal directory from all provider outputs
 */
function assembleUniversal(distDir) {
  const universalDir = path.join(distDir, 'universal');

  if (fs.existsSync(universalDir)) {
    fs.rmSync(universalDir, { recursive: true, force: true });
  }

  const providerConfigs = Object.values(PROVIDERS);

  for (const { provider, configDir } of providerConfigs) {
    const src = path.join(distDir, provider, configDir);
    const dest = path.join(universalDir, configDir);
    if (fs.existsSync(src)) {
      copyDirSync(src, dest);
    }
  }

  fs.writeFileSync(path.join(universalDir, 'README.txt'),
`Impeccable Flutter. Design fluency for AI harnesses.
https://impeccable.style

This folder contains skills for all supported tools:

  .cursor/    -> Cursor
  .claude/    -> Claude Code
  .gemini/    -> Gemini CLI
  .codex/     -> Codex custom agents (Codex skills use .agents/)
  .agents/    -> Codex CLI
  .github/    -> GitHub Copilot
  .trae/      -> Trae International

To install, copy the relevant folder(s) into your project root.
`);

  console.log(`✓ Assembled universal directory (${providerConfigs.length} providers)`);
}

/**
 * Main build process
 */
async function build() {
  console.log('🔨 Building cross-provider design skills (Flutter)...\n');

  // Read source files (unified skills architecture)
  const { skills } = readSourceFiles(ROOT_DIR);
  const userInvocableCount = skills.filter(s => s.userInvocable).length;
  console.log(`📖 Read ${skills.length} skills (${userInvocableCount} user-invocable)\n`);

  // Read skills version from plugin.json
  const pluginJson = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, '.claude-plugin/plugin.json'), 'utf-8'));
  const skillsVersion = pluginJson.version;

  // Transform for each provider
  for (const config of Object.values(PROVIDERS)) {
    const transform = createTransformer(config);
    transform(skills, DIST_DIR, { skillsVersion });
  }

  // Assemble universal directory
  assembleUniversal(DIST_DIR);

  // Create ZIP bundles
  await createAllZips(DIST_DIR);

  // Copy all provider outputs to project root for local testing.
  const syncConfigs = Object.values(PROVIDERS).filter(({ configDir }) => configDir !== '.codex');

  for (const { provider, configDir } of syncConfigs) {
    const skillsSrc = path.join(DIST_DIR, provider, configDir, 'skills');
    const skillsDest = path.join(ROOT_DIR, configDir, 'skills');

    if (fs.existsSync(skillsSrc)) {
      const stashed = stashPerProjectArtifacts(skillsDest);
      if (fs.existsSync(skillsDest)) fs.rmSync(skillsDest, { recursive: true });
      copyDirSync(skillsSrc, skillsDest);
      restorePerProjectArtifacts(skillsDest, stashed);
    }
  }

  for (const { provider, configDir, agentFormat } of Object.values(PROVIDERS)) {
    if (!agentFormat) continue;

    const agentsSrc = path.join(DIST_DIR, provider, configDir, 'agents');
    const agentsDest = path.join(ROOT_DIR, configDir, 'agents');

    if (fs.existsSync(agentsDest)) fs.rmSync(agentsDest, { recursive: true, force: true });
    if (fs.existsSync(agentsSrc)) {
      copyDirSync(agentsSrc, agentsDest);
    }
  }

  console.log(`📋 Synced skills to: ${syncConfigs.map(p => p.configDir).join(', ')}`);

  // Build the Claude Code plugin subtree at ./plugin/.
  const pluginRoot = path.join(ROOT_DIR, 'plugin');
  const pluginManifestDir = path.join(pluginRoot, '.claude-plugin');
  const pluginSkillsDir = path.join(pluginRoot, 'skills');
  const pluginAgentsDir = path.join(pluginRoot, 'agents');
  if (fs.existsSync(pluginManifestDir)) fs.rmSync(pluginManifestDir, { recursive: true });
  if (fs.existsSync(pluginSkillsDir)) fs.rmSync(pluginSkillsDir, { recursive: true });
  if (fs.existsSync(pluginAgentsDir)) fs.rmSync(pluginAgentsDir, { recursive: true });

  const rootManifest = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, '.claude-plugin/plugin.json'), 'utf-8'));
  const claudeAgentsSrc = path.join(DIST_DIR, 'claude-code', '.claude', 'agents');
  const pluginAgentEntries = fs.existsSync(claudeAgentsSrc)
    ? fs.readdirSync(claudeAgentsSrc)
        .filter(file => file.endsWith('.md'))
        .sort()
        .map(file => `./agents/${file}`)
    : [];

  const pluginManifest = { ...rootManifest, skills: './skills/' };
  if (pluginAgentEntries.length) {
    pluginManifest.agents = pluginAgentEntries;
  } else {
    delete pluginManifest.agents;
  }
  fs.mkdirSync(pluginManifestDir, { recursive: true });
  fs.writeFileSync(
    path.join(pluginManifestDir, 'plugin.json'),
    JSON.stringify(pluginManifest, null, 2) + '\n',
  );

  const claudeSkillsSrc = path.join(DIST_DIR, 'claude-code', '.claude', 'skills', 'impeccable-flutter');
  if (fs.existsSync(claudeSkillsSrc)) {
    fs.mkdirSync(pluginSkillsDir, { recursive: true });
    copyDirSync(claudeSkillsSrc, path.join(pluginSkillsDir, 'impeccable-flutter'));
  }

  if (fs.existsSync(claudeAgentsSrc)) {
    copyDirSync(claudeAgentsSrc, pluginAgentsDir);
  }

  console.log('📦 Built Claude Code plugin subtree at ./plugin/');
  console.log('\n✨ Build complete!');
}

build();
