Designs that only work with perfect data aren't production-ready. Harden the interface against the inputs, errors, languages, and network conditions that real users will throw at it.

## Assess Hardening Needs

Identify weaknesses and edge cases:

1. **Test with extreme inputs**:
   - Very long text (names, descriptions, titles)
   - Very short text (empty, single character)
   - Special characters (emoji, RTL text, accents)
   - Large numbers (millions, billions)
   - Many items (1000+ list items, 50+ options)
   - No data (empty states)

2. **Test error scenarios**:
   - Network failures (offline, slow, timeout)
   - API errors (400, 401, 403, 404, 500)
   - Validation errors
   - Permission errors
   - Concurrent operations

3. **Test internationalization**:
   - Long translations (German is often 30% longer than English)
   - RTL languages (Arabic, Hebrew)
   - Character sets (Chinese, Japanese, Korean, emoji)
   - Date/time formats
   - Number formats (1,000 vs 1.000)

**CRITICAL**: Designs that only work with perfect data aren't production-ready. Harden against reality.

## Hardening Dimensions

Systematically improve resilience:

### Text Overflow & Wrapping

**Long text handling in Flutter**:
```dart
// Single line with ellipsis
Text(
  'Very long text...',
  maxLines: 1,
  overflow: TextOverflow.ellipsis,
);

// Allow wrapping natively
Text(
  'Very long text...',
  softWrap: true,
);
```

**Flex/Row overflow**:
```dart
// Prevent Row items from overflowing
Row(
  children: [
    Expanded( // or Flexible
      child: Text('This text will wrap or truncate safely instead of causing a RenderFlex overflow error on the right side.'),
    ),
    Icon(Icons.info),
  ],
)
```

**Responsive text sizing**:
- Use `FittedBox` carefully for scaling text to fit boundaries.
- Respect the device's text scaling factor (`MediaQuery.textScalerOf(context)`). Do not hardcode font sizes in a way that breaks accessibility zoom.

### Internationalization (i18n)

**Text expansion**:
- Add 30-40% space budget for translations.
- Use `Expanded` or `Wrap` that adapts to content.
- Test with longest language (usually German).
- Avoid fixed `width` or `height` on text containers.

**RTL (Right-to-Left) support**:
- Use `Directionality` aware widgets.
- Use `padding: EdgeInsetsDirectional.only(start: 16)` instead of `EdgeInsets.only(left: 16)`.
- Use `AlignmentDirectional` instead of `Alignment`.

**Date/Time & Number formatting**:
- Use the `intl` package.
- `NumberFormat.currency(locale: 'en_US', symbol: '\$').format(1234.56)`
- `DateFormat.yMMMd('de_DE').format(date)`

### Error Handling

**Network errors**:
- Show clear error messages.
- Provide a retry button.
- Explain what happened.
- Offer offline mode (if applicable).

```dart
// Error states with recovery
if (hasError) {
  return Column(
    mainAxisAlignment: MainAxisAlignment.center,
    children: [
      Text('Failed to load data. ${error.message}'),
      ElevatedButton(
        onPressed: retryFetch,
        child: const Text('Try again'),
      ),
    ],
  );
}
```

**Form validation errors**:
- Inline errors near fields (`errorText` in `InputDecoration`).
- Clear, specific messages.
- Suggest corrections.
- Preserve user input on error.

**API errors**:
- Handle each status code appropriately (400, 401, 403, 404, 500).

### Edge Cases & Boundary Conditions

**Empty states**:
- No items in list.
- No search results.
- No data to display.
- Provide clear next action (e.g., "Create your first project").

**Loading states**:
- Initial load vs Pagination load.
- Show what's loading.
- Avoid locking the UI unnecessarilly.

**Large datasets**:
- Use `ListView.builder` or `SliverList` instead of rendering all items in a `Column`.
- Implement infinite scrolling/pagination.

**Keyboard Resizing**:
- Handle software keyboard popping up on mobile devices.
- Wrap forms in a scrolling container to prevent `RenderFlex` overflow errors when the keyboard appears.
- Use `resizeToAvoidBottomInset: true` on `Scaffold`.

### Input Validation & Sanitization

**Client-side validation**:
- Required fields.
- Format validation (regex for email, phone).
- Set the correct `keyboardType` (e.g., `TextInputType.emailAddress`).
- Use `TextInputFormatter` to restrict allowed characters.

### Accessibility Resilience

**Keyboard & Screen reader support**:
- Provide `Semantics` wrappers for custom interactive widgets.
- Use `Tooltip` for icon-only buttons.
- Ensure proper `FocusNode` traversal.

## Testing Strategies

**Manual testing**:
- Test with extreme data (very long, very short, empty).
- Test on a physical device with text scaling increased to 200%.
- Test with the software keyboard open.
- Test offline.

**IMPORTANT**: Hardening is about expecting the unexpected. Real users will do things you never imagined.

**NEVER**:
- Assume perfect input (validate everything).
- Leave error messages generic ("Error occurred").
- Trust client-side validation alone.
- Use fixed widths/heights for text containers.
- Block the entire interface when one component errors.

When edge cases are covered, hand off to `$impeccable-flutter polish` for the final pass.