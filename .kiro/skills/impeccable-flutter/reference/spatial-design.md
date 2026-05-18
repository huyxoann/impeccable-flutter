# Spatial Design

## Spacing Systems

### Use 4pt Base, Not 8pt

8pt systems are too coarse; you'll frequently need 12px (between 8 and 16). Use 4pt for granularity: 4, 8, 12, 16, 24, 32, 48, 64, 96px.

### Define Spacing Constants

Flutter doesn't have a built-in global spacing scale in `ThemeData`. Create a class of constants or a `ThemeExtension` to enforce this mathematically rather than using arbitrary `SizedBox(height: 15)` calls.

```dart
class AppSpacing {
  static const double sm = 8.0;
  static const double md = 16.0;
  static const double lg = 24.0;
}
```

## Grid Systems

### The Self-Adjusting Grid

Use `SliverGridDelegateWithMaxCrossAxisExtent` or a responsive wrapper package for responsive grids without hardcoded breakpoints. Columns are at least `maxCrossAxisExtent` wide, as many as fit per row, and leftovers stretch. 

## Visual Hierarchy

### The Squint Test

Blur your eyes (or screenshot and blur). Can you still identify:
- The most important element?
- The second most important?
- Clear groupings?

If everything looks the same weight blurred, you have a hierarchy problem.

### Hierarchy Through Multiple Dimensions

Don't rely on size alone. Combine:

| Tool | Strong Hierarchy | Weak Hierarchy |
|------|------------------|----------------|
| **Size** | 3:1 ratio or more | <2:1 ratio |
| **Weight** | Bold vs Regular | Medium vs Regular |
| **Color** | High contrast | Similar tones |
| **Position** | Top/left (primary) | Bottom/right |
| **Space** | Surrounded by white space | Crowded |

**The best hierarchy uses 2-3 dimensions at once**: A heading that's larger, bolder, AND has more space above it.

### Cards Are Not Required

Cards are overused. Spacing and alignment create visual grouping naturally. Use `Card` only when content is truly distinct and actionable, items need visual comparison in a grid, or content needs clear interaction boundaries. **Never nest cards inside cards.** Use spacing, typography, and subtle `Divider`s for hierarchy within a card.

## Container Queries (LayoutBuilder)

Viewport queries (`MediaQuery`) are for page layouts. **Container queries are for components**. In Flutter, this is exactly what `LayoutBuilder` does:

```dart
LayoutBuilder(
  builder: (context, constraints) {
    if (constraints.maxWidth > 400) {
      return Row(children: [...]);
    } else {
      return Column(children: [...]);
    }
  }
)
```

**Why this matters**: A custom widget in a narrow sidebar stays compact, while the same widget in a main content area expands automatically, without relying on the total screen width.

## Optical Adjustments

Text in a `Text` widget has internal leading (whitespace above/below the font glyphs). To achieve perfect optical alignment with an adjacent icon, you may need to apply a very small `Transform.translate` or adjust the `TextHeightBehavior`.

Geometrically centered icons often look off-center; play icons need to shift right, arrows shift toward their direction.

### Touch Targets vs Visual Size

Buttons can look small but need large touch targets (44px minimum). Flutter's `IconButton` handles this by default (the `splashRadius` and internal padding), but for custom widgets, wrap them in a larger invisible tap area:

```dart
GestureDetector(
  onTap: () {},
  child: Container(
    padding: const EdgeInsets.all(10), // Expands the hit test area
    child: const CustomTinyIcon(),
  ),
)
```

## Depth & Elevation

Create semantic z-index scales by controlling paint order (the order of children in a `Stack`). For shadows, use `Material(elevation: X)` and stick to standard values (1, 2, 4, 8, 16) or define a custom `BoxShadow` scale. **Key insight**: Shadows should be subtle. If you can clearly see a hard black shadow, it's probably too strong.

---

**Avoid**: Arbitrary spacing values outside your scale. Making all spacing equal (variety creates hierarchy). Creating hierarchy through size alone - combine size, weight, color, and space.