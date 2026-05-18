# Interaction Design

## The Eight Interactive States

Every interactive element needs these states designed:

| State | When | Visual Treatment |
|-------|------|------------------|
| **Default** | At rest | Base styling |
| **Hover** | Pointer over (not touch) | Subtle lift, color shift |
| **Focus** | Keyboard/programmatic focus | Visible ring or highlight |
| **Active** | Being pressed / Tapped | Pressed in, darker, splash |
| **Disabled** | Not interactive | Reduced opacity, grayed out |
| **Loading** | Processing | Spinner, skeleton |
| **Error** | Invalid state | Red border, icon, message |
| **Success** | Completed | Green check, confirmation |

**The common miss**: Designing hover without focus, or vice versa. They're different. Keyboard users never see hover states. Use Flutter's `WidgetStateProperty` to handle these elegantly.

## Focus Indicators: Do Them Right

**Never disable focus indicators without a replacement.** It's an accessibility violation. In Flutter, many widgets handle this automatically, but custom interactive widgets must handle `WidgetState.focused`:

```dart
// Using WidgetStateProperty for consistent state-driven styling
final borderSide = WidgetStateProperty.resolveWith<BorderSide>((states) {
  if (states.contains(WidgetState.error)) {
    return BorderSide(color: Colors.red, width: 2);
  }
  if (states.contains(WidgetState.focused)) {
    return BorderSide(color: Theme.of(context).colorScheme.primary, width: 2);
  }
  return BorderSide(color: Colors.grey, width: 1);
});
```

**Focus ring design**:
- High contrast (3:1 minimum against adjacent colors)
- 2-3px thick
- Consistent across all interactive elements

## Form Design: The Non-Obvious

**Placeholders aren't labels.** They disappear on input. Always use visible labels (e.g., `InputDecoration.labelText` in Flutter, which floats above the input). **Validate on blur or submit**, not on every keystroke (exception: password strength). Place errors **below** fields, which Flutter's `TextFormField` handles natively via the `errorText` property.

## Loading States

**Optimistic updates**: Show success immediately, rollback on failure. Use for low-stakes actions (likes, follows), not payments or destructive actions. 

**Skeleton screens > spinners**: they preview content shape and feel faster than generic spinners. Use the `skeletonizer` package in Flutter to easily wrap your standard layout in a loading shimmer.

## Modals: The Modal Barrier

In Flutter, standard dialogs trap focus automatically. Use the built-in navigation methods to ensure proper accessibility and focus management:

```dart
showDialog(
  context: context,
  barrierDismissible: true, // Allow light-dismiss by tapping outside
  builder: (context) => AlertDialog(
    title: const Text('Modal Title'),
    content: const Text('Focus stays inside the modal.'),
    actions: [
      TextButton(onPressed: () => Navigator.pop(context), child: const Text('Close')),
    ],
  ),
);
```

For bottom sheets, use `showModalBottomSheet`. Both handle the semantic "inert" behavior of the background automatically.

## Dropdowns & Overlays: Avoiding Clipping

Dropdowns or tooltips rendered inside a constrained parent (like a `ListView` or a strictly sized `Container`) will be clipped. This is the single most common overlay bug.

### OverlayPortal (The Modern Solution)

Flutter's `OverlayPortal` allows you to render a child on top of everything else (in the Overlay) without needing complex `OverlayEntry` management or state passing.

```dart
class MyDropdown extends StatefulWidget {
  @override
  State<MyDropdown> createState() => _MyDropdownState();
}

class _MyDropdownState extends State<MyDropdown> {
  final OverlayPortalController _controller = OverlayPortalController();
  final LayerLink _link = LayerLink();

  @override
  Widget build(BuildContext context) {
    return CompositedTransformTarget(
      link: _link,
      child: OverlayPortal(
        controller: _controller,
        overlayChildBuilder: (context) {
          return CompositedTransformFollower(
            link: _link,
            targetAnchor: Alignment.bottomLeft,
            followerAnchor: Alignment.topLeft,
            child: Align(
              alignment: Alignment.topLeft,
              child: Material(
                elevation: 4,
                child: Text('This floats above everything and won\'t be clipped!'),
              ),
            ),
          );
        },
        child: ElevatedButton(
          onPressed: _controller.toggle,
          child: const Text('Toggle Menu'),
        ),
      ),
    );
  }
}
```

By combining `OverlayPortal` with `CompositedTransformFollower` and `LayerLink`, you tether the floating overlay to the target button exactly like modern web anchor positioning, but native to Flutter.

### Native Dropdowns

When possible, just use Flutter's `DropdownMenu` or `MenuAnchor`, which handle the overlay math and focus traversal internally.

### Anti-Patterns

- **`Stack` abuse** - Trying to build a dropdown by absolutely positioning it within a `Stack` that is buried deep in a `ScrollView`. It will get clipped. Use `OverlayPortal` or `MenuAnchor`.
- **Arbitrary Z-Index** - Flutter paints back-to-front in a `Stack`. If an element needs to escape its parent's bounds, it must be lifted into the `Overlay`.

## Destructive Actions: Undo > Confirm

**Undo is better than confirmation dialogs.** Users tap through confirmations mindlessly. Remove from UI immediately, show an undo `SnackBar`, and actually delete after the snackbar expires. Use confirmation dialogs only for truly irreversible actions (account deletion), high-cost actions, or batch operations.

```dart
ScaffoldMessenger.of(context).showSnackBar(
  SnackBar(
    content: const Text('Item deleted'),
    action: SnackBarAction(
      label: 'Undo',
      onPressed: () {
        // Restore item
      },
    ),
  ),
);
```

## Keyboard Navigation Patterns

### Focus Traversal

Flutter handles most keyboard navigation automatically via the widget tree order. For complex component groups (like custom tab bars or segmented controls), use `FocusTraversalGroup` to define how the Tab key should move through the UI.

```dart
FocusTraversalGroup(
  policy: ReadingOrderTraversalPolicy(),
  child: Column(
    // children focus in reading order
  ),
)
```

## Gesture Discoverability

Swipe-to-delete (like `Dismissible` in Flutter) and similar gestures are invisible. Hint at their existence:

- **Partially reveal**: Show the delete button peeking from the edge in an onboarding step.
- **Alternative**: Always provide a visible fallback (e.g., a "Delete" option in a long-press menu or an overflow icon).

Don't rely on gestures as the only way to perform actions.

---

**Avoid**: Removing focus indicators without alternatives. Using placeholder text as primary labels. Touch targets <44x44px. Generic error messages. Custom controls without semantic/accessibility support.