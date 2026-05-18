Start your response with:

```
──────────── ⚡ OVERDRIVE ─────────────
》》》 Entering overdrive mode...
```

Push an interface past conventional limits. This isn't just about visual effects. It's about using the full power of the Flutter engine to make any part of an interface feel extraordinary: a list that handles a million rows seamlessly, a dialog that physically morphs from its trigger, a form that validates instantly with fluid feedback, a page transition that feels cinematic.

**EXTRA IMPORTANT FOR THIS COMMAND**: Context determines what "extraordinary" means. A custom Fragment Shader on a creative portfolio is impressive. The same shader on a settings page is embarrassing. But a settings page with instant optimistic saves and perfectly fluid `Hero` animations? That's extraordinary too. Understand the project's personality and goals before deciding what's appropriate.

### Propose Before Building

This command has the highest potential to misfire. Do NOT jump straight into implementation. You MUST:

1. **Think through 2-3 different directions**: consider different techniques, levels of ambition, and aesthetic approaches. For each direction, briefly describe what the result would look and feel like.
2. **STOP and ask the user** to present these directions and get the user's pick before writing any code. Explain trade-offs (performance cost, complexity, maintenance).
3. Only proceed with the direction the user confirms.

Skipping this step risks building something embarrassing that needs to be thrown away.

### Iterate with Device Testing

Technically ambitious effects almost never work perfectly on the first try. You MUST verify your work on a physical device. Do not assume the effect is smooth based on the desktop emulator or a web build. The gap between "technically works" and "looks extraordinary" is closed through visual iteration and profiling.

---

## Assess What "Extraordinary" Means Here

The right kind of technical ambition depends entirely on what you're working with. Before choosing a technique, ask: **what would make a user of THIS specific interface say "wow, that's nice"?**

### For visual/marketing surfaces
Onboarding screens, hero sections, portfolios: the "wow" is often sensory: a scroll-driven reveal, a custom GLSL shader background, a cinematic page transition, generative art that responds to touch.

### For functional UI
Tables, forms, dialogs, navigation: the "wow" is in how it FEELS: a dialog that morphs perfectly from the button that triggered it using `Hero` animations, a `ListView` that renders 100k items at 120fps, a form with streaming validation that feels instant, drag-and-drop with accurate spring physics.

### For data-heavy interfaces
Charts and dashboards: the "wow" is in fluidity: custom `CustomPaint` rendering for datasets too large for standard widgets, animated transitions between data states, interactive gestures.

**The common thread**: something about the implementation goes beyond what users expect from a standard app. The technique serves the experience, not the other way around.

## The Toolkit

Organized by what you're trying to achieve, not by technology name.

### Make transitions feel cinematic
- **`Hero` Animations**: Shared element morphing between routes. A list item expanding into a detail page. This is the cornerstone of premium Flutter navigation.
- **Custom `PageRouteBuilder`**: Instead of the default slide/fade, write custom page transitions using `Stack`, `Transform`, and `ScaleTransition`.
- **Spring physics**: Natural motion with mass, tension, and damping instead of `Curves.easeOut`. Use `SpringSimulation` to drive custom `AnimationController`s.

### Tie animation to scroll position
- **`Sliver`s and `ScrollController`s**: Drive animations directly from the scroll offset.
- **`SliverPersistentHeader`**: Headers that morph and shrink based on scroll position.
- **Parallax**: Translate images or background elements at a fraction of the scroll speed.

### Render beyond standard widgets
- **`CustomPaint`**: Custom drawing on a canvas. Use this for complex charts, organic shapes, or generative art that would be too heavy if built out of individual `Container`s.
- **Fragment Shaders (`FragmentProgram`)**: Load custom `.frag` GLSL shaders directly into Flutter for high-performance GPU pixel effects (noise, distortion, fluid dynamics).
- **Flame Engine**: If the UI requires game-like rendering or physics, embed a Flame widget.

### Make data feel alive
- **`SliverList` / `ListView.builder`**: Virtual scrolling for massive datasets. Render only what's visible.
- **Animated Data**: Don't just `setState` a chart; use `TweenAnimationBuilder` to animate the bars/lines from their old values to their new values.

### Push performance boundaries
- **Dart `Isolate`s (`compute`)**: Move heavy computation off the main UI thread. JSON parsing, image manipulation, large list filtering: anything that would cause jank.
- **`RepaintBoundary`**: Isolate complex animations from static content to prevent the entire screen from repainting 60 times a second.

### Interact with the device
- **Sensors (`sensors_plus`)**: Accelerometer/Gyroscope data for tilt-based parallax effects.
- **Haptics (`HapticFeedback`)**: Physical feedback tied to digital actions.

## Implement with Discipline

### Progressive enhancement is non-negotiable

Every technique must degrade gracefully. The experience without the enhancement must still be usable. If a shader fails to compile, the background should gracefully fall back to a solid color or gradient.

### Performance rules

- Target 60fps (or 120fps on capable devices). If dropping frames in Profile mode, simplify.
- Respect `MediaQuery.disableAnimationsOf(context)`, always. Provide a beautiful static alternative.
- Move heavy processing to `Isolate`s.
- Test on real mid-range devices, not just the iOS Simulator or high-end dev machine.

### Polish is the difference

The gap between "cool" and "extraordinary" is in the last 20% of refinement: the easing curve on a spring animation, the timing offset in a staggered reveal, the subtle haptic tap that makes a transition feel physical. Don't ship the first version that works; ship the version that feels inevitable.

**NEVER**:
- Ignore `MediaQuery.disableAnimationsOf(context)`. This is an accessibility requirement, not a suggestion.
- Ship effects that cause jank on mid-range devices.
- Add sound without explicit user opt-in.
- Layer multiple competing extraordinary moments. Focus creates impact, excess creates noise.

## Verify the Result

- **The wow test**: Show it to someone who hasn't seen it. Do they react?
- **The removal test**: Take it away. Does the experience feel diminished, or does nobody notice?
- **The device test**: Run it on an older phone. Still smooth?
- **The accessibility test**: Enable reduced motion. Still usable?
- **The context test**: Does this make sense for THIS brand and audience?

"Technically extraordinary" isn't about using the newest API. It's about making an interface do something users didn't think an app could do so smoothly.