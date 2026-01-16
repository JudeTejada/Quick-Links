# Feature 21: Drag and drop links and categories

## Summary

Add drag-and-drop interactions to move links between categories and reorder categories by dragging. The UI should feel polished, fast, and intentional, with clear visual feedback and smooth motion.

## Goals

- Allow dragging a link to a different category.
- Allow sorting categories by dragging.
- Provide a crisp, high-quality UI with clear drop targets and animations.
- Keep updates consistent with Convex data and existing TanStack Start flow.

## Non-goals

- Cross-user drag and drop.
- Multi-item dragging (handled by bulk actions).
- Dragging across workspaces (if added later).

## UX and visual direction

- Use large, high-contrast drag handles and soft drop shadows for the dragged item.
- Drop targets highlight with a subtle, full-width glow and a thin outline.
- Categories expand slightly on hover when a link is dragged over them.
- Links show a ghost preview with rounded corners and a faint gradient.
- Animations should feel springy but restrained (120–180ms ease-out).

## User stories

- I can drag a link from one category into another.
- I can reorder categories by dragging the header area.
- I see clear indicators for where a link will land.
- I can cancel drag easily and nothing changes.

## UX flows

- Link drag to category
  - User drags a link card.
  - Category headers and drop zones highlight.
  - Dropping over a category moves the link there.
  - A toast confirms the move.
- Category reorder
  - User drags a category header.
  - A placeholder appears at the new position.
  - On drop, order is saved and the list animates into place.

## Data model changes (Convex)

- Add `sortIndex` to `bookmarks` table if not present.
- Add `sortIndex` to `links` table if custom ordering per category is desired.
- Add `updatedAt` to both tables to support conflict resolution.

## Backend changes (Convex)

- `bookmarks.reorder` mutation
  - Input: ordered list of category IDs or `{categoryId, targetIndex}`.
  - Validate ownership for all categories.
  - Update `sortIndex` for all impacted categories.
- `links.move` mutation
  - Input: `{linkId, fromCategoryId, toCategoryId, targetIndex?}`.
  - Validate ownership and categories.
  - Update `categoryId`, and re-index affected links in both categories.
- `links.reorder` mutation (optional)
  - Update `sortIndex` within a category.

## Frontend changes

- Add drag-and-drop library (example: `@dnd-kit/core`).
- Update `src/components/ui/LinksList.tsx`
  - Wrap list in DnD context.
  - Make each link draggable with a handle.
  - Define drop zones for categories.
  - Show ghost preview and placeholder.
- Update `src/components/ui/BookmarkCategories.tsx`
  - Wrap category list in sortable context.
  - Add drag handle on category header.
  - Animate layout changes.
- Add UI helpers:
  - `DragHandle` component with icon and tooltip.
  - `DropIndicator` component for position preview.
  - `DragOverlay` for high-quality drag preview.

## UI detail checklist

- Drag handle target is large enough (32x32px) for touch.
- Drag overlay includes favicon or link preview and title.
- Drop target glow is subtle but obvious.
- Category headers show a slight elevation when dragging over them.
- Cursor changes to grabbing during drag.
- Smooth reflow animation on drop.

## Validation and error handling

- If a drag ends outside a valid drop zone, revert UI.
- If the server mutation fails, revert and show error toast.
- Prevent moving a link into the same category without change.
- Block drag if user is offline.

## Performance

- Use optimistic UI updates to feel instant.
- Batch reorder updates where possible.
- Avoid re-rendering all categories during drag.

## Testing plan

- Unit tests for `bookmarks.reorder` and `links.move`.
- Component tests for drag start, hover, drop behavior.
- Manual QA on desktop and mobile touch.

## Rollout and migration

- Backfill `sortIndex` for existing categories and links.
- Deploy backend changes before enabling drag UI.

## Open questions

- Should link order be preserved when moved to another category?
- Do we want drag-and-drop in compact view?

## Implementation checklist with estimates

