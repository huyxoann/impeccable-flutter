---
name: shape
description: Plan UX and UI before code. Runs a required multi-round discovery interview, uses visual probes when available, and produces a user-confirmed design brief for implementation.
version: 3.1.2
user-invocable: true
argument-hint: "[feature to shape]"
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

## Specific Instructions: shape

Shape the UX and UI for a feature before any code is written. This command produces a **design brief**: a structured artifact that guides implementation through discovery, not guesswork.

**Scope**: Design planning only. This command does NOT write code. It produces the thinking that makes code good.

**Output**: A design brief that can be handed off to $impeccable-flutter craft, or directly to $impeccable-flutter for freeform implementation. When visual direction probes are used, the images are supporting artifacts, not the primary output.

## Philosophy

Most AI-generated UIs fail not because of bad code, but because of skipped thinking. They jump to "here's a card grid" without asking "what is the user trying to accomplish?" This command inverts that: understand deeply first, so implementation is precise.

## Phase 1: Discovery Interview

**Do NOT write any code or make any design decisions during this phase.** Your only job is to understand the feature deeply enough to make excellent design decisions later.

This is a required interaction, not optional guidance. Ask these questions in conversation, adapting based on answers. Don't dump them all at once; have a natural dialogue. STOP and use Codex's structured user-input/question tool when available; if unavailable, ask directly in chat to clarify what you cannot infer.

### Interview cadence

Discovery includes at least one user-answer round unless PRODUCT.md, DESIGN.md, or an already-confirmed brief directly answers the needed inputs. With a sparse prompt, do **not** synthesize a complete brief for confirmation on the first response.

- Use the harness's structured question tool when one exists. Otherwise, ask directly in chat and stop.
- Ask **2-3 questions per round**, then wait for answers.
- Treat PRODUCT.md and DESIGN.md as anchors; they reduce repeated questions but do **not** replace shape for craft. Shape is task-specific.
- One round is the default. Add a second only if the first answers leave material gaps. Don't run a second round just to feel thorough.
- Round 1 should clarify purpose, audience/context, content/scope, and (for brand) visual direction.
- Round 2, when needed, fills in whatever's still genuinely missing.

**Assert-then-confirm, not menu-with-escape.** When PRODUCT.md and the user's prompt make one option obvious, name it and ask the user to confirm or override. Don't enumerate "Restrained / Committed / Or something else?" as a real choice; "This reads as Restrained, confirm?" beats a four-option menu when the answer is already clear.

### Purpose & Context
- What is this feature for? What problem does it solve?
- Who specifically will use it? (Not "users"; be specific: role, context, frequency)
- What does success look like? How will you know this feature is working?
- What's the user's state of mind when they reach this feature? (Rushed? Exploring? Anxious? Focused?)

### Content & Data
- What content or data does this feature display or collect?
- What are the realistic ranges? (Minimum, typical, maximum, e.g., 0 items, 5 items, 500 items)
- What are the edge cases? (Empty state, error state, first-time use, power user)
- Is any content dynamic? What changes and how often?
- What visual assets are real content here? Note required images, product shots, illustrations, maps, textures, diagrams, generated objects, or existing project assets.

### Design Direction

Force a visual decision on three fronts. Skip anything PRODUCT.md or DESIGN.md already answers; ask only what's missing.

- **Color strategy for this surface.** Pick one: Restrained / Committed / Full palette / Drenched. Can override the project default if the surface earns it (e.g. a drenched hero inside an otherwise Restrained product).
- **Theme via scene sentence.** Write one sentence of physical context for this surface: who uses it, where, under what ambient light, in what mood. The sentence forces dark vs light. If it doesn't, add detail until it does.
- **Two or three named anchor references.** Specific products, brands, objects. Not adjectives like "modern" or "clean."

### Scope

Always ask. Sketch quality and shipped quality are different outputs; don't guess between them.

- **Fidelity.** Sketch / mid-fi / high-fi / production-ready?
- **Breadth.** One screen / a flow / a whole surface?
- **Interactivity.** Static visual / interactive prototype / shipped-quality component?
- **Time intent.** Quick exploration, or polish until it ships?

Scope answers are task-scoped. Don't write them to PRODUCT.md or DESIGN.md; carry them through the design brief only.

### Constraints
- Are there technical constraints? (Framework, performance budget, browser support)
- Are there content constraints? (Localization, dynamic text length, user-generated content)
- Mobile/responsive requirements?
- Accessibility requirements beyond WCAG AA?

### Anti-Goals
- What should this NOT be? What would be a wrong direction?
- What's the biggest risk of getting this wrong?

## Phase 1.5: Visual Direction Probe (Capability-Gated)

After the discovery interview, generate a small set of visual direction probes **before** writing the final brief when all of these are true:

