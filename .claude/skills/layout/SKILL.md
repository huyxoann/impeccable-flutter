---
name: layout
description: Improve layout, spacing, and visual rhythm. Fixes monotonous grids, inconsistent spacing, and weak visual hierarchy. Use when the user mentions layout feeling off, spacing issues, visual hierarchy, crowded UI, alignment problems, or wanting better composition.
version: 3.1.2
user-invocable: true
argument-hint: "[target]"
---

Designs and iterates production-grade frontend interfaces. Real working code, committed design choices, exceptional craft.

## Setup

Before any design work or file edits:

1. Load context (PRODUCT.md / DESIGN.md) via the loader script.
2. Identify the register and load the matching register reference (brand.md or product.md).
3. **If the user invoked a sub-command (e.g. `craft`, `shape`, `audit`), load its reference file too.** This is non-negotiable: `craft` without `craft.md` loaded means you'll skip the shape-and-confirm step the user expects.

Skipping these produces generic output that ignores the project.

### 1. Context gathering

Two files, case-insensitive. The loader looks at the project root by default and falls back to `.agents/context/` and `docs/` if the root is clean. Override with `IMPECCABLE_CONTEXT_DIR=path/to/dir` (absolute or relative to cwd).

- **PRODUCT.md**: required. Users, brand, tone, anti-references, strategic principles.
- **DESIGN.md**: optional, strongly recommended. `ThemeData` strategies, `ColorScheme` choices, `TextTheme` rules, elevation, standard paddings, and Flutter component blueprints.

Load both in one call:

```bash
# Claude Code plugins run from a global cache. Replace the relative path below
# with the absolute path to this plugin's scripts directory before running.
node .claude/skills/impeccable-flutter/scripts/load-context.mjs
```

Consume the full JSON output. Never pipe through `head`, `tail`, `grep`, or `jq`. The output's `contextDir` field tells you where the files were resolved from.

If the output is already in this session's conversation history, don't re-run. Exceptions requiring a fresh load: you just ran `$impeccable-flutter init` or `$impeccable-flutter document` (they rewrite the files), or the user manually edited one.

If PRODUCT.md is missing, empty, or placeholder (`[TODO]` markers, <200 chars): run `$impeccable-flutter init`, then resume the user's original task with the fresh context. If the original task was `$impeccable-flutter craft`, resume into `$impeccable-flutter shape` before any implementation work.

If DESIGN.md is missing: nudge once per session (*"Run `$impeccable-flutter document` for more on-brand output"*), then proceed.

### 2. Register

Every design task is **brand** (marketing, landing, campaign, long-form content, portfolio: design IS the product) or **product** (app UI, admin, dashboard, tool: design SERVES the product).

Identify before designing. Priority: (1) cue in the task itself ("landing page" vs "dashboard"); (2) the surface in focus (the page, file, or route being worked on); (3) `register` field in PRODUCT.md. First match wins.

If PRODUCT.md lacks the `register` field (legacy), infer it once from its "Users" and "Product Purpose" sections, then cache the inferred value for the session. Suggest the user run `$impeccable-flutter init` to add the field explicitly.

Load the matching reference: [reference/brand.md](reference/brand.md) or [reference/product.md](reference/product.md). The shared design laws below apply to both.

## Shared design laws

Apply to every design, both registers. Match implementation complexity to the aesthetic vision: maximalism needs elaborate code, minimalism needs precision. Interpret creatively. Vary across projects; never converge on the same choices. GPT is capable of extraordinary work. Don't hold back.

### Color

- Use OKLCH. Reduce chroma as lightness approaches 0 or 100; high chroma at extremes looks garish.
- Never use `#000` or `#fff`. Tint every neutral toward the brand hue (chroma 0.005–0.01 is enough).
- Pick a **color strategy** before picking colors. Four steps on the commitment axis:
  - **Restrained**: tinted neutrals + one accent ≤10%. Product default; brand minimalism.
  - **Committed**: one saturated color carries 30–60% of the surface. Brand default for identity-driven pages.
  - **Full palette**: 3–4 named roles, each used deliberately. Brand campaigns; product data viz.
  - **Drenched**: the surface IS the color. Brand heroes, campaign pages.
