#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const CWD = process.cwd();

function checkProductMd() {
  const rootProduct = path.join(CWD, 'PRODUCT.md');
  const agentProduct = path.join(CWD, '.agents/context/PRODUCT.md');
  return fs.existsSync(rootProduct) || fs.existsSync(agentProduct);
}

function getGitStats() {
  try {
    const status = execSync('git status --short').toString();
    const log = execSync('git log -n 10 --oneline').toString();
    return { status, log };
  } catch (e) {
    return { status: '', log: '' };
  }
}

function getLatestCritique() {
  const dir = path.join(CWD, '.impeccable-flutter/critique');
  if (!fs.existsSync(dir)) return null;
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.md')).sort();
  if (!files.length) return null;
  const latest = files[files.length - 1];
  return fs.readFileSync(path.join(dir, latest), 'utf-8');
}

function recommend() {
  if (!checkProductMd()) {
    return {
      command: 'init',
      reason: 'No PRODUCT.md found. Project context is required for high-quality design work.',
    };
  }

  const { status, log } = getGitStats();
  const latestCritique = getLatestCritique();

  if (latestCritique) {
    const p0Match = latestCritique.match(/\[P0\]/g);
    if (p0Match) {
      return {
        command: 'polish',
        reason: `The latest critique has ${p0Match.length} P0 issues that need immediate attention.`,
      };
    }
  }

  if (status.includes('lib/')) {
    if (log.toLowerCase().includes('font') || log.toLowerCase().includes('type')) {
      return {
        command: 'typeset',
        reason: 'Recent commits show typography changes; use typeset to ensure a consistent hierarchy.',
      };
    }
    if (log.toLowerCase().includes('spacing') || log.toLowerCase().includes('layout') || log.toLowerCase().includes('padding')) {
      return {
        command: 'layout',
        reason: 'Recent commits show layout/spacing changes; use layout to fix rhythm and hierarchy.',
      };
    }
    return {
      command: 'audit',
      reason: 'Many changes in lib/ detected. Run an audit to catch any new design anti-patterns or accessibility regressions.',
    };
  }

  return {
    command: 'critique',
    reason: 'Project state is stable. Run a fresh critique to find new opportunities for improvement.',
  };
}

const rec = recommend();
console.log(JSON.stringify(rec, null, 2));
