# Feature 14: Offline mode and PWA

## Summary

Add offline support with a PWA service worker and local cache.

## Goals

- App loads when offline.
- Users can view cached categories and links.
- Queue changes for sync when back online.

## Non-goals

- Full offline multi-device conflict resolution.

## User stories

- I can open the app on a plane and still see my links.
- Changes I make offline sync when I reconnect.

## UX flows

- Offline banner using `useOnlineStatus`.
- Sync indicator while pending changes are uploaded.
- Conflict warning if a record changed on server.

## Data model changes (Convex)

- None required, but consider adding `updatedAt` on links and categories.

## Backend changes

- Add `updatedAt` fields to support conflict detection.
- Provide `links.sync` mutation to accept offline changes.

## Frontend changes

- Add service worker (Vite PWA plugin).
- Cache static assets and route shells.
- Store data in IndexedDB for offline access.
- Add offline queue for mutations.

## Validation and error handling

- Validate queued changes before replaying.
- Resolve conflicts with last-write-wins or user prompt.

## Security and privacy

- Do not cache sensitive auth tokens in service worker.
- Encrypt local cache if needed.

## Performance

- Limit cache size and purge old entries.

## Testing plan

- Simulate offline in tests and verify cache usage.
- Unit tests for sync queue logic.

## Rollout and migration

- Add a feature flag to enable offline mode.

## Open questions

- What should happen when offline edits conflict with server edits?
