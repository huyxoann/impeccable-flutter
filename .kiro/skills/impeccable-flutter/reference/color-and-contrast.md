# Color & Contrast

## Color Spaces: Beyond RGB

While Flutter defines colors using ARGB hex values (`Color(0xFF...)`), designing palettes in RGB or HSL is flawed. HSL is not perceptually uniform, meaning equal steps in lightness *look* unequal. 

**Design in OKLCH or HCT, implement in ARGB.** Use tools that generate OKLCH palettes (or Material 3's HCT palettes via `ColorScheme.fromSeed`), then export the hex values to your Flutter `ThemeData`. 

To build a primary color and its lighter / darker variants manually, hold the chroma+hue roughly constant and vary the lightness, but **reduce chroma as you approach white or black**, because high chroma at extreme lightness looks garish.

The hue you pick is a brand decision and should not come from a default. Do not reach for blue or warm orange by reflex; those are dominant AI-design defaults, not the right answer for every specific brand.

## Building Functional Palettes

### Tinted Neutrals

**Pure gray is dead.** A neutral with zero chroma feels lifeless next to a colored brand. In Flutter, achieve this by tinting your greys towards your primary color:

```dart
// Instead of Colors.grey[200]
final tintedSurface = Color.lerp(Colors.white, primaryColor, 0.02);
final tintedBorder = Color.lerp(Colors.grey[300], primaryColor, 0.05);
```

The hue you tint toward should come from THIS project's brand, not from a "warm = friendly, cool = tech" formula. If your brand color is teal, your neutrals lean toward teal. 

### Palette Structure

A complete system needs:

| Role | Purpose | Flutter ColorScheme |
|------|---------|---------------------|
| **Primary** | Brand, CTAs, key actions | `primary`, `primaryContainer` |
| **Neutral** | Text, backgrounds | `surface`, `onSurface`, `outline` |
| **Semantic** | Success, error, warning | `error`, `errorContainer` |
| **Surface** | Cards, modals, overlays | `surfaceContainer` roles |

**Skip secondary/tertiary unless you need them.** Most apps work fine with one accent color. Adding more creates decision fatigue and visual noise.

### The 60-30-10 Rule (Applied Correctly)

This rule is about **visual weight**, not pixel count:

- **60%**: Neutral backgrounds, white space, base surfaces
- **30%**: Secondary colors: text, borders, inactive states
- **10%**: Accent: CTAs, highlights, focus states

The common mistake: using the accent color everywhere because it's "the brand color." Accent colors work *because* they're rare. Overuse kills their power.

## Contrast & Accessibility

### WCAG Requirements

| Content Type | AA Minimum | AAA Target |
|--------------|------------|------------|
| Body text | 4.5:1 | 7:1 |
| Large text (18px+ or 14px bold) | 3:1 | 4.5:1 |
| UI components, icons | 3:1 | 4.5:1 |
| Non-essential decorations | None | None |

**The gotcha**: Placeholder text still needs 4.5:1. That light gray hint text you see everywhere? Usually fails WCAG.

### Dangerous Color Combinations

These commonly fail contrast or cause readability issues:

- Light gray text on white (the #1 accessibility fail).
- **Gray text on any colored background**: gray looks washed out and dead on color. Use a darker shade of the background color, or `Colors.black54` transparency.
- Red text on green background (or vice versa): 8% of men can't distinguish these.
- Blue text on red background (vibrates visually).

### Never Use Pure Gray or Pure Black

Pure black (`Colors.black`) doesn't exist in nature; real shadows and surfaces always have a color cast. Use very dark greys (e.g., `Color(0xFF121212)`) instead of pure black for dark mode backgrounds.

### Testing

Don't trust your eyes. Use tools to verify contrast ratios between your `foregroundColor` and `backgroundColor`.

## Theming: Light & Dark Mode

### Dark Mode Is Not Inverted Light Mode

You can't just swap colors. Dark mode requires different design decisions:

| Light Mode | Dark Mode |
|------------|-----------|
| Shadows for depth | Lighter surfaces for depth (no shadows) |
| Dark text on light | Light text on dark |
| Vibrant accents | Desaturate accents slightly |
| White backgrounds | Never pure black; use dark gray |

In dark mode, depth comes from surface lightness, not shadow. Build a 3-step surface scale where higher elevations are lighter. Use the SAME hue and chroma as your brand color and only vary the lightness. 

### Token Hierarchy

Use `ThemeData` to define your semantic colors. Access them via `Theme.of(context).colorScheme` rather than hardcoding `Colors.blue` in your widgets.

## Alpha Is A Design Smell

Heavy use of transparency (`withOpacity()`) usually means an incomplete palette. Alpha creates unpredictable contrast, performance overhead (forcing `saveLayer` passes), and inconsistency. Define explicit solid colors for each context instead. Exception: focus rings and interactive splash effects where see-through is needed.

---

**Avoid**: Relying on color alone to convey information. Creating palettes without clear roles for each color. Using pure black (`Colors.black`) for large areas. Skipping color blindness testing (8% of men affected).