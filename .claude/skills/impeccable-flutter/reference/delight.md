> **Additional context needed**: what's appropriate for the domain (playful vs professional vs quirky vs elegant).

Find the moments where personality and unexpected polish would turn a functional interface into one users remember and tell other people about. Add only where the moment earns it; delight everywhere reads as noise.

---

## Register

Brand: delight can be distributed across copy voice, section transitions, discovery rewards, seasonal touches, personality across the whole surface.

Product: delight at specific moments, not pages. Completion, first-time actions, error recovery, milestone crossings. Reliability and consistency carry the rest of the experience; delight pushed everywhere reads as noise.

---

## Assess Delight Opportunities

Identify where delight would enhance (not distract from) the experience:

1. **Find natural delight moments**:
   - **Success states**: Completed actions (save, send, publish)
   - **Empty states**: First-time experiences, onboarding
   - **Loading states**: Waiting periods that could be entertaining
   - **Achievements**: Milestones, streaks, completions
   - **Interactions**: Taps, drags, long-presses
   - **Errors**: Softening frustrating moments
   - **Easter eggs**: Hidden discoveries for curious users

2. **Understand the context**:
   - What's the brand personality? (Playful? Professional? Quirky? Elegant?)
   - Who's the audience? (Tech-savvy? Creative? Corporate?)
   - What's the emotional context? (Accomplishment? Exploration? Frustration?)
   - What's appropriate? (Banking app ≠ gaming app)

3. **Define delight strategy**:
   - **Subtle sophistication**: Refined micro-interactions (luxury brands)
   - **Playful personality**: Whimsical illustrations and copy (consumer apps)
   - **Helpful surprises**: Anticipating needs before users ask (productivity tools)
   - **Sensory richness**: Satisfying sounds, smooth animations, haptics (creative tools)

If any of these are unclear from the codebase, STOP and ask the user to clarify what you cannot infer.

**CRITICAL**: Delight should enhance usability, never obscure it. If users notice the delight more than accomplishing their goal, you've gone too far.

## Delight Principles

Follow these guidelines:

### Delight Amplifies, Never Blocks
- Delight moments should be quick (< 1 second)
- Never delay core functionality for delight
- Make delight skippable or subtle
- Respect user's time and task focus

### Surprise and Discovery
- Hide delightful details for users to discover
- Reward exploration and curiosity
- Don't announce every delight moment
- Let users share discoveries with others

