# Craft Flow

Build a feature with impeccable-flutter UX and UI quality: shape the design, land the visual direction, build real production code, and iterate until it meets a high-end studio bar.

Before writing code, you need: PRODUCT.md loaded, register identified and the matching reference loaded, and a confirmed design direction for this task.

### Gates: do not compress

Craft has **multiple user gates**, not one. 

1. **Shape brief confirmed** (Step 1)
2. **Direction questions answered** (codex.md Step A)
3. **Palette confirmed** (codex.md Step B)
4. **One mock direction approved or delegated** (codex.md Step D)

You must stop at every gate. **Shape confirmation alone is NOT a green light to start coding.** 

## Step 0: Project Foundation

Before shape, before code: figure out what kind of project you're working in.

Look at the working directory. Check for:

- **Flutter environment**: `pubspec.yaml`, `lib/main.dart`, `android/`, `ios/`. Use the project's existing structure. Do not start a parallel build. Whatever pipeline the project has, respect it.
- **Existing design system**: `lib/core/theme/`, `lib/widgets/`, `lib/components/`. Read what's there before adding to it.
- **Existing packages**: Are they using `go_router`, `flutter_animate`, specific state management (Riverpod/Provider)? **Use what's already in the project**.

If the directory is empty (greenfield), don't pick a state management pattern silently. Ask the user via the AskUserQuestion tool with sensible defaults.

## Step 1: Shape the Design

Run `/impeccable-flutter shape`, passing along whatever feature description the user provided. Shape is **required** for craft.

Present the shape output and stop. Wait for the user to confirm or override before writing code.

## Step 2: Load References

Based on the design brief's "Recommended References", consult the relevant files:
- [spatial-design.md](spatial-design.md) for layout (`Row`/`Column`/`Flex`) and spacing.
- [typography.md](typography.md) for `TextTheme` hierarchy.
- [interaction-design.md](interaction-design.md) for interactions.
- [motion-design.md](motion-design.md) for `flutter_animate` timing.
- [color-and-contrast.md](color-and-contrast.md) for `ColorScheme` usage.

## Step 3: Web Preview Stage & Live Variant Exploration (Default Before `.dart` Code)

Before writing or modifying production Flutter `.dart` files, prototype the screen on the **Flutter Web Preview Stage** so the user can visually inspect, tweak parameters, and approve the exact UI in their browser:

1. Boot the built-in preview stage via `node .cursor/skills/impeccable-flutter/scripts/live.mjs --preview` and load [live.md](live.md).
2. Sync the project's theme tokens (`DESIGN.md` / `lib/core/theme/`) into `:root` and `#flutter-viewport[data-theme="dark"]` in `.impeccable-flutter/preview/index.html`.
3. Render the shaped screen inside `<main id="flutter-screen">` (393×852 Mobile/Tablet frame with Light/Dark toggle), tagging every widget/section with `data-flutter-file="lib/..."` and `data-flutter-widget="WidgetName"`.
4. Open `previewUrl` (`http://localhost:<serverPort>/preview`) and start `node .cursor/skills/impeccable-flutter/scripts/live-poll.mjs`. The user can click any widget on the stage, request 3 variants (`bolder`, `quieter`, `layout`, `colorize`, etc.), drag the Tune knobs (`data-impeccable-params`), and click **Accept ✓**.
5. Each time the user clicks **Accept ✓** on the stage (or confirms the full screen preview), immediately translate the accepted HTML/CSS + tuned parameter values into production Flutter `.dart` code in Step 4 below while keeping the Live session open until the user exits.
6. *(Optional)* If the harness also has native image generation and raster plates/illustrations are needed, consult [codex.md](codex.md).

## Step 4: Build to Production Quality

Implement the feature following the design brief. Build in passes so structure, visual system, states, motion, and responsive behavior each get deliberate attention.

### Production bar

- **Real content.** No placeholder copy, dead buttons, or unused scaffold at presentation time.
- **Preserve the approved direction.** 
- **Semantic first.** Proper use of `Semantics` widgets if building custom controls.
- **Deliberate spacing and alignment.** No default gaps, arbitrary `Padding`, or accidental optical misalignment. Use `SizedBox` or `spacing` properties.
- **Intentional typography.** Clear hierarchy via `Theme.of(context).textTheme`. No overflow at any width.
- **Realistic state coverage.** Default, hovered, focused, pressed, disabled, loading, error, success, empty.
- **Finished interaction quality.** Touch targets (44px min), feedback timing (`InkWell`/haptics), state transitions.
- **Respect the build pipeline.** Edit `.dart` source files. Don't write generated code straight to outputs.
- **Optimized imagery.** Correct dimensions, caching (`cached_network_image`), `BoxFit.cover`.
- **Premium motion.** Use `flutter_animate` or explicit `AnimationController`s when they improve the experience. Bound expensive paint operations.
- **Maintainable.** Reusable `StatelessWidget` patterns, clear component boundaries.
- **Technically clean.** `flutter analyze` passes, no `RenderFlex` overflow errors.
- **Ask when uncertain.** Don't guess.

## Step 5: Iterate Visually

Look at what you built. Use whatever tools you have to verify the visual outcome (emulator screenshots, logs, or asking the user).

Actively check: responsive behavior (`LayoutBuilder`), every state (empty / error / loading / edge), craft details (spacing, alignment, hierarchy, contrast, motion timing), performance basics (no jank).

## Step 6: Present

Present the result to the user:
- Show the feature in its primary state.
- Walk through the key states.
- Explain design decisions connecting back to the brief.
- Note limitations.
- Ask: "What's working? What isn't?"