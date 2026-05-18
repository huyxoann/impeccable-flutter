# Layout Design

Space is the most underused design tool. Find the layout's actual problem (monotone spacing, weak hierarchy, identical card grids, the centered-stack default) and fix the structure, not the surface.

---

## Register

Brand: asymmetric compositions, fluid spacing with constraints, intentional grid-breaking for emphasis. Rhythm through contrast: tight groupings paired with generous separations.

Product: predictable grids, consistent densities, familiar navigation patterns. Responsive behavior is structural (collapse sidebar, wrap flex items), not fluid typography. Consistency IS an affordance.

---

## Assess Current Layout

Analyze what's weak about the current spatial design:

1. **Spacing**:
   - Is spacing consistent or arbitrary? (Random padding/margin values)
   - Is all spacing the same? (Equal padding everywhere = no rhythm)
   - Are related elements grouped tightly, with generous space between groups?

2. **Visual hierarchy**:
   - Apply the squint test: blur your (metaphorical) eyes. Can you still identify the most important element, second most important, and clear groupings?
   - Is hierarchy achieved effectively? (Space and weight alone can be enough; is the current approach working?)
   - Does whitespace guide the eye to what matters?

3. **Grid & structure**:
   - Is there a clear underlying structure, or does the layout feel random?
   - Are identical card grids used everywhere? (Icon + heading + text, repeated endlessly)
   - Is everything centered? (Left-aligned with asymmetric layouts feels more designed, but not a hard and fast rule)

4. **Rhythm & variety**:
   - Does the layout have visual rhythm? (Alternating tight/generous spacing)
   - Is every section structured the same way? (Monotonous repetition)
   - Are there intentional moments of surprise or emphasis?

5. **Density**:
   - Is the layout too cramped? (Not enough breathing room)
   - Is the layout too sparse? (Excessive whitespace without purpose)
   - Does density match the content type? (Data-dense UIs need tighter spacing; marketing pages need more air)

**CRITICAL**: Layout problems are often the root cause of interfaces feeling "off" even when colors and fonts are fine. Space is a design material; use it with intention.

## Plan Layout Improvements

Create a systematic plan:

- **Spacing system**: Use a consistent scale. Flutter's default `ThemeData` doesn't enforce a global spacing scale, so define one via an `Extension` or constants (e.g., `4, 8, 16, 24, 32, 48`).
- **Hierarchy strategy**: How will space communicate importance?
- **Layout approach**: What structure fits the content? `Row`/`Column` for 1D, `Wrap` for fluid wrapping, `GridView`/`SliverGrid` for 2D.
- **Rhythm**: Where should spacing be tight vs generous?

## Improve Layout Systematically

### Establish a Spacing System

- Use a consistent spacing scale. What matters is that values come from a defined set, not arbitrary numbers.
- Use `SizedBox(height: 16)` or `SizedBox(width: 8)` for explicit gaps between siblings instead of wrapping everything in `Padding`.
- In Flutter 3.0+, `Flex`, `Row`, and `Column` support the `spacing` property to automatically gap children without explicit `SizedBox`es. Use it!

### Create Visual Rhythm

- **Tight grouping** for related elements (8-12px between siblings)
- **Generous separation** between distinct sections (48-96px)
- **Varied spacing** within sections (not every row needs the same gap)
- **Asymmetric compositions**: break the predictable centered-content pattern when it makes sense

### Choose the Right Layout Tool

- **Use Row/Column for 1D layouts**: Nav bars, button groups, card contents, most component internals.
- **Use Wrap for flow layouts**: Badges, chips, or dynamic lists of items that need to wrap to the next line naturally.
- **Use GridView/SliverGrid for 2D layouts**: Dashboards, image galleries, data-dense interfaces.
- **Use LayoutBuilder/MediaQuery**: To make structural responsive decisions (e.g., showing a `Drawer` vs a `BottomNavigationBar` based on width).

### Break Card Grid Monotony

- Don't default to card grids for everything; spacing and alignment create visual grouping naturally.
- Use `Card` only when content is truly distinct and actionable. Never nest `Card`s inside `Card`s.
- Vary card sizes, or mix cards with non-card content (like full bleed images or flat `Container`s) to break repetition.

### Strengthen Visual Hierarchy

- Use the fewest dimensions needed for clear hierarchy. Space alone can be enough; generous whitespace around an element draws the eye.
- Create clear content groupings through proximity and separation.

### Manage Depth & Elevation

- Paint order defines z-index in Flutter (later children in a `Stack` paint on top).
- Build a consistent shadow scale (sm → md → lg → xl); shadows should be subtle.
- Use `Material(elevation: 4)` or `BoxShadow` to reinforce hierarchy, not as decoration.

### Optical Adjustments

- If an icon looks visually off-center despite being geometrically centered, nudge it using a `Transform.translate` or asymmetric `Padding`. But only if you're confident it actually looks wrong. Don't adjust speculatively.

**NEVER**:
- Use arbitrary spacing values outside your scale.
- Make all spacing equal (variety creates hierarchy).
- Wrap everything in `Card`s (not everything needs a container).
- Nest `Card`s inside `Card`s (use spacing and `Divider`s for hierarchy within).
- Use identical card grids everywhere (icon + heading + text, repeated).
- Center everything (left-aligned with asymmetry feels more designed).
- Default to the hero metric layout (big number, small label, stats, gradient) as a template.

## Verify Layout Improvements

- **Squint test**: Can you identify primary, secondary, and groupings with blurred vision?
- **Rhythm**: Does the page have a satisfying beat of tight and generous spacing?
- **Hierarchy**: Is the most important content obvious within 2 seconds?
- **Breathing room**: Does the layout feel comfortable, not cramped or wasteful?
- **Consistency**: Is the spacing system applied uniformly?
- **Responsiveness**: Does the layout adapt gracefully across screen sizes (`LayoutBuilder`)?

When the rhythm and hierarchy land, hand off to `$impeccable-flutter polish` for the final pass.