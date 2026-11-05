---
name: impeccable-flutter
description: "Use when the user wants to design, redesign, shape, critique, audit, polish, clarify, distill, harden, optimize, adapt, animate, colorize, extract, or otherwise improve a Flutter frontend interface: mobile (iOS/Android), tablet, desktop, and web apps, app shells, components, forms, settings, onboarding, and empty states. Handles UX review, visual hierarchy, information architecture, cognitive load, accessibility, performance, responsive behavior, theming, anti-patterns, typography, fonts, spacing, layout, alignment, color, motion, micro-interactions, UX copy, error states, edge cases, i18n, live browser preview variant iteration, and reusable design systems or tokens in Dart/Flutter."
version: 4.8.0
license: Apache 2.0
allowed-tools:
  - Bash(npx impeccable *)
  - Bash(.pi/skills/impeccable-flutter/scripts/impeccable *)
  - Bash(node .pi/skills/impeccable-flutter/scripts/*)
---

This skill gives you the tools and permission to make Flutter & multi-platform UI design that earns the name out-of-distribution craft. Work as an award-winning design director and senior Flutter Clean Architecture engineer: production-grade Dart/Flutter code, a clear POV, an interactive Web Preview Stage (`live`), and exceptional craft.

Core principles:
- **Finish the job.** No hedging, no shortcuts: the deliverable is complete, production-ready Flutter code, except assets the user must provide.
- **Scale ambition to the surface's mode (see Modes).** Persuade and Experience get full commitment: bold, distinct work with a point of view. On Operate and Read, ambition shows as precision, scanability, restraint, and native platform fluency (iOS HIG / Android Material 3).
- **Web Preview Stage First ➔ Flutter `.dart` on Accept.** Before writing or refactoring complex Flutter UI, visualize it on the interactive Web Preview Stage (`.impeccable-flutter/preview/index.html` served at `http://localhost:<port>/preview`), let the user cycle variants and tune sliders in the browser, and immediately translate every accepted variant (`Accept ✓`) into clean `.dart` code.

## Setup

1. Run `.pi/skills/impeccable-flutter/scripts/impeccable context` once per session (keep cwd at the user's project; pass `--target <path>` when a specific file or route is named). It loads `PRODUCT.md`, `DESIGN.md`, the matching surface brief, native platform guidance ([reference/ios.md](reference/ios.md) / [reference/android.md](reference/android.md)), and the `FLUTTER_WEB_PREVIEW_STAGE` directive. Follow its directives and do not rerun it. (Fallback if the binary cannot run: `node .pi/skills/impeccable-flutter/scripts/load-context.mjs`). <!-- rule:skill-setup-context -->
2. Load the request's playbook: its Commands-table reference for an explicit/implied sub-command, or [reference/new-work.md](reference/new-work.md) for a new surface or replacement visual world. Inspect target `.dart` files and incumbent design tokens (`lib/core/theme/`) before editing. <!-- rule:skill-setup-command-ref --> <!-- rule:skill-setup-read-project -->
3. After resolving analysis and direction, read [reference/craft-floor.md](reference/craft-floor.md) immediately before any UI edit (HTML preview or `.dart` implementation), including small refinements. It carries the quality floor, the absolute bans, and the Flutter Clean Architecture & token floor. Do not load it for planning-only work. <!-- rule:skill-craft-floor-load -->
4. **Web Preview Stage First (`.pi/skills/impeccable-flutter/scripts/impeccable live`)**: When designing a new Flutter screen/widget (`new-work`, `craft`, `shape` -> build) or visually refining an existing one (`live`, `generate`, `bolder`, `quieter`, `polish`, `layout`, `colorize`, `typeset`, `distill`, `delight`, `overdrive`, `animate`, `adapt`), mirror/render the target UI onto `.impeccable-flutter/preview/index.html` (Mobile `393×852` / Max `430×932` / Tablet `834×1194` stage with Light/Dark toggle and `data-flutter-file` / `data-flutter-widget` attributes) and boot `.pi/skills/impeccable-flutter/scripts/impeccable live` (`http://localhost:<serverPort>/preview`). Let the user preview, cycle variants, and tune parameters in the browser; each time they click **Accept ✓**, immediately translate the accepted HTML/CSS + `paramValues` into the mapped Flutter `.dart` file and run `flutter analyze`.

## How to design

- **The brief wins.** Honor pinned aesthetics, eras, materials, fonts, and palettes even when they conflict with a saturated-pattern warning. Redirecting a clear brief toward your taste is failure. <!-- rule:skill-brief-wins -->
- **Refinement preserves; redesign replaces.** Refinement keeps the incumbent identity, behavior, copy, and everything outside scope. Redesign keeps product truth, content, function, native affordances, and constraints, but treats the old look as evidence and anti-reference; choose a replacement world in [reference/new-work.md](reference/new-work.md) and replace `DESIGN.md`. <!-- rule:skill-world-change-semantics -->
- **Visual authority is evidence, not a filename.** Missing `DESIGN.md` alone does not make a project greenfield; `new-work` inspects `lib/core/theme/` (`AppColors`, `AppTextStyles`, `AppSpacing`, `AppRadius`) and decides whether to preserve, expand, or replace the incumbent world. <!-- rule:skill-new-work-gate -->

## Modes

The mode names what the user's success looks like on this surface.

- **Persuade:** the user decides and acts; design is the product. Onboarding showcases, paywalls/VIP upgrade screens, marketing/landing web views, campaigns. Earn attention and action. See [reference/mode-persuade.md](reference/mode-persuade.md). <!-- rule:brand-register-core -->
- **Operate:** the user completes a task. App screens, dashboards, forms, editors, settings, tools. Scanability, consistency, native expectations (44pt/48dp touch targets, safe areas, thumb zones), and the real usage scene outrank expression. Brand lives in precise details. See [reference/mode-operate.md](reference/mode-operate.md) and [reference/operate.md](reference/operate.md). <!-- rule:product-register-core -->
- **Read:** the user understands something. Articles, readers, guides, help centers, changelogs. Structure for comprehension, then make the reading experience worth staying in. See [reference/mode-read.md](reference/mode-read.md). <!-- rule:skill-read-register -->
- **Experience:** the user is inside the work itself. Media players, galleries, interactive canvases, games/creative tools. Let the artifact lead from the first viewport; the interface recedes. <!-- rule:skill-experience-register -->

Choose the mode from the requested surface, not the product, and persist it only in that surface brief. <!-- rule:skill-visitor-mode -->

## Flutter Clean Architecture & Token Mandate

Every `.dart` file produced or updated by `impeccable-flutter` must strictly obey:
- **Feature-First Clean Architecture (`lib/features/<feature>/`)**:
  - `domain/`: Pure Dart `entities/`, abstract `repositories/`, `usecases/` (`UseCase<Type, Params>`). Never import `package:flutter/...` or JSON serialization in `domain/`.
  - `data/`: `models/` (`fromJson`/`toJson`), `datasources/` (`ILocalStorage`), `repositories/` (`BaseRepository` returning `Result<T>`).
  - `presentation/`: `cubit/` (`BaseCubit<State>` with `safeEmit` and `Equatable` states), `pages/`, `widgets/` (`StatelessWidget` / `StatefulWidget` with `const` constructors — never private `Widget _buildX()` helpers).
- **Theme, Typography, Spacing & Localization**:
  - **Colors:** Always resolve via `context.colorScheme.*` or `ThemeExtension<T>`. Never hardcode `Color(0xFF...)`, `Colors.*`, or `isDark ? ... : ...` inside widgets.
  - **Typography:** Always use `AppTextStyles` / `AppTypography` (`lib/core/theme/app_text_styles.dart`) with `.copyWith(...)` only for dynamic overrides. Never construct raw `TextStyle(...)` in widgets.
  - **Spacing & Radius:** Always use `AppSpacing` and `AppRadius` tokens instead of raw numbers.
  - **Icons & Assets:** Render all icons via `AppIconWidget` (`CustomIcon` / `AppIcons`), converting SVGs to `CustomPainter` with `withColor(Color? color)`. Convert all raster assets (PNG/JPG) to `.webp` (`cwebp -q 90`).
  - **Loading & Feedback:** Use `AppShimmerScope` / `AppSkeletonBox` for loading states (never `CircularProgressIndicator` for content loading) and `AppSnackBar` / `context.showSnackBar` (never raw `SnackBar(...)`).
  - **Row Alignment:** Always use `CrossAxisAlignment.center` when pairing `AppIconWidget` and `Text` in a `Row`.
  - **Localization:** Put all user-facing strings in `lib/l10n/*.arb`, run `flutter gen-l10n`, and access via `context.l10n`.

## Commands

| Command | Category | Description | Reference |
|---|---|---|---|
| `craft [feature]` | Build | Shape, preview on Web Stage, and build a Flutter feature end-to-end | [reference/craft.md](reference/craft.md) · [reference/new-work.md](reference/new-work.md) |
| `shape [feature]` | Build | Plan UX/UI, run `concept-seed` + Visual Decision Page before code | [reference/shape.md](reference/shape.md) |
| `init` | Build | Capture durable product & Flutter architecture context in PRODUCT.md | [reference/init.md](reference/init.md) |
| `document` | Build | Generate DESIGN.md from existing Flutter theme & widget code | [reference/document.md](reference/document.md) |
| `extract [target]` | Build | Pull reusable tokens and widgets into `lib/core/theme/` & `lib/core/widgets/` | [reference/extract.md](reference/extract.md) |
| `critique [target]` | Evaluate | UX design review with heuristic scoring | [reference/critique.md](reference/critique.md) |
| `audit [target]` | Evaluate | Technical quality checks (a11y, perf, theming, responsive) | [reference/audit.md](reference/audit.md) · native: [reference/audit.native.md](reference/audit.native.md) |
| `polish [target]` | Refine | Final quality pass before shipping | [reference/polish.md](reference/polish.md) |
| `bolder [target]` | Refine | Amplify safe or bland designs | [reference/bolder.md](reference/bolder.md) |
| `quieter [target]` | Refine | Tone down aggressive or overstimulating designs | [reference/quieter.md](reference/quieter.md) |
| `distill [target]` | Refine | Strip to essence, remove complexity | [reference/distill.md](reference/distill.md) |
| `harden [target]` | Refine | Production-ready: errors, i18n (`context.l10n`), edge cases, text scaling | [reference/harden.md](reference/harden.md) |
| `onboard [target]` | Refine | Design first-run flows, empty states, activation | [reference/onboard.md](reference/onboard.md) |
| `animate [target]` | Enhance | Add purposeful animations and motion | [reference/animate.md](reference/animate.md) |
| `colorize [target]` | Enhance | Add strategic color to monochromatic UIs | [reference/colorize.md](reference/colorize.md) |
| `typeset [target]` | Enhance | Improve typography hierarchy and fonts | [reference/typeset.md](reference/typeset.md) |
| `layout [target]` | Enhance | Fix spacing, rhythm, and visual hierarchy | [reference/layout.md](reference/layout.md) |
| `delight [target]` | Enhance | Add personality and memorable touches | [reference/delight.md](reference/delight.md) |
| `overdrive [target]` | Enhance | Push past conventional limits (CustomPainter, FragmentShader, physics) | [reference/overdrive.md](reference/overdrive.md) |
| `clarify [target]` | Fix | Improve UX copy, labels, and error messages | [reference/clarify.md](reference/clarify.md) |
| `adapt [target]` | Fix | Adapt for different devices, foldables, tablets, and orientations | [reference/adapt.md](reference/adapt.md) · native: [reference/adapt.native.md](reference/adapt.native.md) |
| `optimize [target]` | Fix | Diagnose and fix Flutter UI & main-thread performance | [reference/optimize.md](reference/optimize.md) |
| `live` | Iterate | Visual variant mode on `.impeccable-flutter/preview/index.html` ➔ `.dart` | [reference/live.md](reference/live.md) |
| `generate [n] [action] [element]` | Iterate | Fast-lane N variants of a named widget in the live browser without manual picking | [reference/generate.md](reference/generate.md) |

Routing: <!-- rule:skill-routing -->

- **No argument:** read [reference/routing.md](reference/routing.md) and present its context-aware menu; never auto-run a command.
- **Explicit or clearly implied request to run a command:** load its reference (including native variant on iOS/Android/Flutter) and follow it. Ask once if two commands fit.
- **Workflow or command-selection question:** read [Workflow questions](reference/routing.md#workflow-questions).
- **Otherwise:** treat the request as general design work. Missing `PRODUCT.md` routes a new surface or replacement world through `init`, then [reference/new-work.md](reference/new-work.md); a narrow refinement of existing code proceeds on the incumbent implementation as `impeccable context` directs, offering `init` afterward rather than blocking on it.

**Pin / Unpin:** `.pi/skills/impeccable-flutter/scripts/impeccable pin <pin|unpin> <command>` creates or removes a standalone `/<command>` shortcut. Report the script's result concisely; relay stderr verbatim on error.

**Hooks:** `/impeccable-flutter hooks <on|off|status|ignore-rule|ignore-file|ignore-value|reset>` manages the design detector hook for this project. Load [reference/hooks.md](reference/hooks.md) when the user invokes it with any argument.

**Doctor:** `/impeccable-flutter doctor` reports and repairs drift between this project's Impeccable artifacts (`PRODUCT.md`, `DESIGN.md`, config, surface briefs, the hook) and what this version reads. Load [reference/doctor.md](reference/doctor.md) when the user invokes it. <!-- rule:skill-doctor-route -->

**Never repair drift as a side effect of a design task.** A `CONTEXT_STALE` finding is reported, not acted on, unless the user asks. <!-- rule:skill-drift-not-a-side-quest -->