- The "one accent ≤10%" rule is Restrained only. Committed / Full palette / Drenched exceed it on purpose. Don't collapse every design to Restrained by reflex.

### Theme

Dark vs. light is never a default. Not dark "because tools look cool dark." Not light "to be safe."

Before choosing, write one sentence of physical scene: who uses this, where, under what ambient light, in what mood. If the sentence doesn't force the answer, it's not concrete enough. Add detail until it does.

"Observability dashboard" does not force an answer. "SRE glancing at incident severity on a 27-inch monitor at 2am in a dim room" does. Run the sentence, not the category.

### Typography

- Cap body line length at 65–75ch.
- Hierarchy through scale + weight contrast (≥1.25 ratio between steps). Avoid flat scales.

### Layout

- Vary spacing for rhythm. Same padding everywhere is monotony.
- Cards are the lazy answer. Use them only when they're truly the best affordance. Nested cards are always wrong.
- Don't wrap everything in a container. Most things don't need one.

### Motion

- Don't animate CSS layout properties.
- Ease out with exponential curves (ease-out-quart / quint / expo). No bounce, no elastic.

### Absolute bans

Match-and-refuse. If you're about to write any of these, rewrite the element with different structure.

- **Side-stripe borders.** `border-left` or `border-right` greater than 1px as a colored accent on cards, list items, callouts, or alerts. Never intentional. Rewrite with full borders, background tints, leading numbers/icons, or nothing.
- **Gradient text.** `background-clip: text` combined with a gradient background. Decorative, never meaningful. Use a single solid color. Emphasis via weight or size.
- **Glassmorphism as default.** Blurs and glass cards used decoratively. Rare and purposeful, or nothing.
- **The hero-metric template.** Big number, small label, supporting stats, gradient accent. SaaS cliché.
- **Identical card grids.** Same-sized cards with icon + heading + text, repeated endlessly.
- **Modal as first thought.** Modals are usually laziness. Exhaust inline / progressive alternatives first.
- **The "GPT-border-and-shadow".** Very thin (≤1px) borders combined with wide, soft, low-opacity shadows. A generic LLM "premium" look. If you use a shadow, it must be part of a defined elevation system or a deliberate, high-contrast glow.

### Copy

- Every word earns its place. No restated headings, no intros that repeat the title.
- **No em dashes.** Use commas, colons, semicolons, periods, or parentheses. Also not `--`.
- **Banned "AI-isms" (Prose rules):** Never use "powerful", "seamless", "robust", "comprehensive", "dive in", "at its core", "look no further", or "elevate". If a feature is powerful, describe what it does with a concrete number or fact. If it's seamless, show the simplified workflow.

### The AI slop test

If someone could look at this interface and say "AI made that" without doubt, it's failed. Cross-register failures are the absolute bans above. Register-specific failures live in each reference.

**Category-reflex check.** Run at two altitudes; the second one catches what the first one misses.

- **First-order:** if someone could guess the theme + palette from the category alone ("observability → dark blue", "healthcare → white + teal", "finance → navy + gold", "crypto → neon on black"), it's the first training-data reflex. Rework the scene sentence and color strategy until the answer isn't obvious from the domain.
- **Second-order:** if someone could guess the aesthetic family from category-plus-anti-references ("AI workflow tool that's not SaaS-cream → editorial-typographic", "fintech that's not navy-and-gold → terminal-native dark mode"), it's the trap one tier deeper. The first reflex was avoided; the second wasn't. Rework until both answers are not obvious. The brand register's [reflex-reject aesthetic lanes](reference/brand.md) list catches the currently-saturated families.

## Commands