### Appropriate to Context
- Match delight to emotional moment (celebrate success, empathize with errors)
- Respect the user's state (don't be playful during critical errors)
- Match brand personality and audience expectations
- Cultural sensitivity (what's delightful varies by culture)

### Compound Over Time
- Delight should remain fresh with repeated use
- Vary responses (not same animation every time)
- Reveal deeper layers with continued use
- Build anticipation through patterns

## Delight Techniques

Add personality and joy through these methods:

### Micro-interactions & Animation

**Button delight (using flutter_animate)**:
```dart
// Satisfying button press
GestureDetector(
  onTapDown: (_) => controller.forward(),
  onTapUp: (_) => controller.reverse(),
  child: Container(
    // ...
  ).animate(controller: controller, autoPlay: false).scale(end: const Offset(0.95, 0.95), duration: 100.ms),
)
```

**Loading delight**:
- Playful loading animations (not just spinners; consider `Lottie` animations).
- Personality in loading messages (write product-specific ones, not generic AI filler).
- Progress indication with encouraging messages.
- Skeleton screens (`skeletonizer`) with subtle shimmer animations.

**Success animations**:
- Checkmark draw animation (using a custom `AnimationController` and `CustomPaint`).
- Confetti burst for major achievements (e.g., `confetti` package).
- Gentle scale + fade for confirmation.
- Haptic feedback (`HapticFeedback.lightImpact()`).

### Personality in Copy

**Playful error messages**:
```
"Error 404"
"This page is playing hide and seek. (And winning)"

"Connection failed"
"Looks like the internet took a coffee break. Want to retry?"
```

**Encouraging empty states**:
```
"No projects"
"Your canvas awaits. Create something amazing."

"No messages"
"Inbox zero! You're crushing it today."
```

**Playful labels & tooltips**:
```
"Delete"
"Send to void" (for playful brand)

"Help"
"Rescue me" (tooltip)
```

**IMPORTANT**: Match copy personality to brand. Banks shouldn't be wacky, but they can be warm.

### Illustrations & Visual Personality

**Custom illustrations**:
- Empty state illustrations (not stock icons).
- Error state illustrations (friendly monsters, quirky characters).
- Loading state illustrations.
- Success state illustrations (celebrations).

**Icon personality**:
- Custom icon set matching brand personality.
- Animated icons (e.g. `AnimatedIcon` or `flutter_animate` on state changes).
- Consistent style across all icons.

**Background effects**:
- Subtle particle effects (`CustomPaint`).
- Gradient mesh backgrounds (`ShaderMask` or complex `BoxDecoration`s).
- Geometric patterns.
- Parallax depth (`SliverAppBar` or tracking scroll positions).
- Time-of-day themes (morning vs night themes).

### Satisfying Interactions

**Drag and drop delight**:
- Lift effect on drag (increase elevation/shadow, scale up slightly).
- Snap animation when dropped.
- Satisfying placement haptics (`HapticFeedback.mediumImpact()`).

**Toggle switches**:
- Smooth slide with spring physics (`SpringSimulation`).
- Color transition.
- Haptic feedback on toggle.

**Progress & achievements**:
- Streak counters with celebratory milestones.
- Progress bars that "celebrate" at 100%.
- Badge unlocks with animation.

### Sensory Feedback (Haptics & Sound)

**Haptics (Crucial for Mobile)**:
- `HapticFeedback.lightImpact()` for minor interactions like selecting a tab.
- `HapticFeedback.mediumImpact()` for toggles and drag-and-drop.
- `HapticFeedback.heavyImpact()` for completing major actions.
- `HapticFeedback.vibrate()` for errors.

**Subtle audio cues** (when appropriate):
- Notification sounds (distinctive but not annoying).
- Success sounds (satisfying "ding").
- Error sounds (empathetic, not harsh).

**IMPORTANT**:
- Respect system sound settings.
- Provide a mute option.
- Keep volumes quiet (subtle cues, not alarms).
- Don't play on every interaction (sound fatigue is real).

### Easter Eggs & Hidden Delights

**Discovery rewards**:
- Hidden gestures (e.g., long-press the logo for a special theme).
- Alt text jokes on images (for screen reader users too!).
- Console/Log messages for developers ("Like what you see? We're hiring!").

### Loading & Waiting States

**Make waiting engaging**:
- Interesting loading messages that rotate.
- Progress bars with personality.
- Fun facts or tips while waiting.

```
Loading messages: write ones specific to your product, not generic AI filler:
- "Crunching your latest numbers..."
- "Syncing with your team's changes..."
- "Preparing your dashboard..."
```

**WARNING**: Avoid cliched loading messages like "Teaching robots to dance". These are AI-slop copy, instantly recognizable as machine-generated.

## Implementation Patterns in Flutter

**Animation libraries**:
- `flutter_animate` (Declarative, chainable animations).
- `lottie` (Complex After Effects animations exported to JSON).
- `rive` (High-performance interactive animations).

**Sound libraries**:
- `audioplayers` (Audio management).

**Physics**:
- `flutter/physics.dart` (Spring simulations).

**IMPORTANT**: Asset size matters. Compress images, optimize animations, lazy load delight features if they are heavy.

**NEVER**:
- Delay core functionality for delight.
- Force users through delightful moments (make skippable).
- Use delight to hide poor UX.
- Overdo it (less is more).
- Ignore accessibility (animate responsibly, provide alternatives for screen readers).
- Sacrifice performance for delight (no janky animations).

## Verify Delight Quality

Test that delight actually delights:

- **User reactions**: Do users smile?
- **Doesn't annoy**: Still pleasant after the 100th time?
- **Doesn't block**: Can users opt out or skip?
- **Performant**: No jank, no slowdown in Profile mode.
- **Appropriate**: Matches brand and context.

When the moments feel earned, hand off to `$impeccable-flutter polish` for the final pass.