# Motion Design

## Duration: The 100/300/500 Rule

Timing matters more than easing. These durations feel right for most UI:

| Duration | Use Case | Examples |
|----------|----------|----------|
| **100-150ms** | Instant feedback | Button press, toggle, color change |
| **200-300ms** | State changes | Overlay open, tooltip, active states |
| **300-500ms** | Layout changes | Expansion panel, modal, drawer |
| **500-800ms** | Entrance animations | Page load, hero reveals |

**Exit animations are faster than entrances.** Use ~75% of enter duration.

## Easing: Pick the Right Curve

**Don't use `Curves.ease`.** It's a compromise that's rarely optimal. Instead:

| Curve | Use For |
|-------|---------|
| **Curves.easeOut** | Elements entering |
| **Curves.easeIn** | Elements leaving |
| **Curves.easeInOut** | State toggles (there → back) |

**For micro-interactions, use exponential curves.** They feel natural because they mimic real physics (friction, deceleration):

```dart
// Quart out - smooth, refined (recommended default)
Curves.easeOutQuart;

// Quint out - slightly more dramatic
Curves.easeOutQuint;

// Expo out - snappy, confident
Curves.easeOutExpo;
```

**Avoid `Curves.bounceOut` and `Curves.elasticOut`.** They were trendy in 2015 but now feel tacky and amateurish. Real objects don't bounce when they stop; they decelerate smoothly. Overshoot effects draw attention to the animation itself rather than the content.

## Premium Motion Materials

`Transform` and `AnimatedOpacity` are reliable defaults, but premium interfaces often need atmospheric properties. Flutter provides excellent tools for this:

- **Transform / Opacity**: Movement, press feedback, simple reveals.
- **BackdropFilter / ImageFilter**: Focus pulls, depth, glass effects (`ImageFilter.blur`), softened entrances.
- **ClipPath / ClipRRect**: Wipes, reveals, editorial cropping.
- **ShaderMask**: Advanced gradient-position movement and custom fragment shaders.
- **AnimatedSize**: Expanding and reflowing layout without manually animating heights.

The hard rule is not "transform and opacity only." The hard rule is: avoid forcing layout passes on every frame, keep expensive effects (`BackdropFilter`, `ShaderMask`) bounded to small or isolated areas, and verify in Profile mode that the result is smooth on physical devices.

## Staggered Animations

Use the `flutter_animate` package for clean stagger implementations without boilerplate:

```dart
Column(
  children: [
    Text("One"),
    Text("Two"),
    Text("Three"),
  ].animate(interval: 50.ms).fade().slideY(curve: Curves.easeOutQuart),
)
```

**Cap total stagger time**: 10 items at 50ms = 500ms total. For many items, reduce the per-item interval or only animate the first few visible items on screen.

## Reduced Motion

This is not optional. Vestibular disorders affect ~35% of adults over 40.

```dart
Widget build(BuildContext context) {
  final disableAnimations = MediaQuery.disableAnimationsOf(context);

  if (disableAnimations) {
    // Provide a static alternative or a very simple cross-fade
    return _buildStaticContent();
  }

  // Normal animated content
  return _buildAnimatedContent();
}
```

**What to preserve**: Functional animations like progress bars, loading spinners (slowed down), and focus indicators should still work, just without spatial movement.

## Perceived Performance

**Nobody cares how fast your app is, just how fast it feels.** Perception can be as effective as actual performance.

**The 80ms threshold**: Our brains buffer sensory input for ~80ms to synchronize perception. Anything under 80ms feels instant and simultaneous. This is your target for micro-interactions (like `InkWell` splashes).

**Active vs passive time**: Passive waiting (staring at a `CircularProgressIndicator`) feels longer than active engagement. Strategies to shift the balance:

- **Preemptive start**: Begin transitions immediately while loading (e.g., standard iOS navigation zoom). Users perceive work happening.
- **Early completion**: Show content progressively, don't wait for everything. Skeleton screens (`skeletonizer` package) are much better than empty screens with spinners.
- **Optimistic UI**: Update the interface immediately, handle failures gracefully. Instagram likes work offline; the UI updates instantly, syncs later. Use for low-stakes actions; avoid for payments or destructive operations.

**Easing affects perceived duration**: Ease-in (accelerating toward completion) makes tasks feel shorter because the peak-end effect weights final moments heavily. Ease-out feels satisfying for entrances, but ease-in toward a task's end compresses perceived time.

## Performance Gotchas in Flutter

- **`SaveLayer` calls**: `Opacity` and `ColorFilter` can trigger expensive `saveLayer` calls if they contain multiple overlapping children. Use `AnimatedOpacity` instead of manually animating an `Opacity` widget, and prefer modifying the alpha of a `Color` directly rather than wrapping it in an `Opacity` widget.
- **Clipping**: `ClipRRect` and `ClipPath` are more expensive than you think. Don't wrap them around entire scrolling lists if you can avoid it.
- **Profile Mode**: Never judge animation performance in Debug mode. Always run `flutter run --profile` on a real device.

---

**Avoid**: Animating everything (animation fatigue is real). Using >500ms for UI feedback. Ignoring `MediaQuery.disableAnimationsOf(context)`. Using animation to hide slow loading.