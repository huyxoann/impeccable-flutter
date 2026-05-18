# Responsive Design

## Mobile-First: Write It Right

Design for the smallest constrained screen first (mobile), then use `LayoutBuilder` or `MediaQuery` to add complexity for tablets and desktop.

## Breakpoints: Content-Driven

Don't chase specific device sizes (like "iPhone 14 Pro Max width"); let content tell you where to break. Start narrow, stretch until the design looks stretched or awkward, and add a breakpoint there. Three breakpoints usually suffice (e.g., 640px, 768px, 1024px).

In Flutter, avoid hardcoding screen widths scattered throughout the code. Define a responsive helper or extension:

```dart
// Example responsive helper
bool isMobile(BuildContext context) => MediaQuery.sizeOf(context).width < 640;
bool isTablet(BuildContext context) => MediaQuery.sizeOf(context).width >= 640 && MediaQuery.sizeOf(context).width < 1024;
bool isDesktop(BuildContext context) => MediaQuery.sizeOf(context).width >= 1024;
```

## Handle Safe Areas (The Notch)

Modern phones have notches, camera cutouts, rounded corners, and home indicators. Never let content bleed into these areas un-intentionally.

**Use `SafeArea`:**
```dart
Scaffold(
  body: SafeArea(
    child: ListView(
      children: [...],
    ),
  ),
);
```

**Advanced Safe Areas:**
Sometimes you want the background color or an image to bleed behind the notch, but keep the text safe. In that case, use `SafeArea` carefully around the specific content, or use `MediaQuery.paddingOf(context)` to manually add padding.

```dart
// Background bleeds to edges, content is safe
Container(
  color: Colors.blue,
  child: SafeArea(
    bottom: false, // Let a list scroll behind the home indicator
    child: Text('Safe text'),
  ),
)
```

## Responsive Layout Patterns

### LayoutBuilder vs MediaQuery

- **`MediaQuery`**: Use when you need the size of the *entire screen/window*. Good for top-level routing decisions (e.g., showing a side navigation drawer vs a bottom bar).
- **`LayoutBuilder`**: Use when you need the size of the *parent widget*. Good for components that adapt to the space they are given, regardless of the screen size.

```dart
LayoutBuilder(
  builder: (context, constraints) {
    if (constraints.maxWidth > 600) {
      return _buildWideLayout();
    } else {
      return _buildNarrowLayout();
    }
  },
)
```

### Common Adaptations

**Navigation**:
- Mobile: `BottomNavigationBar` + `Drawer` (Hamburger menu).
- Tablet: `NavigationRail` (compact vertical side nav).
- Desktop: Full persistent side `Drawer` or top app bar with links.

**Lists & Grids**:
- Mobile: Single column `ListView`.
- Tablet/Desktop: Multi-column `GridView` or `Wrap`. Use `SliverGridDelegateWithMaxCrossAxisExtent` so the grid automatically adds columns as the screen widens, rather than hardcoding a fixed `crossAxisCount`.

**Dialogs vs Panels**:
- Mobile: Full-screen or bottom-sheet modal.
- Desktop: Centered dialog box or a side-panel next to the content.

## Responsive Images

Unlike the web (`srcset`), Flutter handles different screen densities (Retina/High-DPI) automatically if you provide the correct asset folders (`1.5x`, `2.0x`, `3.0x`).

For layout-responsive images (scaling an image based on screen width), use `BoxFit`:

```dart
Image.asset(
  'assets/hero.png',
  fit: BoxFit.cover, // Ensures the image fills the space without distorting
  width: double.infinity,
  height: 250,
)
```

## Text Scaling & Accessibility

Users can change their system font size. Your app MUST handle this gracefully.

- **Don't hardcode fixed heights** on containers that hold text, or the text will clip when scaled up. Use `minHeight` or let the container size to its children.
- If a specific piece of text absolutely must not scale (e.g., a tiny badge icon), you can override the scaler, but do this sparingly:

```dart
// Sparingly prevent text scaling for specific tight UI elements
MediaQuery(
  data: MediaQuery.of(context).copyWith(textScaler: TextScaler.noScaling),
  child: Text('Badge'),
)
```

## Testing: Don't Trust Desktop Emulation Alone

Resizing the window on Desktop/Web is great for testing flex layouts, but it misses:

- Actual touch interactions vs precise mouse clicks.
- The appearance of the software keyboard (which changes view insets and can cause `RenderFlex` overflow errors).
- Real CPU/memory constraints of mobile devices.
- Platform-specific safe areas (notches).

**Test on at least**: One real iPhone and one real Android device.

---

**Avoid**: Desktop-first design. Hardcoding fixed widths and heights for content containers. Ignoring tablet and landscape orientations. Assuming all mobile devices have the same screen ratio.