# Feature 20: Accessibility and keyboard-first flows

## Summary

Improve accessibility and keyboard usability across the app.

## Goals

- Ensure all interactive elements are keyboard accessible.
- Add common keyboard shortcuts for power users.
- Improve focus management in dialogs and menus.

## Non-goals

- Full WCAG certification.

## User stories

- I can use the app without a mouse.
- I can jump between categories and add links quickly.
- I can see focus outlines clearly.

## UX flows

- Global shortcuts:
  - `/` to focus search
  - `n` to add new link
  - `c` to add new category
- Focus trap in dialogs and popovers.
- Skip link to main content.

## Data model changes (Convex)

- None required.

## Backend changes

- None required.

## Frontend changes

- Add keyboard handler in root layout.
- Update UI components to include `aria-label` and `aria-expanded`.
- Ensure `Menu`, `Dialog`, and `Popover` components handle focus correctly.
- Add skip link and stronger focus styles in `src/styles.css`.

## Validation and error handling

- Add accessible error messages to forms.
- Ensure input errors are linked via `aria-describedby`.

## Security and privacy

- No changes.

## Performance

- Minimal impact.

## Testing plan

- Add Testing Library tests for keyboard navigation.
- Add manual checklist for screen reader and focus order.

## Rollout and migration

- Apply changes progressively; verify no regressions.

## Open questions

- Should we add a visible shortcut help modal?
