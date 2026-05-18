Typography carries most of the information on the page. Replace generic defaults (system fallback at flat scale) with type that reflects the brand and scales with intentional contrast.

---

## Register

Brand: run the font selection procedure in [brand.md](brand.md). Pairing follows the brand's lane (display serif + sans body for editorial/luxury, one committed sans for tech, etc.).

Product: system fonts and familiar sans stacks are legitimate here. One well-tuned family typically carries the whole UI.

---

## Assess Current Typography

Analyze what's weak or generic about the current type:

1. **Font choices**:
   - Are we using invisible defaults? (Roboto, SF Pro defaults without intent)
   - Does the font match the brand personality? (A playful brand shouldn't use a corporate typeface)
   - Are there too many font families? (More than 2-3 is almost always a mess)

2. **Hierarchy**:
   - Can you tell headings from body from captions at a glance?
   - Are font sizes too close together? (14px, 15px, 16px = muddy hierarchy)
   - Are weight contrasts strong enough? (Medium vs Regular is barely visible)

3. **Sizing & scale**:
   - Is there a consistent `TextTheme`, or are sizes arbitrary?
   - Does body text meet minimum readability? (16px+)

4. **Readability**:
   - Are line lengths comfortable? (Limit width of text containers)
   - Is `height` (line-height) appropriate for the font and context?
   - Is there enough contrast between text and background?

5. **Consistency**:
   - Are the same elements styled the same way throughout?
   - Are font weights used consistently? (Not bold in one section, semibold in another for the same role)
   - Is `letterSpacing` intentional or default everywhere?

**CRITICAL**: The goal isn't to make text "fancier." It's to make it clearer, more readable, and more intentional. Good typography is invisible; bad typography is distracting.

## Plan Typography Improvements

Consult the [typography reference](typography.md) for detailed guidance on scales and pairing.

Create a systematic plan:

- **Font selection**: Do fonts need replacing? What fits the brand/context?
- **Type scale**: Establish a clear mapping to Flutter's `TextTheme`.
- **Weight strategy**: Which weights serve which roles?
- **Spacing**: Line-heights (`height`), `letterSpacing`, and margins between typographic elements.

## Improve Typography Systematically

### Font Selection

If fonts need replacing:
- Choose fonts that reflect the brand personality.
- Pair with genuine contrast (serif + sans, geometric + humanist), or use a single family in multiple weights.
- Bundle the font files in `assets/` and declare them in `pubspec.yaml` instead of relying entirely on network fetches if performance is key.

### Establish Hierarchy

Build a clear type scale using `ThemeData`:
- **Use Flutter's TextTheme roles**: `display`, `headline`, `title`, `body`, `label`.
- **Combine dimensions**: Size + weight + color + space for strong hierarchy. Don't rely on size alone.

### Fix Readability

- Set a `maxWidth` (e.g., using `ConstrainedBox`) on text containers if they span too wide on desktop/tablet.
- Adjust `height` per context: tighter for headings (1.1-1.2), looser for body (1.5-1.7).
- Increase `height` slightly for light-on-dark text.

### Refine Details

- Use `FontFeature.tabularFigures()` for data tables and numbers that should align.
- Apply proper `letterSpacing`: slightly open for all-caps labels, default or tight for large display text.
- Use semantic access (`Theme.of(context).textTheme.bodyLarge`), not hardcoded `TextStyle(fontSize: 16)`.

### Weight Consistency

- Define clear roles for each weight and stick to them.
- Don't use more than 3-4 weights (Regular, Medium, Semibold, Bold is plenty).
- Only declare the weights you actually use in your `pubspec.yaml` to save app bundle size.

**NEVER**:
- Use more than 2-3 font families.
- Pick sizes arbitrarily; commit to a `TextTheme`.
- Set body text below 16px.
- Use decorative/display fonts for body text.
- Override `MediaQuery.textScaler` globally to disable zoom.
- Hardcode `TextStyle` everywhere.

## Verify Typography Improvements

- **Hierarchy**: Can you identify heading vs body vs caption instantly?
- **Readability**: Is body text comfortable to read in long passages?
- **Consistency**: Are same-role elements using the same `TextTheme` property?
- **Personality**: Does the typography reflect the brand?
- **Accessibility**: Does text meet WCAG contrast ratios? Does it scale properly when device text size is increased?

When the type carries the hierarchy on its own, hand off to `$impeccable-flutter polish` for the final pass.