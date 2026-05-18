Performance is a feature. Identify the actual bottleneck for THIS interface, fix it, then measure. Don't optimize what isn't slow.

## Assess Performance Issues

Understand current performance and identify problems:

1. **Measure current state**:
   - **Frame Rate**: UI thread and Raster thread FPS (Target 60fps or 120fps).
   - **Jank**: Missed frames (frames taking >16ms or >8ms).
   - **App Size**: APK / IPA size, asset sizes.
   - **Memory usage**: Image caching, memory leaks.
   - **Startup time**: Time to first frame.

2. **Identify bottlenecks**:
   - What's slow? (Initial load? Animations? Scrolling lists?)
   - What's causing it? (Large images? Expensive build methods? `saveLayer` calls?)
   - How bad is it? (Perceivable jank? Annoying? Blocking?)
   - Who's affected? (All users? Low-end Android devices?)

**CRITICAL**: Measure before and after using **Profile mode**, never Debug mode. Premature optimization wastes time. Optimize what actually matters.

## Optimization Strategy

Create systematic improvement plan:

### Rendering & Painting Performance

**Avoid Expensive Paint Operations**:
- **`saveLayer`**: This is the most expensive operation in Flutter. It allocates an offscreen buffer, paints into it, and then composites it back.
  - *Causes*: `Opacity` (with multiple children), `ShaderMask`, `ColorFilter`, `Text` with certain shadows.
  - *Fixes*: Use `AnimatedOpacity` instead of animating `Opacity`. Use a `Color` with an alpha channel directly instead of wrapping in `Opacity`.
- **Clipping**: `ClipRRect`, `ClipPath`, and `ClipOval` are expensive. Don't wrap them around entire scrolling lists. Try to clip individual images instead.
- **Shadows**: Excessive `BoxShadow`s or complex shapes with shadows can cause raster jank.

**Optimize the Widget Tree**:
- Minimize `build()` method cost: Don't do heavy synchronous computation inside `build()`.
- Use `const` constructors wherever possible. This tells Flutter the widget will never change, allowing it to skip rebuilding that part of the tree.
- Extract large subtrees into separate `StatelessWidget`s instead of using helper methods (`Widget _buildHeader()`). Classes can be `const` and properly tracked by the element tree; methods cannot.
- Avoid deeply nested trees if a flatter structure achieves the same result.

**Optimize Scrolling**:
- Never render all items in a long list at once.
- **Use `ListView.builder` or `SliverList.builder`**: These only render the items currently visible on screen.
- Avoid wrapping `ListView` inside `ShrinkWrappingViewport`s (like setting `shrinkWrap: true`) unless absolutely necessary, as it forces the list to calculate the height of all children immediately.

### Animation & Layout Performance

**Animate the Right Properties**:
- **Transform & Opacity**: Animating `Transform` (scale, translate, rotate) and `Opacity` is generally fast because it often skips the layout phase and goes straight to painting/compositing.
- **Avoid animating layout constraints casually**: Animating `width`, `height`, or `padding` forces Flutter to recalculate the layout of the widget and all its children on every frame. Use `Transform.scale` or `Transform.translate` if possible.
- If you must animate size, `AnimatedSize` is highly optimized for this.

**Use RepaintBoundary**:
- If you have a complex widget that repaints frequently (e.g., an animation) next to a complex static widget, wrap the static widget in a `RepaintBoundary`. This tells Flutter to cache the static widget as an image and not repaint it when the animated widget changes.
- *Warning*: Don't overuse `RepaintBoundary`; it costs memory to store the cached image.

### Asset & Network Optimization

**Optimize Images**:
- Provide appropriately sized images. Loading a 3000x3000px image into a 100x100px avatar causes massive memory pressure and decoding jank.
- Use `cacheWidth` and `cacheHeight` on `Image.asset` and `Image.network` to resize the image during decoding.
- Use `cached_network_image` to cache downloaded images to the device disk.

**Reduce App Size**:
- Compress assets (use WebP or optimized PNGs/JPEGs).
- Remove unused packages.
- Use Flutter's tree shaking and obfuscation (`flutter build apk --obfuscate --split-debug-info`).
- Split APKs by ABI to reduce download size for specific architectures.

**Optimize Network Requests**:
- Paginate large datasets.
- Compress responses (gzip/brotli).
- Use local caching (SQLite, Hive, Isar) for offline support and faster perceived loads.

## Performance Monitoring

**Tools to use**:
- **Flutter DevTools**: The source of truth for profiling.
- **Performance Overlay**: Enable it in your app to see UI/Raster thread graphs in real-time.
- **Widget Inspector**: Check for rebuilds and `const` usage.
- **CPU Profiler**: Find expensive synchronous Dart code.
- **Memory Profiler**: Hunt down memory leaks and large image allocations.

**Key metrics**:
- UI Thread time per frame (<16ms for 60fps, <8ms for 120fps).
- Raster Thread time per frame (<16ms for 60fps).
- Total memory footprint.

**IMPORTANT**: Measure on real devices. iOS Simulators and Android Emulators do not accurately represent real-world GPU rasterization performance.

**NEVER**:
- Optimize without measuring (premature optimization).
- Measure performance in Debug mode (it runs an interpreter, not AOT compiled code).
- Sacrifice accessibility for performance.
- Break functionality while optimizing.
- Use `RepaintBoundary` everywhere (it uses extra memory).
- Ignore low-end Android devices if they are in your target demographic.

## Verify Improvements

Test that optimizations worked:

- **Before/after metrics**: Compare DevTools performance graphs.
- **Real devices**: Test on the lowest-end device you officially support.
- **Release mode**: Always verify the final feel in a full `--release` build.
- **No regressions**: Ensure functionality still works.
- **User perception**: Does it *feel* faster?

When the UI thread stays green, hand off to `$impeccable-flutter polish` for the final pass.