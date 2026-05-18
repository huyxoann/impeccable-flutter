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

### Step 4b: Write .impeccable/design.json sidecar

The frontmatter owns token primitives. The sidecar at `.impeccable/design.json` carries what Stitch's schema can't hold: tonal ramps per color, breakpoints, and narrative.

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
2. Mention that `.impeccable/design.json` was also written.
3. Offer to refine any section.

## Seed mode

For projects with no visual system to extract yet. Produces a minimal scaffold, not a full spec. Follow the same prompt questions as the original Impeccable (Color strategy, Typography direction, Motion energy, References, Anti-references) and generate the `<!-- SEED -->` file. No `.impeccable/design.json` sidecar is generated in seed mode.

## Style guidelines

- **Frontmatter first, prose second.** Tokens go in the YAML frontmatter; prose contextualizes them.
- **Cite PRODUCT.md anti-references by name** in the Do's and Don'ts section.
- **Match the spec, don't invent new sections.** The six section names are fixed.
- **Descriptive > technical**: "Gently curved edges (8px radius)" > "BorderRadius.circular(8)".
- **Exact values in parens**: hex codes, px values, font weights; always the number in parens alongside the description.
- **Be forceful**. The voice of a design director. "Prohibited", "forbidden", "never", "always".
- **Group colors by role**, not by hex-order or hue-order. Primary / Secondary / Tertiary / Neutral is the spec ordering.