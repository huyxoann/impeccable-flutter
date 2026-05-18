# Typography

## Classic Typography Principles

### Modular Scale & Hierarchy

The common mistake: too many font sizes that are too close together (14px, 15px, 16px, 18px...). This creates muddy hierarchy.

**Use fewer sizes with more contrast.** Flutter's `TextTheme` provides a structured 5-level system (Display, Headline, Title, Body, Label) each with Large, Medium, Small variants. Use them!

| Role | Typical Size | Flutter TextTheme |
|------|--------------|-------------------|
| xs | 12px | `labelSmall` / `bodySmall` |
| sm | 14px | `bodyMedium` / `labelMedium` |
| base | 16px | `bodyLarge` / `titleMedium` |
| lg | 20-24px | `titleLarge` / `headlineSmall` |
| xl+ | 32-48px | `headlineMedium` / `displaySmall` |

### Readability & Measure

Line-height (`height` in Flutter's `TextStyle`) scales inversely with line length: narrow columns need tighter leading, wide columns need more. A `height` of `1.5` is standard for body text.

**Non-obvious**: Light text on dark backgrounds needs compensation. Bump the `height` slightly, add a touch of `letterSpacing` (0.1–0.2), and optionally step the body weight up one notch (Regular → Medium).

## Font Selection & Pairing

The tactical selection procedure and the reflex-reject list live in [reference/brand.md](brand.md). 

### Anti-reflexes worth defending against

- A technical/utilitarian brief does NOT need a serif "for warmth." Most tech tools should look like tech tools.
- An editorial/premium brief does NOT need the same expressive serif everyone is using right now. Premium can be Swiss-modern, a literal monospace, or a quiet humanist sans.
- A "modern" brief does NOT need a geometric sans. The most modern thing you can do is not use the font everyone else is using.

**System fonts are underrated**: Not specifying a `fontFamily` in Flutter falls back to Roboto (Android), SF Pro (iOS), or Segoe UI (Windows). This looks native, loads instantly, and is highly readable. Consider this for apps where performance > personality.

### Pairing Principles

**The non-obvious truth**: You often don't need a second font. One well-chosen font family in multiple weights creates cleaner hierarchy than two competing typefaces. Only add a second font when you need genuine contrast (e.g., display headlines + body serif).

When pairing, contrast on multiple axes:
- Serif + Sans (structure contrast)
- Geometric + Humanist (personality contrast)
- Condensed display + Wide body (proportion contrast)

**Never pair fonts that are similar but not identical** (e.g., two geometric sans-serifs).

### Font Loading in Flutter

Ensure your fonts are correctly defined in `pubspec.yaml`. If you are using Google Fonts, use the `google_fonts` package to avoid bundling large font files, but be aware of the runtime network fetch. For production apps, it is highly recommended to bundle the specific font files (and only the weights you need) in your assets.

## Modern Typography in Flutter

### Fluid Type

In Flutter, standard apps do not typically use fluid typography (where font size scales continuously with screen width). They rely on fixed sizes and let the OS scale the text based on accessibility settings (`MediaQuery.textScalerOf(context)`).

If you are building a marketing website in Flutter Web, you might want fluid type for massive Hero headlines. You can achieve this by calculating the font size based on `MediaQuery.sizeOf(context).width`.

### OpenType Features

Most developers don't know these exist in Flutter. Use them for polish:

```dart
Text(
  '123,456',
  style: TextStyle(
    fontFeatures: [
      FontFeature.tabularFigures(), // Tabular numbers for data alignment
      FontFeature.fractions(), // Proper fractions
    ],
  ),
)
```

### Rendering polish

**ALL-CAPS tracking**: capitals sit too close at default spacing. Add `letterSpacing: 1.0` to `2.0` to short all-caps labels, eyebrows, and small headings.

## Typography System Architecture

Use Flutter's `TextTheme`. Do not sprinkle hardcoded `TextStyle(fontSize: 16)` everywhere. Define your entire typography system in your `ThemeData` and access it via `Theme.of(context).textTheme.bodyLarge`.

## Accessibility Considerations

Beyond contrast ratios (which are well-documented), consider:

- **Never disable zoom**: overriding `TextScaler` globally breaks accessibility.
- **Minimum 16px body text**: Smaller than this strains eyes and fails WCAG on mobile.

---

**Avoid**: More than 2-3 font families per project. Hardcoding `TextStyle` in your UI widgets instead of using the `TextTheme`. Using decorative fonts for body text.