# Feature 06: Bulk actions

## Summary

Support multi-select and batch operations like delete, move, and tag.

## Goals

- Efficiently manage many links at once.
- Provide clear selection UI and undo support.

## Non-goals

- Bulk editing of link metadata beyond tags and category.

## User stories

- I can select multiple links and delete them.
- I can move a group of links to another category.
- I can apply a tag to many links at once.

## UX flows

- "Select" mode toggle in category header.
- Checkbox on each link when in select mode.
- Bulk action toolbar (Delete, Move, Tag).
- Confirmation dialog for destructive actions.

## Data model changes (Convex)

- None required, but ensure existing indexes support bulk queries.

## Backend changes

- Add `links.bulkDelete` mutation.
- Add `links.bulkMove` mutation.
- Add `links.bulkTag` mutation.
- Each mutation validates ownership for every link ID.

## Frontend changes

- Add selection state in `src/components/ui/LinksList.tsx`.
- Add bulk action toolbar component.
- Add dialog for move and tag selection.
- Update `CategoryPreferences` to enter and exit select mode.

## Validation and error handling

- If some links fail to update, return partial results and show toast.
- Disable actions when no selection.

## Security and privacy

- Enforce userId check in all bulk mutations.

## Performance

- Use batched mutations with server-side loops.
- Add loading indicator for large selections.

## Testing plan

- Unit tests for bulk mutation ownership checks.
- UI tests for selection and bulk actions.

## Rollout and migration

- No data migration required.

## Open questions

- Should bulk actions include "open all" or "copy URLs"?
