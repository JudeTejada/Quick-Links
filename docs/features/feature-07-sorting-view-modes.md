# Feature 07: Sorting and view modes

## Summary

Allow sorting links and switching between grid and compact list views.

## Goals

- Provide sorting options: recent, alphabetical, custom.
- Provide view modes: grid, compact list.
- Persist user preferences.

## Non-goals

- Complex per-category custom layouts.

## User stories

- I can sort links alphabetically in a category.
- I can switch to a compact list for dense view.
- My preferences persist across sessions.

## UX flows

- Sort dropdown in category header.
- View mode toggle in header or settings.
- Custom sort mode with drag handle.

## Data model changes (Convex)

- Add `links.sortIndex` (number).
- Add `links.lastVisitedAt` (number, optional).
- Extend `users` table with `defaultSort` and `defaultView`.

## Backend changes

- Update queries in `convex/bookmarks.ts` to accept sorting params.
- Add `links.updateOrder` mutation for custom ordering.
- Add `users.updatePreferences` mutation for default view and sort.

## Frontend changes

- Add sort control UI to `CategoryPreferences`.
- Update `LinksList` to render grid or list.
- Add drag-and-drop for custom ordering within a category.

## Validation and error handling

- Ensure `sortIndex` updates are atomic per category.
- Fallback to recent sort if unknown value.

## Performance

- Avoid re-sorting on every render by memoizing.
- Use optimistic updates for sort changes.

## Testing plan

- Unit tests for sorting logic.
- Component tests for view toggle persistence.

## Rollout and migration

- Initialize `sortIndex` for existing links.

## Open questions

- Should sort settings be per category or global?
