# Impeccable Flutter

The vocabulary you didn't know you needed. 1 skill, 22 commands, and curated anti-patterns for impeccable Flutter design.

**Impeccable Flutter** is a specialized version of the original [Impeccable](https://github.com/pbakaus/impeccable) project, adapted specifically for the Flutter and Dart ecosystem. It brings the same high-signal design guidance and anti-pattern detection to mobile, desktop, and web apps built with Flutter.

> **Quick start:** Visit [impeccable.style](https://impeccable.style) to download ready-to-use bundles.

## Credits & Inspiration

This project is a fork and adaptation of **[Impeccable](https://github.com/pbakaus/impeccable)** by **[Paul Bakaus](https://github.com/pbakaus)**. 

While the original Impeccable focuses on the web (HTML/CSS), Impeccable Flutter extends these principles to the unique world of Flutter widgets, `ThemeData`, and declarative UI. We owe a massive debt to the original project for its foundational design laws, the "AI slop" test, and the core command structure.

The project also builds on [Anthropic's original frontend-design skill](https://github.com/anthropics/skills/tree/main/skills/frontend-design). See [NOTICE.md](NOTICE.md) for full attribution.

## Why Impeccable Flutter?

Every model trained on the same SaaS templates. Skip the guidance and you get the same handful of tells on every project: Inter for everything, purple-to-blue gradients, cards nested in cards, gray text on colored backgrounds, the rounded-square icon tile above every heading.

Impeccable Flutter adds:
- **7 domain reference files** ([view source](skill/)). Typography, color, motion, spatial, interaction, responsive, UX writing. Load on every command, alongside a brand-vs-product register that adjusts the defaults.
- **22 commands.** A shared design vocabulary with your AI: `polish`, `audit`, `critique`, `distill`, `animate`, `bolder`, `quieter`, and more.
- **29+ deterministic anti-pattern rules** plus a 12-rule LLM critique pass. CLI and browser extension run the deterministic ones with no LLM and no API key. Each is tied to specific design guidance the skill teaches against.

## What's Included

### The Skill: impeccable-flutter

A comprehensive design skill with 7 domain-specific references ([view skill](skill/SKILL.md)):

| Reference | Covers |
|-----------|--------|
| [typography](skill/reference/typography.md) | Type systems, font pairing, modular scales, OpenType |
| [color-and-contrast](skill/reference/color-and-contrast.md) | OKLCH, tinted neutrals, dark mode, accessibility |
| [spatial-design](skill/reference/spatial-design.md) | Spacing systems, grids, visual hierarchy |
| [motion-design](skill/reference/motion-design.md) | Easing curves, staggering, reduced motion |
| [interaction-design](skill/reference/interaction-design.md) | Forms, focus states, loading patterns |
| [responsive-design](skill/reference/responsive-design.md) | Mobile-first, fluid design, container queries |
| [ux-writing](skill/reference/ux-writing.md) | Button labels, error messages, empty states |

### 22 Commands

All commands are accessed through `/impeccable-flutter`:

| Command | What it does |
|---------|--------------|
| `/impeccable-flutter craft` | Full shape-then-build flow with visual iteration |
| `/impeccable-flutter init` | One-time setup: gather design context, write root PRODUCT.md and DESIGN.md |
| `/impeccable-flutter document` | Generate root DESIGN.md from existing project code |
| `/impeccable-flutter extract` | Pull reusable components and tokens into the design system |
| `/impeccable-flutter shape` | Plan UX/UI before writing code |
| `/impeccable-flutter critique` | UX design review: hierarchy, clarity, emotional resonance |
| `/impeccable-flutter audit` | Run technical quality checks (a11y, performance, responsive) |
| `/impeccable-flutter polish` | Final pass, design system alignment, and shipping readiness |
| `/impeccable-flutter bolder` | Amplify boring designs |
| `/impeccable-flutter quieter` | Tone down overly bold designs |
| `/impeccable-flutter distill` | Strip to essence |
| `/impeccable-flutter harden` | Error handling, i18n, text overflow, edge cases |
| `/impeccable-flutter onboard` | First-run flows, empty states, activation paths |
| `/impeccable-flutter animate` | Add purposeful motion |
| `/impeccable-flutter colorize` | Introduce strategic color |
| `/impeccable-flutter typeset` | Fix font choices, hierarchy, sizing |
| `/impeccable-flutter layout` | Fix layout, spacing, visual rhythm |
| `/impeccable-flutter delight` | Add moments of joy |
| `/impeccable-flutter overdrive` | Add technically extraordinary effects |
| `/impeccable-flutter clarify` | Improve unclear UX copy |
| `/impeccable-flutter adapt` | Adapt for different devices |
| `/impeccable-flutter optimize` | Performance improvements |

Use `/impeccable-flutter pin <command>` to create standalone shortcuts (e.g., `pin audit` creates `/audit`).

#### Usage Examples

```
/impeccable-flutter audit lib/           # Audit Flutter project
/impeccable-flutter critique landing     # UX design review
/impeccable-flutter polish settings      # Final pass before shipping
/impeccable-flutter harden checkout      # Add error handling + edge cases
```

Or use `/impeccable-flutter` directly with a description:
```
/impeccable-flutter redo this hero section
```

### Anti-Patterns

The skill includes explicit guidance on what to avoid:

- **The "AI Slop" test:** Rejects designs that look generic or machine-generated.
- **No overused fonts:** Flags Inter, Roboto, and system defaults.
- **Banned Prose:** Flags AI-isms like "powerful", "seamless", and "robust".
- **GPT Shadow Slop:** Flags thin borders combined with wide, soft, low-opacity shadows.
- **No Card Soup:** Rejects wrapping everything in cards or nesting cards.

## See It In Action

Visit [impeccable.style](https://impeccable.style#casestudies) to see before/after case studies of real projects transformed with Impeccable commands.

## Installation

### Option 1: Claude Code Plugin (Recommended)

```bash
claude plugin add pbakaus/impeccable-flutter
```

### Option 2: Download from Website

Visit [impeccable.style](https://impeccable.style), download the ZIP for your tool, and extract to your project.

## CLI

Impeccable Flutter includes a standalone CLI for detecting anti-patterns without an AI harness:

```bash
npx impeccable-flutter detect lib/                  # scan a directory
npx impeccable-flutter detect https://example.com    # scan a URL (Puppeteer)
npx impeccable-flutter detect --fast --json .        # regex-only, JSON output
```

The detector catches 30+ issues across AI slop (GPT shadows, side-tab borders, purple gradients, bounce easing, prose rules) and general design quality (line length, cramped padding, small touch targets, and more).

## Supported Tools

- [Claude Code](https://claude.ai/code)
- [Cursor](https://cursor.com)
- [Gemini CLI](https://github.com/google-gemini/gemini-cli)
- [GitHub Copilot](https://code.visualstudio.com)
- [Codex CLI](https://github.com/openai/codex)
- [Trae](https://trae.ai)

## Contributing

See [DEVELOP.md](DEVELOP.md) for contributor guidelines and build instructions.

## License

Apache 2.0. See [LICENSE](LICENSE).

---

Based on the original [Impeccable](https://github.com/pbakaus/impeccable) by [Paul Bakaus](https://www.paulbakaus.com)
