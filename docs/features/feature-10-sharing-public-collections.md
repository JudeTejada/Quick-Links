# Feature 10: Sharing and public collections

## Summary

Allow users to share a category as a public, read-only collection via a slug.

## Goals

- Generate share links for a category.
- Provide a public read-only view.
- Allow revoking access.

## Non-goals

- Collaborative editing (handled by workspaces).

## User stories

- I can share a curated list publicly.
- I can revoke a share link at any time.

## UX flows

- Category menu -> "Share".
- Share dialog shows link, copy button, and revoke option.
- Public route shows category title and links only.

## Data model changes (Convex)

- Extend `bookmarks` table:
  - `isPublic` (boolean)
  - `shareSlug` (string)
  - `shareTitle` (string, optional)
  - `sharedAt` (number, optional)
- Index `by_share_slug`.

## Backend changes

- Add `bookmarks.createShare` mutation (generate slug).
- Add `bookmarks.revokeShare` mutation.
- Add `bookmarks.getPublicBySlug` query with read-only access.

## Frontend changes

- Add share dialog in `CategoryPreferences`.
- Add public route `src/routes/share/$slug.tsx`.
- Ensure public page is minimal and read-only.

## Validation and error handling

- Ensure slug uniqueness per category.
- Return 404 for revoked or unknown slug.

## Security and privacy

- Public route should expose only public data.
- Avoid leaking userId or private fields.

## Performance

- Cache public responses where possible.

## Testing plan

- Unit tests for share slug generation.
- Integration tests for public access.

## Rollout and migration

- Add UI only after backend functions are deployed.

## Open questions

- Should shared links include optional password protection?
