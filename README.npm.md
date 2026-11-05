# Impeccable Flutter CLI (v4.8.0)

Design skills, interactive Web Preview Stage (`live` & `generate`), and deterministic UI anti-pattern detection for Flutter and Dart development.

## Quick Start

```bash
# Install skills into your AI harness (Claude, Cursor, Gemini, Antigravity, Codex, etc.)
npx impeccable-flutter skills install

# Update skills to the latest version
npx impeccable-flutter skills update

# List all available commands
npx impeccable-flutter skills help

# Scan files or directories for anti-patterns
npx impeccable-flutter detect lib/

# Scan a live preview URL
npx impeccable-flutter detect http://localhost:8400/preview

# JSON output for CI/tooling
npx impeccable-flutter detect --json lib/
```

## What's Included in v4.8.0

- **1 Unified Skill (`/impeccable-flutter <command> [target]`) with 24 Commands**: `craft`, `shape`, `init`, `document`, `extract`, `critique`, `audit`, `polish`, `bolder`, `quieter`, `distill`, `harden`, `onboard`, `animate`, `colorize`, `typeset`, `layout`, `delight`, `overdrive`, `clarify`, `adapt`, `optimize`, `live`, `generate`.
- **Interactive Web Preview Stage (`.impeccable-flutter/preview/index.html`) ➔ `.dart` Translation**: Preview new screens (`new-work`, `craft`, `shape`) or iterate on existing widgets (`live`, `generate`) in the browser at `http://localhost:<port>/preview` with Mobile (`393×852`, `430×932`) & Tablet (`834×1194`) viewports and Light/Dark toggle, then translate accepted variants (`Accept ✓`) directly into Flutter `.dart` Clean Architecture code.
- **Native iOS HIG & Android Material 3 Guidance**: Built-in `ios.md`, `android.md`, `audit.native.md`, `adapt.native.md`, and `craft-floor.md`.
- **4 Specialized Subagents**: `impeccable-asset-producer`, `impeccable-finish-reviewer`, `impeccable-documenter`, `impeccable-manual-edit-applier`.

## License

[Apache 2.0](https://github.com/huyxoann/impeccable-flutter/blob/main/LICENSE)