- Decision and prep (0.5 day)
  - Pick DnD library (`@dnd-kit/core` recommended).
  - Confirm whether link order is preserved on move.
  - Confirm drag handles and drop target styling direction.
- Schema updates (0.5 day)
  - Add `sortIndex` and `updatedAt` fields to `bookmarks` and `links`.
  - Add indexes for ordering (`by_user_sort`, `by_category_sort`).
  - Backfill `sortIndex` for existing records.
- Backend mutations (1.0 day)
  - `bookmarks.reorder` with full ownership checks.
  - `links.move` with optional `targetIndex`.
  - `links.reorder` for per-category sorting.
  - Add unit tests for reorder and move.
- DnD foundation (1.0 day)
  - Add `DndContext` at category list level.
  - Implement sensors (pointer + keyboard).
  - Implement `DragOverlay` for links and categories.
  - Add `DroppableCategory` wrapper to accept link drops.
- Category sorting UI (1.0 day)
  - Make category headers sortable.
  - Add drag handles and placeholder.
  - Wire optimistic reorder + mutation.
  - Add toast confirmation and revert on error.
- Link move UI (1.5 days)
  - Make links draggable with handle.
  - Highlight category drop targets.
  - Compute target category and optional target index.
  - Apply optimistic update and confirm toast.
- Visual polish and motion (0.5 day)
  - Add hover glow, drop indicator, and drag shadow.
  - Add reduced motion support (`prefers-reduced-motion`).
- QA and tests (1.0 day)
  - Component tests for drag start, over, drop.
  - Manual QA across desktop and touch devices.
  - Regression checks for offline behavior.

## UI spec: visuals

- Layout guidance
  - Category header has a left drag handle and a right action menu.
  - Link items show a compact favicon + text with a drag handle on hover.
  - Drop targets extend across full category width for easy hit area.
- Drag overlay style
  - Rounded 12px, soft shadow, slight scale (1.02).
  - Background is a subtle gradient from white to slate-50.
  - Favicon or link preview on the left, URL or title on the right.
- Drop target style
  - Category container gets a thin outline and faint glow.
  - If dragging a link, show a thin insertion line at drop position.
  - If dragging a category, show a full-width placeholder card.
- Motion and feedback
  - Hover highlight on category during link drag.
  - Reorder animation uses 150ms ease-out.
  - Error state reverts with a short shake (optional).

## UI spec: component structure

- `BookmarkCategories`
  - Wrap with `DndContext` and `SortableContext` for categories.
  - Maintain `activeDrag` state (`type`, `id`, `fromCategoryId`).
  - Render `DragOverlay` for active category or link.
- `CategoryItem`
  - Implements `useSortable` for category drag.
  - Contains `CategoryDropZone` for link drop.
  - Provides a drag handle in the header.
- `LinksList`
  - Wraps links in `SortableContext` if link sorting is enabled.
  - Each `LinkItem` uses `useDraggable` or `useSortable`.
- `CategoryDropZone`
  - Uses `useDroppable` with category ID.
  - Renders highlight and insertion line when dragging a link.
- `DragOverlay`
  - Renders `CategoryGhost` or `LinkGhost` preview.
  - Uses the same spacing and typography as real cards.

## UI spec: event handling details

- `onDragStart`
  - Set `activeDrag` to `{type, id, fromCategoryId}`.
  - Freeze scroll if needed to reduce jitter.
- `onDragOver`
  - If dragging a link, update hover category and tentative index.
  - Show insertion indicator based on cursor position.
- `onDragEnd`
  - If drop is valid, apply optimistic update and call mutation.
  - If drop is invalid, reset local state.
  - Clear `activeDrag` and remove indicators.

## UI spec: accessibility

- Support keyboard dragging using `KeyboardSensor`.
- Provide `aria-grabbed`, `aria-dropeffect`, and visible focus rings.
- Ensure drag handles are reachable and labeled.
