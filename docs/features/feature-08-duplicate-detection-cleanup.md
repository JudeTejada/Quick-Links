# Feature 08: Duplicate detection and cleanup

## Summary

Detect duplicate links per user and provide cleanup tools.

## Goals

- Identify duplicates by normalized URL.
- Provide UI to merge or delete duplicates.

## Non-goals

- Cross-user duplicate detection.

## User stories

- I can view duplicates and clean them up quickly.
- I can keep one copy and remove the rest.

## UX flows

- "Duplicates" panel in settings or category menu.
- List of groups showing primary link and duplicates.
- Actions: keep one, delete others, move duplicates.

## Data model changes (Convex)

- Add `links.normalizedUrl` (string).
- Add index `by_user_normalized` on `userId`, `normalizedUrl`.

## Backend changes

- Update `links.create` to compute `normalizedUrl`.
- Add `links.findDuplicates` query returning grouped duplicates.
- Add `links.removeDuplicates` mutation (keeps one per group).

## Frontend changes

- Add duplicates view route (e.g. `src/routes/duplicates.tsx`).
- Add UI to select primary link and remove others.

## Validation and error handling

- Normalize URL consistently (lowercase host, remove tracking params).
- Show warning when deleting multiple items.

## Security and privacy

- Ensure duplicates queries are scoped to userId.

## Performance

- Use indexed queries by `normalizedUrl`.
- Paginate duplicates list for large accounts.

## Testing plan

- Unit tests for URL normalization.
- Integration tests for duplicate grouping.

## Rollout and migration

- Backfill `normalizedUrl` for existing links.

## Open questions

- Should normalization strip query params or keep whitelisted ones?
