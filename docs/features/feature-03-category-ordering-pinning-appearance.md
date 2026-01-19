# Feature 03: Category ordering, pinning, and appearance

## Summary

Allow users to reorder categories, pin favorites to the top, and customize category appearance with colors and icons.

## Goals

- Drag-and-drop category ordering.
- Pin categories to the top.
- Optional color and icon customization.

## Non-goals

- Cross-user shared category styles.
- Advanced theming (handled in settings).

## User stories

- Reorder categories to match my workflow.
- Pin daily categories so they always appear first.
- Add a color or icon to make categories recognizable.

## UX flows

- Category list supports drag handle; reorder persists on drop.
- Category menu includes "Pin/Unpin" and "Edit appearance".
- Appearance dialog shows icon picker and color grid.

## Data model changes (Convex)

- Update `bookmarks` table in `convex/schema.ts`:
  - `sortIndex` (number)
  - `pinned` (boolean)
  - `color` (string, optional)
  - `icon` (string, optional)
- Add index `by_user_sort` on `userId`, `pinned`, `sortIndex`.

## Backend changes

- Update `convex/bookmarks.ts` `listByUser`:
  - Sort pinned first, then `sortIndex`.
- Add mutations:
  - `bookmarks.reorder` (accept ordered list or moved item).
  - `bookmarks.togglePin`.
  - `bookmarks.updateAppearance`.
- Ensure ownership checks on all updates.

## Frontend changes

- Add drag-and-drop in `src/components/ui/BookmarkCategories.tsx`.
- Add UI controls in `src/components/ui/CategoryPreferences.tsx`.
- Add appearance dialog component with icon and color selection.
- Update `src/types.ts` for new fields.

## Validation and error handling

- Clamp `sortIndex` within valid range.
- Validate color tokens to a known palette.
- Ignore missing icons or fall back to default.

## Performance

- Use optimistic updates to keep UI responsive.
- Batch reorder updates to reduce mutation calls.

## Testing plan

- Unit tests for reorder mutation.
- Component tests for drag and drop.
- Test pinned sorting order.

## Rollout and migration

- Initialize `sortIndex` for existing categories.
- Default `pinned` to false.

## Open questions

- Should pinning override custom order or be a separate grouping?
