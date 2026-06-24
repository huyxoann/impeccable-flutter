---
name: onboard
description: Design onboarding flows, first-run experiences, and empty states that guide new users to value. Covers welcome screens, account setup, progressive disclosure, contextual tooltips, feature announcements, and activation moments. Use when the user mentions onboarding, first-time users, empty states, activation, getting started, new user flows, or the aha moment.
version: 3.1.1
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

## Specific Instructions: onboard

> **Additional context needed**: the "aha moment" you want users to reach, and users' experience level.

Get users to first value as fast as possible. Onboarding's job is not to teach the product. Its job is to get people to the moment that proves the product is worth their time.

## Assess Onboarding Needs

Understand what users need to learn and why:

1. **Identify the challenge**:
   - What are users trying to accomplish?
   - What's confusing or unclear about current experience?
   - Where do users get stuck or drop off?
   - What's the "aha moment" we want users to reach?

2. **Understand the users**:
   - What's their experience level? (Beginners, power users, mixed?)
   - What's their motivation? (Excited and exploring? Required by work?)
   - What's their time commitment? (5 minutes? 30 minutes?)
   - What alternatives do they know? (Coming from competitor? New to category?)

3. **Define success**:
   - What's the minimum users need to learn to be successful?
   - What's the key action we want them to take? (First project? First invite?)
   - How do we know onboarding worked? (Completion rate? Time to value?)

**CRITICAL**: Onboarding should get users to value as quickly as possible, not teach everything possible.

## Onboarding Principles

Follow these core principles:

### Show, Don't Tell
- Demonstrate with working examples, not just descriptions
- Provide real functionality in onboarding, not separate tutorial mode
- Use progressive disclosure, teach one thing at a time

### Make It Optional (When Possible)
- Let experienced users skip onboarding
- Don't block access to product
- Provide "Skip" or "I'll explore on my own" options

### Time to Value
- Get users to their "aha moment" ASAP
- Front-load most important concepts
- Teach 20% that delivers 80% of value
- Save advanced features for contextual discovery

### Context Over Ceremony
- Teach features when users need them, not upfront
- Empty states are onboarding opportunities
- Tooltips and hints at point of use

### Respect User Intelligence
- Don't patronize or over-explain
- Be concise and clear
- Assume users can figure out standard patterns

## Design Onboarding Experiences

Create appropriate onboarding for the context:

### Initial Product Onboarding

**Welcome Screen**:
- Clear value proposition (what is this product?)
- What users will learn/accomplish
- Time estimate (honest about commitment)
- Option to skip (for experienced users)

**Account Setup**:
- Minimal required information (collect more later)
- Explain why you're asking for each piece of information
- Smart defaults where possible
- Social login when appropriate

**Core Concept Introduction**:
- Introduce 1-3 core concepts (not everything)
- Use simple language and examples
- Interactive when possible (do, don't just read)
- Progress indication (step 1 of 3)

**First Success**:
- Guide users to accomplish something real
- Pre-populated examples or templates
- Celebrate completion (but don't overdo it)
- Clear next steps

### Feature Discovery & Adoption

**Empty States**:
Instead of blank space, show:
- What will appear here (description + screenshot/illustration)
- Why it's valuable
- Clear CTA to create first item
- Example or template option

Example:
```
No projects yet
Projects help you organize your work and collaborate with your team.
[Create your first project] or [Start from template]
```

**Contextual Tooltips**:
- Appear at relevant moment (first time user sees feature)
- Point directly at relevant UI element
- Brief explanation + benefit
- Dismissable (with "Don't show again" option)
- Optional "Learn more" link

**Feature Announcements**:
- Highlight new features when they're released
- Show what's new and why it matters
- Let users try immediately
- Dismissable

**Progressive Onboarding**:
- Teach features when users encounter them
- Badges or indicators on new/unused features
- Unlock complexity gradually (don't show all options immediately)

### Guided Tours & Walkthroughs

**When to use**:
- Complex interfaces with many features
- Significant changes to existing product
- Industry-specific tools needing domain knowledge

**How to design**:
- Spotlight specific UI elements (dim rest of page)
- Keep steps short (3-7 steps max per tour)
- Allow users to click through tour freely
- Include "Skip tour" option
- Make replayable (help menu)

**Best practices**:
- Interactive over passive (let users click real buttons)
- Focus on workflow, not features ("Create a project" not "This is the project button")
- Provide sample data so actions work

### Interactive Tutorials

**When to use**:
- Users need hands-on practice
- Concepts are complex or unfamiliar
- High stakes (better to practice in safe environment)

**How to design**:
- Sandbox environment with sample data
- Clear objectives ("Create a chart showing sales by region")
- Step-by-step guidance
- Validation (confirm they did it right)
- Graduation moment (you're ready!)

### Documentation & Help

**In-product help**:
- Contextual help links throughout interface
- Keyboard shortcut reference
- Search-able help center
- Video tutorials for complex workflows

**Help patterns**:
- `?` icon near complex features
- "Learn more" links in tooltips
- Keyboard shortcut hints (`⌘K` shown on search box)

## Empty State Design

Every empty state needs:

### What Will Be Here
"Your recent projects will appear here"

### Why It Matters
"Projects help you organize your work and collaborate with your team"

### How to Get Started
[Create project] or [Import from template]

### Visual Interest
Illustration or icon (not just text on blank page)

### Contextual Help
"Need help getting started? [Watch 2-min tutorial]"

**Empty state types**:
- **First use**: Never used this feature (emphasize value, provide template)
- **User cleared**: Intentionally deleted everything (light touch, easy to recreate)
- **No results**: Search or filter returned nothing (suggest different query, clear filters)
- **No permissions**: Can't access (explain why, how to get access)
- **Error state**: Failed to load (explain what happened, retry option)

## Implementation Patterns

### Technical approaches:

**Tooltip libraries**: `just_the_tooltip`, `super_tooltip`
**Tour libraries**: `showcaseview`, `tutorial_coach_mark`
**Modal patterns**: `showDialog`, `showModalBottomSheet`, `BarrierDismissible`
**Progress tracking**: `shared_preferences` for "seen" states
**Analytics**: Track completion, drop-off points

**Storage patterns**:
```dart
// Track which onboarding steps user has seen
final prefs = await SharedPreferences.getInstance();
await prefs.setBool('onboarding-completed', true);
await prefs.setBool('feature-tooltip-seen-reports', true);
```

**IMPORTANT**: Don't show same onboarding twice (annoying). Track completion and respect dismissals.

**NEVER**:
- Force users through long onboarding before they can use product
- Patronize users with obvious explanations
- Show same tooltip repeatedly (respect dismissals)
- Block all UI during tour (let users explore)
- Create separate tutorial mode disconnected from real product
- Overwhelm with information upfront (progressive disclosure!)
- Hide "Skip" or make it hard to find
- Forget about returning users (don't show initial onboarding again)

## Verify Onboarding Quality

Test with real users:

- **Time to completion**: Can users complete onboarding quickly?
- **Comprehension**: Do users understand after completing?
- **Action**: Do users take desired next step?
- **Skip rate**: Are too many users skipping? (Maybe it's too long or not valuable)
- **Completion rate**: Are users completing? (If low, simplify)
- **Time to value**: How long until users get first value?

When users hit the aha moment fast and don't drop off, hand off to `$impeccable-flutter polish` for the final pass.
