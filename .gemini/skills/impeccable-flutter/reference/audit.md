Run systematic **technical** quality checks and generate a comprehensive report. Don't fix issues; document them for other commands to address.

This is a code-level audit, not a design critique. Check what's measurable and verifiable in the implementation.

## Diagnostic Scan

Run comprehensive checks across 5 dimensions. Score each dimension 0-4 using the criteria below.

### 1. Accessibility (A11y)

**Check for**:
- **Contrast issues**: Text contrast ratios < 4.5:1 (or 7:1 for AAA).
- **Semantic Dart**: Using bare `GestureDetector`s without `Semantics` wrappers, or lacking `SemanticLabel` on critical icon-only buttons (`IconButton(tooltip: ...)`).
- **Screen reader flow**: `MergeSemantics` missing on complex custom components.
- **Focus Indicators**: No visible feedback for keyboard focus (`WidgetState.focused`).
- **Form issues**: Inputs without labels or clear error messaging.

**Score 0-4**: 0=Inaccessible, 1=Major gaps, 2=Partial, 3=Good (mostly accessible), 4=Excellent (full Semantics support).

### 2. Performance

**Check for**:
- **Rebuild thrashing**: Calling `setState` at the root of a large Widget Tree instead of isolating state.
- **Expensive animations**: Casual use of `saveLayer` triggers (`Opacity` + multiple children, `ShaderMask`, `ClipPath`) that visibly drop frames in Profile mode.
- **Missing optimization**: Long lists using `Column` instead of `ListView.builder`. Lack of `const` constructors on static widgets.
- **Bundle size**: Unused heavy asset files, overly large fonts loaded in `pubspec.yaml`.
- **Repaint Boundaries**: Missing `RepaintBoundary` on static elements next to heavy animations.

**Score 0-4**: 0=Severe issues (jank, unoptimized everything), 1=Major problems (no `const`, heavy lists), 2=Partial (some optimization, gaps remain), 3=Good (mostly optimized), 4=Excellent (fast, lean, well-optimized).

### 3. Theming

**Check for**:
- **Hard-coded colors**: `Colors.blue` or `Color(0xFF...)` sprinkled in UI instead of `Theme.of(context).colorScheme`.
- **Hard-coded TextStyles**: `TextStyle(fontSize: 16)` instead of `Theme.of(context).textTheme`.
- **Broken dark mode**: Missing dark mode variants in `MaterialApp(darkTheme: ...)`.
- **Inconsistent tokens**: Using raw values instead of established `AppSpacing` or token constants.

**Score 0-4**: 0=No theming (hard-coded everything), 1=Minimal tokens (mostly hard-coded), 2=Partial (tokens exist but inconsistently used), 3=Good (tokens used, minor hard-coded values), 4=Excellent (full `ThemeData` system).

### 4. Responsive Design

**Check for**:
- **Fixed widths**: Hard-coded `width: 400` that throws `RenderFlex` overflow errors on small screens.
- **Touch targets**: Interactive elements < 44x44px.
- **Orientation handling**: UI breaks in landscape mode.
- **Text scaling**: `RenderFlex` overflow errors when device text size is set to 200%.
- **Missing breakpoints**: `LayoutBuilder` missing for tablet/desktop adaptations.

**Score 0-4**: 0=Mobile-only (breaks on tablet/landscape), 1=Major issues (some `LayoutBuilder`s, many failures), 2=Partial (works, rough edges), 3=Good (responsive, minor touch target or overflow issues), 4=Excellent (fluid, handles text scaling).

### 5. Anti-Patterns (CRITICAL)

Check against ALL the **DON'T** guidelines from the parent impeccable skill (already loaded in this context). Look for AI slop tells (AI color palette, gradient text, glassmorphism, hero metrics, card grids, generic fonts) and general design anti-patterns (gray on color, nested cards, bounce easing, redundant copy).

**Score 0-4**: 0=AI slop gallery (5+ tells), 1=Heavy AI aesthetic (3-4 tells), 2=Some tells (1-2 noticeable), 3=Mostly clean (subtle issues only), 4=No AI tells (distinctive, intentional design).

## Generate Report

### Audit Health Score

| # | Dimension | Score | Key Finding |
|---|-----------|-------|-------------|
| 1 | Accessibility | ? | [most critical a11y issue or "--"] |
| 2 | Performance | ? | |
| 3 | Responsive Design | ? | |
| 4 | Theming | ? | |
| 5 | Anti-Patterns | ? | |
| **Total** | | **??/20** | **[Rating band]** |

**Rating bands**: 18-20 Excellent (minor polish), 14-17 Good (address weak dimensions), 10-13 Acceptable (significant work needed), 6-9 Poor (major overhaul), 0-5 Critical (fundamental issues).

### Anti-Patterns Verdict
**Start here.** Pass/fail: Does this look AI-generated? List specific tells. Be brutally honest.

### Executive Summary
- Audit Health Score: **??/20** ([rating band])
- Total issues found (count by severity: P0/P1/P2/P3)
- Top 3-5 critical issues
- Recommended next steps

### Detailed Findings by Severity

Tag every issue with **P0-P3 severity**:
- **P0 Blocking**: Prevents task completion or causes exceptions (`RenderFlex` overflow). Fix immediately.
- **P1 Major**: Significant difficulty, WCAG violation, or heavy jank. Fix before release.
- **P2 Minor**: Annoyance, workaround exists. Fix in next pass.
- **P3 Polish**: Nice-to-fix, no real user impact. Fix if time permits.

For each issue, document:
- **[P?] Issue name**
- **Location**: Widget, file, line
- **Category**: Accessibility / Performance / Theming / Responsive / Anti-Pattern
- **Impact**: How it affects users
- **Recommendation**: How to fix it in Dart/Flutter
- **Suggested command**: Which command to use.

### Patterns & Systemic Issues

Identify recurring problems that indicate systemic gaps rather than one-off mistakes:
- "Hard-coded colors appear in 15+ widgets, should use `Theme.of(context)`"
- "Touch targets consistently too small (<44px) throughout."

### Positive Findings

Note what's working well: good practices to maintain and replicate.

## Recommended Actions

List recommended commands in priority order (P0 first, then P1, then P2):

1. **[P?] `$command-name`**: Brief description (specific context from audit findings)
2. **[P?] `$command-name`**: Brief description (specific context)

**Rules**: Only recommend commands from the impeccable-flutter suite. End with `$impeccable-flutter polish` as the final step.

After presenting the summary, tell the user:

> You can ask me to run these one at a time, all at once, or in any order you prefer.
>
> Re-run `$impeccable-flutter audit` after fixes to see your score improve.

**IMPORTANT**: Be thorough but actionable. Too many P3 issues creates noise. Focus on what actually matters.