| Command | Category | Description | Reference |
|---|---|---|---|
| `craft [feature]` | Build | Shape, then build a feature end-to-end | [reference/craft.md](reference/craft.md) |
| `shape [feature]` | Build | Plan UX/UI before writing code | [reference/shape.md](reference/shape.md) |
| `init` | Build | Set up PRODUCT.md and DESIGN.md context | [reference/init.md](reference/init.md) |
| `document` | Build | Generate DESIGN.md from existing project code | [reference/document.md](reference/document.md) |
| `extract [target]` | Build | Pull reusable tokens and components into design system | [reference/extract.md](reference/extract.md) |
| `critique [target]` | Evaluate | UX design review with heuristic scoring | [reference/critique.md](reference/critique.md) |
| `audit [target]` | Evaluate | Technical quality checks (a11y, perf, responsive) | [reference/audit.md](reference/audit.md) |
| `polish [target]` | Refine | Final quality pass before shipping | [reference/polish.md](reference/polish.md) |
| `bolder [target]` | Refine | Amplify safe or bland designs | [reference/bolder.md](reference/bolder.md) |
| `quieter [target]` | Refine | Tone down aggressive or overstimulating designs | [reference/quieter.md](reference/quieter.md) |
| `distill [target]` | Refine | Strip to essence, remove complexity | [reference/distill.md](reference/distill.md) |
| `harden [target]` | Refine | Production-ready: errors, i18n, edge cases | [reference/harden.md](reference/harden.md) |
| `onboard [target]` | Refine | Design first-run flows, empty states, activation | [reference/onboard.md](reference/onboard.md) |
| `animate [target]` | Enhance | Add purposeful animations and motion | [reference/animate.md](reference/animate.md) |
| `colorize [target]` | Enhance | Add strategic color to monochromatic UIs | [reference/colorize.md](reference/colorize.md) |
| `typeset [target]` | Enhance | Improve typography hierarchy and fonts | [reference/typeset.md](reference/typeset.md) |
| `layout [target]` | Enhance | Fix spacing, rhythm, and visual hierarchy | [reference/layout.md](reference/layout.md) |
| `delight [target]` | Enhance | Add personality and memorable touches | [reference/delight.md](reference/delight.md) |
| `overdrive [target]` | Enhance | Push past conventional limits | [reference/overdrive.md](reference/overdrive.md) |
| `clarify [target]` | Fix | Improve UX copy, labels, and error messages | [reference/clarify.md](reference/clarify.md) |
| `adapt [target]` | Fix | Adapt for different devices and screen sizes | [reference/adapt.md](reference/adapt.md) |
| `optimize [target]` | Fix | Diagnose and fix UI performance | [reference/optimize.md](reference/optimize.md) |

Plus two management commands: `pin <command>` and `unpin <command>`, detailed below.

### Routing rules

1. **No argument**: Run the Smart Recommendation Engine. Analyze the git tree, recent commits, and any existing critique snapshots. Propose the single most high-value next step (e.g., "The git history shows many typography tweaks; run `$impeccable-flutter typeset` to consolidate" or "No PRODUCT.md found; run `$impeccable-flutter init`"). Render the table above as a fallback menu.
2. **First word matches a command**: load its reference file and follow its instructions. Everything after the command name is the target.
3. **First word doesn't match**: general design invocation. Apply the setup steps, shared design laws, and the loaded register reference, using the full argument as context.

Setup (context gathering, register) is already loaded by then; sub-commands don't re-invoke `$impeccable-flutter`.

If the first word is `craft`, setup still runs first, but [reference/craft.md](reference/craft.md) owns the rest of the flow. If setup invokes `init` as a blocker, finish init, refresh context, then resume the original command and target.

## Pin / Unpin

**Pin** creates a standalone shortcut so `$<command>` invokes `$impeccable-flutter <command>` directly. **Unpin** removes it. The script writes to every harness directory present in the project.

```bash
# Claude Code plugins run from a global cache. Replace the relative path below
# with the absolute path to this plugin's scripts directory before running.
node .claude/skills/impeccable-flutter/scripts/pin.mjs <pin|unpin> <command>
```

Valid `<command>` is any command from the table above. Report the script's result concisely. Confirm the new shortcut on success, relay stderr verbatim on error.in** removes it. The script writes to every harness directory present in the project.

```bash
# Claude Code plugins run from a global cache. Replace the relative path below
# with the absolute path to this plugin's scripts directory before running.
node .claude/skills/impeccable-flutter/scripts/pin.mjs <pin|unpin> <command>
```

Valid `<command>` is any command from the table above. Report the script's result concisely. Confirm the new shortcut on success, relay stderr verbatim on error.

## Specific Instructions: layout

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