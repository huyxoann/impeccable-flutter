---
name: document
description: Generate a DESIGN.md file that captures the current visual design system. Auto-extracts colors, typography, spacing, radii, and component patterns from the codebase, then asks the user to confirm descriptive language for atmosphere and color character. Follows the Google Stitch DESIGN.md format so the file is tool-compatible. Use when you need a visual design spec an AI agent can follow to stay on-brand.
version: 3.1.1
user-invocable: true
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

## Specific Instructions: document

Generate a `DESIGN.md` file at the project root that captures the current visual design system, so AI agents generating new screens stay on-brand.

DESIGN.md follows the [official Google Stitch DESIGN.md format](https://stitch.withgoogle.com/docs/design-md/format/): YAML frontmatter carrying machine-readable design tokens, followed by a markdown body with exactly six sections in a fixed order. **Tokens are normative; prose provides context for how to apply them.** Sections may be omitted when not relevant, but **do not reorder them and do not rename them**. Section headers must match the spec character-for-character so the file stays parseable by other DESIGN.md-aware tools (Stitch itself, awesome-design-md, skill-rest, etc.).

## The frontmatter: token schema

The YAML frontmatter is the machine-readable layer. It's what Stitch's linter validates and what the live panel renders tiles from. Keep it tight; every entry should correspond to a token the project actually uses.

```yaml
---
name: <project title>
description: <one-line tagline>
colors:
  primary: "#b8422e"
  neutral-bg: "#faf7f2"
  # ...one entry per extracted color; key = descriptive slug
typography:
  display:
    fontFamily: "Cormorant Garamond, Georgia, serif"
    fontSize: "clamp(2.5rem, 7vw, 4.5rem)"
    fontWeight: 300
    lineHeight: 1
    letterSpacing: "normal"
  body:
    # ...
rounded:
  sm: "4px"
  md: "8px"
spacing:
  sm: "8px"
  md: "16px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.neutral-bg}"
    rounded: "{rounded.sm}"
    padding: "16px 48px"
  button-primary-hover:
    backgroundColor: "{colors.primary-deep}"
---
```

Rules that matter:

- **Token refs** use `{path.to.token}` (e.g. `{colors.primary}`, `{rounded.md}`). Components may reference primitives; primitives may not reference each other.
- **Stitch validates colors as hex sRGB only** (`#RGB` / `#RGBA` / `#RRGGBB` / `#RRGGBBAA`); OKLCH/HSL/P3 trigger a linter warning, not a hard error. YAML accepts the string either way and our own parser is format-agnostic. Choose based on project posture. Never split the source of truth without explicit reason.
- **Component sub-tokens** are limited to 8 props: `backgroundColor`, `textColor`, `typography`, `rounded`, `padding`, `size`, `height`, `width`. Shadows, motion, focus rings: none of those fit. Carry them in the sidecar (Step 4b).
- **Scale keys are open-ended.** Use whatever names the project already uses (`warm-ash-cream`, `surface-container-low`). Don't rename to Material defaults.
- **Variants are naming convention, not schema.** `button-primary` / `button-primary-hover` / `button-primary-active` as sibling keys.

## The markdown body: six sections (exact order)

1. `## Overview`
2. `## Colors`
3. `## Typography`
4. `## Elevation`
5. `## Components`
6. `## Do's and Don'ts`

Optional evocative subtitles are allowed in the form `## 2. Colors: The [Name] Palette` (Stitch's own outputs do this), but the literal word in each header (Overview, Colors, Typography, Elevation, Components, Do's and Don'ts) must be present. Do NOT add extra top-level sections (Layout Principles, Responsive Behavior, Motion, Agent Prompt Guide). Fold that content into the six spec sections where it naturally belongs.

## When to run

- The user just ran `$impeccable-flutter teach` and needs the visual side documented.
- The skill noticed no `DESIGN.md` exists and nudged the user to create one.
- An existing `DESIGN.md` is stale (the design has drifted).
- Before a large redesign, to capture the current state as a reference.

If a `DESIGN.md` already exists, **do not silently overwrite it**. Show the user the existing file and ask whether to refresh, overwrite, or merge.

## Two paths

- **Scan mode** (default): the project has `ThemeData`, components, or rendered output. Extract, then confirm descriptive language. Use when there's code to analyze.
- **Seed mode**: the project is pre-implementation (fresh teach, nothing built yet). Interview for five high-level answers, write a minimal DESIGN.md marked `<!-- SEED -->`. Re-run in scan mode once there's code.

Decide by scanning first (Scan mode Step 1). If the scan finds no tokens, no component files, and no rendered site, offer seed mode; don't silently switch.

## Scan mode (approach C: auto-extract, then confirm descriptive language)

### Step 1: Find the design assets

Search the codebase in priority order:

1. **Flutter ThemeData / ColorScheme**: Scan `lib/theme.dart`, `lib/core/theme/`, or `main.dart` for `ThemeData`, `ColorScheme.fromSeed`, `TextTheme` definitions. Record the color hex codes, font families, and typography scales.
2. **Design token files**: `tokens.json`, `design-tokens.json` if the project uses a tool like Style Dictionary.
3. **Component library**: scan the main button, card, input, navigation, dialog components in `lib/widgets/` or `lib/components/`. Note their variant APIs and default styles.
4. **App Assets**: check `pubspec.yaml` for registered fonts and primary assets.

### Step 2: Auto-extract what can be auto-extracted

Build a structured draft from the discovered tokens. For each token class:

- **Colors**: Group into Primary / Secondary / Tertiary / Neutral. If the project only has one accent, express it as Primary + Neutral.
- **Typography**: Map observed sizes and weights to the Material hierarchy (`displayLarge`, `headlineMedium`, `titleSmall`, `bodyMedium`, `labelSmall`). Note font-family stacks and the scale ratio.
- **Elevation**: Catalogue the shadow vocabulary (e.g., standard `Material` elevations like 0, 1, 2, 4, 8).
- **Components**: For each common component (button, card, input, chip, list item, tooltip, nav), extract shape (`borderRadius`), color assignment, hover/focus treatment (`WidgetStateProperty`), internal padding.

### Step 2b: Stage the frontmatter

From the auto-extracted tokens, draft the YAML frontmatter now (you'll write it at the top of DESIGN.md in Step 4).

- **Colors**: one entry per extracted color. Key = descriptive slug (`warm-ash-cream`, not `blue-800`).
- **Typography**: one entry per role. Include `fontFamily`, `fontSize`, `fontWeight`, `lineHeight`, `letterSpacing`.
- **Rounded / Spacing**: whatever scale steps the project actually uses.
- **Components**: one entry per variant (`button-primary`, `button-primary-hover`).

Skip anything the project doesn't have. Empty scale keys or fabricated tokens pollute the spec.

### Step 3: Ask the user for qualitative language

The following require creative input that cannot be auto-extracted. Group them into one question interaction:

- **Creative North Star**: a single named metaphor for the whole system ("The Editorial Sanctuary", "The Golden State Curator"). Offer 2-3 options that honor PRODUCT.md's brand personality.
- **Overview voice**: mood adjectives, aesthetic philosophy in 2-3 sentences, anti-references.
- **Color character** (for auto-extracted colors): descriptive names ("Deep Muted Teal-Navy").
- **Elevation philosophy**: flat/layered/lifted. If shadows exist, is their role ambient or structural?
- **Component philosophy**: the feel of buttons, cards, inputs in one phrase ("tactile and confident" vs. "refined and restrained").

Quote a line from PRODUCT.md when possible so the user sees their own strategic language carry forward.

### Step 4: Write DESIGN.md

The file opens with the YAML frontmatter staged in Step 2b, then the markdown body using the structure below. Headers must match character-for-character.

```markdown
---
name: [Project Title]
description: [one-line tagline]
colors:
  # ... staged frontmatter from Step 2b
---

# Design System: [Project Title]

## 1. Overview

**Creative North Star: "[Named metaphor in quotes]"**

[2-3 paragraph holistic description: personality, density, aesthetic philosophy. End with a short **Key Characteristics:** bullet list.]

## 2. Colors

[Describe the palette character in one sentence.]

### Primary
- **[Descriptive Name]** (#HEX): [Where and why this color is used.]

### Neutral
- **[Descriptive Name]** (#HEX): [Role.]

### Named Rules (optional)
**The [Rule Name] Rule.** [Short doctrine, e.g. "The One Voice Rule. Primary accent on ≤10% of any screen."]

## 3. Typography

**Display Font:** [Family]
**Body Font:** [Family]

**Character:** [1-2 sentence personality description.]

### Hierarchy
- **DisplayLarge** ([weight], [size], [line-height]): [Purpose; where it appears.]
- **HeadlineMedium** ([weight], [size], [line-height]): [Purpose.]
- **BodyMedium** ([weight], [size], [line-height]): [Purpose.]
- **LabelSmall** ([weight], [size], [letter-spacing]): [Purpose.]

## 4. Elevation

[Does this system use shadows, tonal layering, or a hybrid?]

### Shadow Vocabulary
- **[Role name]** (Elevation: [value]): [When to use it.]

## 5. Components

### Buttons
- **Shape:** [radius described, exact value in parens]
- **Primary:** [color assignment + padding]
- **Hover / Focus:** [WidgetStateProperty treatments]

### Cards / Containers
- **Corner Style:** [radius]
- **Background:** [colors used]
- **Shadow Strategy:** [reference Elevation section]

### Inputs / Fields
- **Style:** [stroke, background, radius]
- **Focus:** [treatment, e.g. glow, border shift]

## 6. Do's and Don'ts

Concrete, forceful guardrails. Lead each with "Do" or "Don't". Be specific: include exact colors, pixel values, and named anti-patterns. Quote PRODUCT.md directly where possible.

### Do:
- **Do** [specific prescription].

### Don't:
- **Don't** [specific prohibition, e.g. "use identical Card + Column grids endlessly"].
```

### Step 4b: Write .impeccable-flutter/design.json sidecar

The frontmatter owns token primitives. The sidecar at `.impeccable-flutter/design.json` carries what Stitch's schema can't hold: tonal ramps per color, breakpoints, and narrative.

*Note: The original Stitch format expects HTML/CSS snippets for components. For a pure Flutter project, you can either adapt the component structure to include a `dart` key instead of `html`/`css`, or omit the code snippets if they aren't consumed by a web-based panel.*

```json
{
  "schemaVersion": 2,
  "generatedAt": "ISO-8601 string",
  "title": "Design System: [Project Title]",
  "extensions": {
    "colorMeta": {
      "primary": { "role": "primary", "displayName": "Editorial Magenta", "canonical": "oklch(60% 0.25 350)", "tonalRamp": ["...", "...", "..."] }
    }
  },
  "components": [
    {
      "name": "Primary Button",
      "kind": "button",
      "refersTo": "button-primary",
      "description": "Primary action button.",
      "dart": "ElevatedButton(\n  onPressed: () {},\n  style: ElevatedButton.styleFrom(\n    backgroundColor: Theme.of(context).colorScheme.primary,\n    foregroundColor: Theme.of(context).colorScheme.onPrimary,\n    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),\n    padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),\n  ),\n  child: const Text('Primary Action'),\n)"
    }
  ],
  "narrative": {
    "northStar": "The Editorial Sanctuary",
    "overview": "...",
    "keyCharacteristics": ["...", "..."],
    "dos": ["Do use ..."],
    "donts": ["Don't use ..."]
  }
}
```

### Step 5: Confirm and refine

1. Show the user the full DESIGN.md you wrote. Briefly highlight the non-obvious creative choices.
2. Mention that `.impeccable-flutter/design.json` was also written.
3. Offer to refine any section.

## Seed mode

For projects with no visual system to extract yet. Produces a minimal scaffold, not a full spec. Follow the same prompt questions as the original Impeccable Flutter (Color strategy, Typography direction, Motion energy, References, Anti-references) and generate the `<!-- SEED -->` file. No `.impeccable-flutter/design.json` sidecar is generated in seed mode.

## Style guidelines

- **Frontmatter first, prose second.** Tokens go in the YAML frontmatter; prose contextualizes them.
- **Cite PRODUCT.md anti-references by name** in the Do's and Don'ts section.
- **Match the spec, don't invent new sections.** The six section names are fixed.
- **Descriptive > technical**: "Gently curved edges (8px radius)" > "BorderRadius.circular(8)".
- **Exact values in parens**: hex codes, px values, font weights; always the number in parens alongside the description.
- **Be forceful**. The voice of a design director. "Prohibited", "forbidden", "never", "always".
- **Group colors by role**, not by hex-order or hue-order. Primary / Secondary / Tertiary / Neutral is the spec ordering.