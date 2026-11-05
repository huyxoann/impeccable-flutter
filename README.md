# Impeccable Flutter (v4.8.0)

The design vocabulary for your Flutter coding agent. **1 unified skill (`/impeccable-flutter <command> [target]`), 24 commands, 4 visitor modes, 4 subagents, an interactive Web Preview Stage (`live` & `generate`) that translates accepted variants straight into `.dart`, and strict Flutter Clean Architecture & design-token enforcement.**

**Impeccable Flutter** is the Flutter & Dart adaptation of **[Impeccable](https://github.com/pbakaus/impeccable)** (`v4.8.0` / `engine-v0.1.18`) by [Paul Bakaus](https://github.com/pbakaus). It combines Impeccable's visual decision board (`concept-seed` + `serve-question`), live browser variant engine (`live` + `generate`), native iOS HIG & Android Material 3 guidance, and deterministic anti-pattern detection with an interactive **Flutter Web Preview Stage (`.impeccable-flutter/preview/index.html`) ➔ Flutter `.dart` Clean Architecture** workflow.

---

## Key Capabilities in v4.8.0

### 1. Single Unified Skill (`/impeccable-flutter <command> [target]`)
All 24 commands live under a single skill entrypoint (`/impeccable-flutter` in Claude Code, Cursor, Gemini CLI, Antigravity, GitHub Copilot, Trae, Kiro, OpenCode; `$impeccable-flutter` in Codex) instead of cluttering the slash-command menu with dozens of separate skills:

```text
/impeccable-flutter shape onboarding
/impeccable-flutter craft subscription_paywall
/impeccable-flutter live
/impeccable-flutter generate 4 bolder HeroCard
/impeccable-flutter audit lib/features/home/
/impeccable-flutter polish lib/features/checkout/
```

Need a frequent command as a top-level shortcut? Pin it per project:
```text
/impeccable-flutter pin audit     # creates /audit
/impeccable-flutter unpin audit   # removes /audit
```

### 2. Interactive Web Preview Stage (`live` & `generate`) ➔ Flutter `.dart` on Accept
Native mobile compilation is too slow for rapid visual exploration of 3–8 design variants side-by-side. **Impeccable Flutter** solves this with a two-stage visual loop:

1. **Stage on `.impeccable-flutter/preview/index.html` (`http://localhost:<port>/preview`)**:
   - Automatically boots a local zero-dependency preview server with a **Mobile (`393×852` / `430×932`) & Tablet (`834×1194`) viewport switcher** and **Light / Dark theme toggle**.
   - Maps your Flutter `DESIGN.md` / `lib/core/theme/` tokens (`AppColors`, `AppTextStyles`, `AppSpacing`, `AppRadius`) to CSS custom properties.
   - Annotates each preview section with `data-flutter-file="lib/features/<feature>/presentation/..."` and `data-flutter-widget="<WidgetName>"`.
2. **Pick, Cycle Variants & Tune Sliders in the Browser**:
   - Use `/impeccable-flutter live` to click any widget in the browser and request variants (`bolder`, `quieter`, `distill`, `polish`, `colorize`, `typeset`, `layout`, `animate`, `delight`, `overdrive`), or use `/impeccable-flutter generate 4 bolder HeroCard` to jump straight into 4 variants without manual clicking.
   - Adjust live parameter sliders (`data-impeccable-params`), use the floating **Steer** bar, or edit copy inline.
3. **Immediate `.dart` Translation on `Accept ✓`**:
   - Every time you click **Accept ✓** on a variant in the browser, `live-accept` extracts the accepted HTML/CSS, `paramValues`, `flutterFile`, and `flutterWidget`, and instructs the agent to immediately write/update the production Flutter `.dart` widget and verify with `flutter analyze`.

### 3. Visual Decision Page (`new-work` + `concept-seed` + `serve-question`)
When creating a new screen or replacing a visual identity (`craft`, `shape`, or general new-work):
- Runs `impeccable concept-seed` against the curated catalog of 306 human-approved visual worlds to prevent generic AI convergence ("the category rut").
- Launches an interactive **Visual Decision Page** (`impeccable serve-question`) in your browser displaying **`THE ROLL`**, **`IMPECCABLE'S PICK`**, **`CHALLENGERS`** (with `QUALITY BAR` reference boards), **`CANON`**, and **Steer / Re-roll (`Plain` / `Safer` / `Bolder`)** controls, complete with HTML first-viewport wireframes or North-star visual comps.

### 4. Native iOS HIG, Android Material 3 & Flutter Clean Architecture Floor
- **Native Platform Playbooks**: Ships [`ios.md`](skill/reference/ios.md), [`android.md`](skill/reference/android.md), [`audit.native.md`](skill/reference/audit.native.md), and [`adapt.native.md`](skill/reference/adapt.native.md), automatically inlined by `impeccable context` when `PRODUCT.md` sets `## Platform` to `ios`, `android`, or `adaptive`.
- **Flutter Craft Floor ([`craft-floor.md`](skill/reference/craft-floor.md))**: Loaded immediately before any UI edit to enforce:
  - **Feature-First Clean Architecture** under `lib/features/<feature>/{domain,data,presentation}/` (`BaseCubit<State>` with `safeEmit`, `Equatable` entities/states, `BaseRepository` returning `Result<T>`, `GetIt` module registration).
  - **Zero Hardcoded Tokens**: Colors via `context.colorScheme.*` or `ThemeExtension<T>` (never raw `Color(0xFF...)`, `Colors.*`, or `isDark ? ... : ...` in widgets); typography via `AppTextStyles` (never raw `TextStyle(...)`); spacing/radii via `AppSpacing` and `AppRadius`.
  - **Icons, Assets, Loading & Feedback**: Icons via `AppIconWidget` (`CustomIcon` / `AppIcons` with SVG-to-`CustomPainter` conversion), raster assets converted to `.webp` (`cwebp -q 90`), loading states via `AppShimmerScope` / `AppSkeletonBox` (never `CircularProgressIndicator` for content loading), SnackBars via `AppSnackBar` / `context.showSnackBar`, and localization via `context.l10n` (`lib/l10n/*.arb`).

---

## 24 Commands

All commands are invoked via `/impeccable-flutter <command> [target]`:

| Category | Command | Description | Reference |
|---|---|---|---|
| **Build & Plan** | `craft [feature]` | Shape, preview on the Web Stage, and build a Flutter feature end-to-end | [`craft.md`](skill/reference/craft.md) · [`new-work.md`](skill/reference/new-work.md) |
| | `shape [feature]` | Plan UX/UI, run `concept-seed` + Visual Decision Page before code | [`shape.md`](skill/reference/shape.md) |
| | `init` | Capture durable product & Flutter architecture context in `PRODUCT.md` | [`init.md`](skill/reference/init.md) |
| | `document` | Generate `DESIGN.md` & `.impeccable-flutter/design.json` from existing Flutter theme code | [`document.md`](skill/reference/document.md) |
| | `extract [target]` | Extract reusable tokens and widgets into `lib/core/theme/` & `lib/core/widgets/` | [`extract.md`](skill/reference/extract.md) |
| **Evaluate** | `critique [target]` | Scored UX design review (hierarchy, clarity, emotional resonance, personas) | [`critique.md`](skill/reference/critique.md) |
| | `audit [target]` | Technical quality audit (a11y, perf, theming, responsive, P0–P3 findings) | [`audit.md`](skill/reference/audit.md) · [`audit.native.md`](skill/reference/audit.native.md) |
| **Refine** | `polish [target]` | Final quality pass before shipping | [`polish.md`](skill/reference/polish.md) |
| | `bolder [target]` | Amplify safe or bland designs | [`bolder.md`](skill/reference/bolder.md) |
| | `quieter [target]` | Tone down aggressive or overstimulating designs | [`quieter.md`](skill/reference/quieter.md) |
| | `distill [target]` | Strip to essence, remove unnecessary complexity | [`distill.md`](skill/reference/distill.md) |
| | `harden [target]` | Production-ready: error states, `context.l10n`, text scaling (`TextScaler`), edge cases | [`harden.md`](skill/reference/harden.md) |
| | `onboard [target]` | Design first-run flows, empty states, and activation moments | [`onboard.md`](skill/reference/onboard.md) |
| **Enhance** | `animate [target]` | Add purposeful animations, staggered transitions, and micro-interactions | [`animate.md`](skill/reference/animate.md) |
| | `colorize [target]` | Add strategic OKLCH color to monochromatic UIs | [`colorize.md`](skill/reference/colorize.md) |
| | `typeset [target]` | Improve typography hierarchy, font pairings, and modular scale | [`typeset.md`](skill/reference/typeset.md) |
| | `layout [target]` | Fix spacing, rhythm, alignment, and visual hierarchy | [`layout.md`](skill/reference/layout.md) |
| | `delight [target]` | Add moments of personality and memorable touches | [`delight.md`](skill/reference/delight.md) |
| | `overdrive [target]` | Push past conventional limits (`CustomPainter`, `FragmentShader`, spring physics) | [`overdrive.md`](skill/reference/overdrive.md) |
| **Fix** | `clarify [target]` | Improve UX copy, labels, and error messages | [`clarify.md`](skill/reference/clarify.md) |
| | `adapt [target]` | Adapt across phones, foldables, tablets, desktop, and orientations | [`adapt.md`](skill/reference/adapt.md) · [`adapt.native.md`](skill/reference/adapt.native.md) |
| | `optimize [target]` | Diagnose and fix Flutter rendering, rebuild, and main-thread performance | [`optimize.md`](skill/reference/optimize.md) |
| **Iterate Live** | `live` | Interactive browser variant mode on `.impeccable-flutter/preview/index.html` ➔ `.dart` | [`live.md`](skill/reference/live.md) |
| | `generate [n] [action] [element]` | Fast-lane N variants of a named widget in the live browser without manual picking | [`generate.md`](skill/reference/generate.md) |

### Management & Diagnostics Commands
- `/impeccable-flutter pin <command>` / `/impeccable-flutter unpin <command>`: Create or remove standalone `/<command>` shortcuts.
- `/impeccable-flutter hooks <on|off|status|ignore-rule|ignore-file|ignore-value|reset>`: Manage the post-edit design detector hook ([`hooks.md`](skill/reference/hooks.md)).
- `/impeccable-flutter doctor`: Inspect and repair drift across `PRODUCT.md`, `DESIGN.md`, surface briefs, and config ([`doctor.md`](skill/reference/doctor.md)).

---

## 4 Visitor Modes & 4 Subagents

### Visitor Modes
Instead of a rigid binary split, each surface chooses the mode that matches what user success looks like:
- **Persuade** ([`mode-persuade.md`](skill/reference/mode-persuade.md)): Onboarding showcases, paywalls/VIP upgrade screens, campaigns, landing pages.
- **Operate** ([`mode-operate.md`](skill/reference/mode-operate.md), [`operate.md`](skill/reference/operate.md)): App screens, dashboards, forms, editors, settings, tools.
- **Read** ([`mode-read.md`](skill/reference/mode-read.md)): Articles, readers, documentation, help centers, changelogs.
- **Experience**: Media players, galleries, interactive canvases, creative tools.

### Bundled Subagents (`skill/agents/`)
- `impeccable-asset-producer`: Produces high-resolution visual comps and transparent/opaque raster plates with embedded prompt provenance.
- `impeccable-finish-reviewer`: Runs an isolated visual & architectural review against the direction contract, comp diff, and native platform rules (`ios.md` / `android.md`).
- `impeccable-documenter`: Extracts and updates `DESIGN.md` and `.impeccable-flutter/design.json` from the finished build.
- `impeccable-manual-edit-applier`: Applies inline copy and style edits staged from the live browser toolbar back into source files.

---

## Installation & Development

### Build & Fetch Engine
```bash
# Install dependencies
npm install

# Fetch the pinned v0.1.18 Rust engine binary for your platform
npm run fetch:engine

# Clean and rebuild all 13 provider bundles (dist/, plugin/, .claude/, .gemini/, .cursor/, .agents/, etc.)
npm run rebuild

# Run the test suite
npm test
```

### Supported AI Harnesses (13 Providers)
Built outputs are generated under `dist/` and synced to the repository root for:
- **Claude Code** (`.claude/skills/impeccable-flutter`, `.claude/agents/`, and `./plugin/`)
- **Gemini CLI & Google Antigravity** (`.gemini/skills/impeccable-flutter`)
- **Cursor** (`.cursor/skills/impeccable-flutter`)
- **Codex CLI** (`.agents/skills/impeccable-flutter` and `.codex/agents/`)
- **GitHub Copilot** (`.github/skills/impeccable-flutter`)
- **Kiro, OpenCode, Pi, Qoder, Trae, Trae CN, Rovo Dev**

---

## Credits & License

Forked and adapted from **[Impeccable](https://github.com/pbakaus/impeccable)** (`v4.8.0`) by **[Paul Bakaus](https://www.paulbakaus.com)**.
Licensed under the [Apache 2.0 License](LICENSE). See [NOTICE.md](NOTICE.md) for attribution details.
