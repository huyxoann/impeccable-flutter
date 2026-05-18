# Craft Flow

Build a feature with impeccable UX and UI quality: shape the design, land the visual direction, build real production code, and iterate until it meets a high-end studio bar.

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

Run `$impeccable-flutter shape`, passing along whatever feature description the user provided. Shape is **required** for craft.

Present the shape output and stop. Wait for the user to confirm or override before writing code.

## Step 2: Load References

Based on the design brief's "Recommended References", consult the relevant files:
- [spatial-design.md](spatial-design.md) for layout (`Row`/`Column`/`Flex`) and spacing.
- [typography.md](typography.md) for `TextTheme` hierarchy.
- [interaction-design.md](interaction-design.md) for interactions.
- [motion-design.md](motion-design.md) for `flutter_animate` timing.
- [color-and-contrast.md](color-and-contrast.md) for `ColorScheme` usage.

## Step 3: Visual Direction & Assets (Harness-Gated)

If the harness has **native image generation**, this step is mandatory. **Stop and load [codex.md](codex.md)**. 

If the harness lacks native image generation, **state in one line that the visual-direction-by-generation step is being skipped**, then proceed. Implement directly from the brief.

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