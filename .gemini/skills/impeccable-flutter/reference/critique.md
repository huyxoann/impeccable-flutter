> **Additional context needed**: what the interface is trying to accomplish.

### Setup: Resolve Target and Load Ignore List

Before gathering assessments, do two small bookkeeping steps.

1. **Resolve the primary artifact.** The user's phrasing ("the homepage", "the settings screen") is not stable enough to track across runs. Resolve it to a concrete Dart file path. Examples:
   - "the homepage" → `lib/screens/home_screen.dart`
   - "the settings modal" → `lib/widgets/settings_dialog.dart`

2. **Compute the slug.** Run:
   ```bash
   node .gemini/skills/impeccable-flutter/scripts/critique-storage.mjs slug "<resolved-path-or-url>"
   ```
   Keep the printed slug. If the command exits non-zero, skip persistence for this run.

3. **Read the ignore list** at `.impeccable-flutter/critique/ignore.md` if it exists. When a finding's text matches a line here, **drop it silently**.

### Gather Assessments

Launch two independent assessments. **Neither may see the other's output.** Running both in one head silently anchors them to each other; do not shortcut it. Delegate each assessment to a separate sub-agent if possible.

#### Assessment A: LLM Design Review

Read the relevant Dart source files. Evaluate:

**AI Slop Detection (CRITICAL)**: Does this look like every other AI-generated interface? Review against ALL **DON'T** guidelines from the parent impeccable-flutter skill. Check for AI color palettes, generic Material 3 defaults without brand styling, card-and-column grids, and all other tells. **The test**: If someone said "AI made this," would you believe them immediately?

**Holistic Design Review**: visual hierarchy, information architecture, emotional resonance, discoverability, composition, typography, color, states & edge cases, microcopy.

**Cognitive Load** (consult [cognitive-load](cognitive-load.md)):
- Run the 8-item cognitive load checklist. Report failure count: 0-1 = low (good), 2-3 = moderate, 4+ = critical.
- Count visible options at each decision point. If >4, flag it.

**Emotional Journey**:
- What emotion does this interface evoke? Is that intentional?
- Check for anxiety spikes at high-stakes moments.

**Nielsen's Heuristics** (consult [heuristics-scoring](heuristics-scoring.md)):
Score each of the 10 heuristics 0-4.

#### Assessment B: Automated Detection (if applicable)

If a static code analyzer or custom Flutter linter is available in the workspace, run it on the target Dart files. Since pure visual layout analysis of a Flutter app requires running the app, focus on structural warnings (e.g., hardcoded colors instead of `Theme.of(context)`).

### Generate Combined Critique Report

Synthesize the assessments into a single report. Structure your feedback as a design director would:

#### Design Health Score
> *Consult [heuristics-scoring](heuristics-scoring.md)*

Present the Nielsen's 10 heuristics scores as a table:

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | ? | [specific finding or "n/a" if solid] |
| 2 | Match System / Real World | ? | |
| ... | ... | ... | ... |
| **Total** | | **??/40** | **[Rating band]** |

#### Anti-Patterns Verdict

**Start here.** Does this look AI-generated? Evaluate AI slop tells. Cover overall aesthetic feel, layout sameness, generic composition, missed opportunities for personality.

#### Overall Impression
A brief gut reaction: what works, what doesn't, and the single biggest opportunity.

#### What's Working
Highlight 2-3 things done well. Be specific about why they work.

#### Priority Issues
The 3-5 most impactful design problems, ordered by importance.

For each issue, tag with **P0-P3 severity**:
- **[P?] What**: Name the problem clearly
- **Why it matters**: How this hurts users or undermines goals
- **Fix**: What to do about it (be concrete in Dart)
- **Suggested command**: Which impeccable-flutter command could address this.

#### Persona Red Flags
> *Consult [personas](personas.md)*

Auto-select 2-3 personas most relevant to this interface type.

**Alex (Power User)**: No fast paths. High abandonment risk.
**Jordan (First-Timer)**: Technical jargon. No visible help.

Name the exact elements and interactions that fail each persona.

#### Minor Observations
Quick notes on smaller issues worth addressing.

#### Questions to Consider
Provocative questions that might unlock better solutions.

### Persist the Snapshot

Write it to `.impeccable-flutter/critique/` so the user can refer back. Skip this step if the Setup slug was null.

1. **Write the body to a temp file**
2. **Pass the structured metadata**:
   ```bash
   IMPECCABLE_CRITIQUE_META='{"target":"<user phrasing>","total_score":<n>,"p0_count":<n>,"p1_count":<n>}' \
     node .gemini/skills/impeccable-flutter/scripts/critique-storage.mjs write <slug> <body-file>
   ```
3. **Read the trend**:
   ```bash
   node .gemini/skills/impeccable-flutter/scripts/critique-storage.mjs trend <slug> 5
   ```

### Ask the User

Ask 2-4 targeted questions based on findings to shape the action plan.

### Recommended Actions

Present a prioritized action summary mapping findings to `impeccable-flutter` commands. End with `$impeccable-flutter polish` as the final step.