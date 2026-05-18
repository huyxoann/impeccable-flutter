> **Additional context needed**: performance constraints and target devices (mobile vs desktop).

Add motion that conveys state, gives feedback, and clarifies hierarchy. Cut motion that exists only for decoration. Animation fatigue is a real cost; spend the budget on the moments that need it.

---

## Register

Brand: orchestrated page-load sequences, staggered reveals, scroll-driven animation. Motion is part of the voice; one well-rehearsed entrance beats scattered micro-interactions.

Product: 150–250 ms on most transitions. Motion conveys state: feedback, reveal, loading, transitions between views. No page-load choreography; users are in a task and won't wait for it.

---

## Assess Animation Opportunities

Analyze where motion would improve the experience:

1. **Identify static areas**:
   - **Missing feedback**: Actions without visual acknowledgment (button taps, form submission, etc.)
   - **Jarring transitions**: Instant state changes that feel abrupt (show/hide, route changes in `Navigator`)
   - **Unclear relationships**: Spatial or hierarchical relationships that aren't obvious
   - **Lack of delight**: Functional but joyless interactions
   - **Missed guidance**: Opportunities to direct attention or explain behavior

2. **Understand the context**:
   - What's the personality? (Playful vs serious, energetic vs calm)
   - What's the performance budget? (Low-end Android? 120Hz iOS device?)
   - Who's the audience? (Motion-sensitive users? Power users who want speed?)
   - What matters most? (One hero animation vs many micro-interactions?)

If any of these are unclear from the codebase, STOP and ask the user to clarify what you cannot infer.

**CRITICAL**: Respect `MediaQuery.disableAnimationsOf(context)`. Always provide non-animated alternatives for users who need them.

## Plan Animation Strategy

Create a purposeful animation plan:

- **Hero moment**: What's the ONE signature animation? (Page load? Hero section? Key interaction?)
- **Feedback layer**: Which interactions need acknowledgment?
- **Transition layer**: Which state changes need smoothing?
- **Delight layer**: Where can we surprise and delight?

**IMPORTANT**: One well-orchestrated experience beats scattered animations everywhere. Focus on high-impact moments.

## Implement Animations

Add motion systematically across these categories:

### Entrance Animations
- **Page load choreography**: Stagger element reveals using `flutter_animate`'s `interval` property (50-100ms delays), fade + slide combinations.
- **Hero section**: Dramatic entrance for primary content (scale, parallax, or custom `ShaderMask` effects).
- **Content reveals**: Scroll-triggered animations using `Sliver`s or `VisibilityDetector`.
- **Modal/drawer entry**: Smooth slide + fade via `showModalBottomSheet`'s transition builder.

### Micro-interactions
- **Button feedback**:
  - Tap: Quick scale down then up (0.95 → 1) using `InkResponse` or custom `GestureDetector`.
  - Loading: `CircularProgressIndicator` sized to the text, or a subtle pulse state.
- **Form interactions**:
  - Input focus: `OutlineInputBorder` color transition, slight scale or glow.
  - Validation: Shake on error (using `flutter_animate` `.shake()`), smooth color transitions.
- **Toggle switches**: Smooth slide + color transition (200-300ms) using `AnimatedContainer` or `Switch`.

### State Transitions
- **Show/hide**: `AnimatedOpacity` + `AnimatedSlide` (not instant), appropriate timing (200-300ms).
- **Expand/collapse**: `AnimatedSize` or `ExpansionPanel` for height transitions.
- **Loading states**: Skeleton screens (e.g., `skeletonizer` package), progress bars.
- **Success/error**: Color transitions, icon animations, gentle scale pulse.

### Navigation & Flow
- **Page transitions**: `CupertinoPageTransition` or custom `PageRouteBuilder` for shared element transitions (`Hero` widgets).
- **Tab switching**: `TabBarView` slide indicator, content fade/slide.
- **Scroll effects**: `SliverAppBar` parallax layers, sticky headers with state changes.

## Technical Implementation

Use appropriate techniques for each animation. We strongly recommend the **`flutter_animate`** package for declarative, chainable animations, and explicit `AnimationController`s only when complex orchestration is required.

### Timing & Easing

**Durations by purpose:**
- **100-150ms**: Instant feedback (button tap, toggle)
- **200-300ms**: State changes (hover, menu open)
- **300-500ms**: Layout changes (accordion, modal)
- **500-800ms**: Entrance animations (page load)

**Easing curves (use these, not Flutter's default `Curves.ease`):**
```dart
/* Recommended: natural deceleration */
Curves.easeOutQuart    // Smooth
Curves.easeOutQuint    // Slightly snappier
Curves.easeOutExpo     // Confident, decisive

/* AVOID: feel dated and tacky */
// Curves.bounceOut
// Curves.elasticOut
```

**Exit animations are faster than entrances.** Use ~75% of enter duration.

### Flutter Implementation Examples

```dart
// The flutter_animate way (Highly Recommended)
Text("Hello").animate().fade(duration: 300.ms).slideY(begin: 0.2, curve: Curves.easeOutQuart);

// Staggered list
Column(
  children: items.animate(interval: 50.ms).fade().slideX(),
);

// Built-in implicit animations (Good for state changes)
AnimatedContainer(
  duration: const Duration(milliseconds: 250),
  curve: Curves.easeOutQuart,
  color: isActive ? primaryColor : Colors.transparent,
);
```

### Performance
- **Avoid `SaveLayer`**: Be careful with `Opacity` and `ShaderMask` wrapped around large subtrees as they can force expensive offscreen rendering buffers. Use `AnimatedOpacity` which is optimized.
- **Use `Transform`**: Scaling and translating via `Transform` is GPU-accelerated and much cheaper than animating `width` or `height` inside a layout.
- **Monitor FPS**: Ensure 60fps (or 120fps on ProMotion devices) by checking the Flutter Performance overlay.

### Accessibility
```dart
// Check user preference
final disableAnimations = MediaQuery.disableAnimationsOf(context);

if (disableAnimations) {
  // Return static widget or simple cross-fade
}
```

**NEVER**:
- Use `Curves.bounceOut` or `Curves.elasticOut` easing curves; they feel dated and draw attention to the animation itself.
- Animate layout constraints casually (`width`, `height`, padding) when `Transform` would work, unless explicitly expanding/collapsing content via `AnimatedSize`.
- Use durations over 500ms for feedback (it feels laggy).
- Animate without purpose (every animation needs a reason).
- Ignore `MediaQuery.disableAnimationsOf(context)` (this is an accessibility violation).
- Block the UI thread with heavy synchronous calculations during an animation.

## Verify Quality

Test animations thoroughly:

- **Smooth at 60/120fps**: No jank on target devices (Profile mode, not Debug).
- **Feels natural**: Easing curves feel organic, not robotic.
- **Appropriate timing**: Not too fast (jarring) or too slow (laggy).
- **Reduced motion works**: Animations disabled or simplified appropriately.
- **Doesn't block**: Users can interact during/after animations.

When the motion clarifies state instead of decorating it, hand off to `$impeccable-flutter polish` for the final pass.