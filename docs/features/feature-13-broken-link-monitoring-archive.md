# Feature 13: Broken link monitoring and archive

## Summary

Detect broken links and allow archiving them.

## Goals

- Periodically check link status.
- Show broken status and allow archive.
- Provide archived view and restore.

## Non-goals

- Full site monitoring or uptime tracking.

## User stories

- I can find links that no longer work.
- I can archive or delete broken links.

## UX flows

- Broken badge on link.
- Filter "Broken" and "Archived".
- Archive and restore actions in link menu.

## Data model changes (Convex)

- Update `links` table:
  - `lastCheckedAt` (number)
  - `lastStatusCode` (number, optional)
  - `isBroken` (boolean)
  - `archivedAt` (number, optional)
- Index `by_user_broken` and `by_user_archived`.

## Backend changes

- Add scheduled job (Convex cron) to check URLs.
- Add `links.markBroken` mutation.
- Add `links.archive` and `links.restore` mutations.
- Update list queries to optionally exclude archived links.

## Frontend changes

- Add broken badge styling in `LinksList`.
- Add archive controls and archive filter view.

## Validation and error handling

- Handle network errors during status checks.
- Do not mark temporary failures as broken without retries.

## Security and privacy

- Fetch URLs server-side only, restrict protocols.

## Performance

- Rate limit checks and batch requests.
- Schedule checks in small batches.

## Testing plan

- Unit tests for status handling and archive.
- Integration tests for scheduled job output.

## Rollout and migration

- Initialize `isBroken` false and `archivedAt` null.

## Open questions

- How often should checks run and should users control it?