- The work is **net-new** or directionally ambiguous enough that visual exploration will clarify the brief.
- The requested fidelity is **mid-fi, high-fi, or production-ready**. Skip for sketch-only planning.
- The current harness gives you native image generation (Codex's `image_gen`, an equivalent MCP tool, or similar). Don't ask the user to install APIs or tooling.

When those conditions are met, this step is mandatory. If image generation isn't natively available, do not ask the user to install APIs or tooling. State in one line that the image step is skipped because the harness lacks native image generation, then proceed. The one-line announcement is required, not optional; it forces a conscious decision instead of letting the step quietly evaporate.

Use probes to explore visual lanes, not to replace the brief.

Do not skip probes because the final UI will be semantic, editable, code-native, responsive, or accessible. Those are implementation requirements, not reasons to avoid visual exploration.

### What to generate

Generate **2 to 4** distinct direction probes based on the discovery answers, especially:

- Color strategy
- Theme scene sentence
- Named anchor references
- Scope and fidelity

The probes should differ in primary visual direction (hierarchy, topology, density, typographic voice, or color strategy), not just palette tweaks.

### How to use the probes

- Treat them as **direction tests**, not final designs.
- Use them to pressure-test whether the brief is pointing at the right lane.
- Ask the user which direction feels closest, what feels off, and what should carry forward.
- If the probes reveal a mismatch, revise the brief inputs before finalizing the brief.

### Important limits

- Do **not** skip discovery because image generation is available.
- Do **not** treat generated imagery as final UX specification, final copy, or final accessibility behavior.
- Do **not** use this step for minor refinements of existing work. It's for shaping a new surface or clarifying a big directional choice.

If image generation isn't natively available, announce the skip in one line and proceed to the design brief.

## Phase 2: Design Brief

After the interview and any required probes, present a brief and **end your response**. The user must confirm before any implementation runs. Do not present a brief and then continue to code in the same response, even if the brief feels obvious to you. The user's confirmation is the gate.

**Choose the brief shape based on how clear the answers are:**

- **Compact form (3-5 bullets)** when discovery was crisp and the original prompt + PRODUCT.md already pinned scope, content, and direction. State what you're building, the visual lane, and end with one or two specific questions or a clear "confirm or override?" prompt. This is the default for typical craft requests with a clear prompt.
- **Full structured form (sections below)** when the task is genuinely ambiguous, multi-screen, or when the user asked for shape as a standalone step. Use this when the discipline of structure earns its weight.

Don't pad a clear brief into a long one to look thorough. A 70-line brief restating answers the user just gave is noise, not rigor. Equally, don't skip the confirmation pause to look efficient: the pause is the point.

Present the brief, then **stop and wait for explicit confirmation**. You are not the judge of whether the user already approved. Even when the brief feels obviously right, ask once and wait. The pause is what separates shape from premature implementation.

### Brief Structure

**1. Feature Summary** (2-3 sentences)
What this is, who it's for, what it needs to accomplish.

**2. Primary User Action**
The single most important thing a user should do or understand here.

**3. Design Direction**
Color strategy (Restrained / Committed / Full palette / Drenched) + the theme scene sentence + 2–3 named anchor references. Reference PRODUCT.md and DESIGN.md where they already answer, and note any per-surface overrides.

If you ran the Visual Direction Probe step, name which probe direction won and what changed in the brief because of it.

**4. Scope**
Fidelity, breadth, interactivity, and time intent from the Scope section of the interview. Task-scoped; these don't persist beyond the brief.

**5. Layout Strategy**
High-level spatial approach: what gets emphasis, what's secondary, how information flows. Describe the visual hierarchy and rhythm, not specific Flutter.

**6. Key States**
List every state the feature needs: default, empty, loading, error, success, edge cases. For each, note what the user needs to see and feel.

**7. Interaction Model**
How users interact with this feature. What happens on click, hover, scroll? What feedback do they get? What's the flow from entry to completion?

**8. Content Requirements**
What copy, labels, empty state messages, error messages, and microcopy are needed. Note any dynamic content and its realistic ranges. For image-led surfaces, also list the required image/media roles and their likely source (project asset, generated raster, semantic SVG/Flutter, canvas/WebGL, icon library, or accepted omission).

**9. Recommended References**
Based on the brief, list which impeccable-flutter reference files would be most valuable during implementation (e.g., spatial-design.md for complex layouts, motion-design.md for animated features, interaction-design.md for form-heavy features).

**10. Open Questions**
Anything genuinely unresolved. Don't list "open questions" you've already recommended a default for; assert the default and move on. If you'd write `Recommend: X` next to a question, just decide X.

---

STOP and use Codex's structured user-input/question tool when available; if unavailable, ask directly in chat to clarify what you cannot infer. Ask for explicit confirmation of the brief before finishing.

If the user disagrees with any part, revisit the relevant discovery questions. A shape run is incomplete until the user confirms direction.

Once confirmed, the brief is complete. The user can now hand it to $impeccable-flutter, or use it to guide any other implementation approach. (If the user wants the full discovery-then-build flow in one step, they should use $impeccable-flutter craft instead, which runs this command internally.)
