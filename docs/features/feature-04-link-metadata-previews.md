# Feature 04: Link metadata and rich previews

## Summary

Fetch and store OpenGraph metadata for links and display richer previews.

## Goals

- Display title, description, image, and site name for links.
- Cache metadata in Convex to avoid repeated fetching.
- Allow manual refresh of metadata.

## Non-goals

- Full content extraction or readability view.
- Client-side scraping (server only).

## User stories

- I see a readable title instead of a raw URL.
- I can refresh metadata if a site changes.
- If metadata fails, the link still works.

## UX flows

- Link card shows favicon, title, and optional description.
- Hover or menu option "Refresh metadata".
- Placeholder skeleton while metadata is loading.

## Data model changes (Convex)

- Update `links` table:
  - `title` (string, optional)
  - `description` (string, optional)
  - `imageUrl` (string, optional)
  - `siteName` (string, optional)
  - `faviconUrl` (string, optional)
  - `metadataStatus` (string, e.g. pending, ok, failed)
  - `metadataFetchedAt` (number, optional)
- Add index for `metadataStatus` if needed.

## Backend changes

- Add `convex/links.ts` mutation `queueMetadataFetch`.
- Add `convex/links.ts` mutation `refreshMetadata`.
- Add `convex/links.ts` action `fetchMetadata`:
  - Fetch URL, parse HTML, extract OG tags and favicon.
  - Normalize image and favicon URLs.
  - Update link with parsed fields.
- Update `links.create` to enqueue metadata fetch after insert.

## Frontend changes

- Add preview card UI in `src/components/ui/preview-card.tsx` or reuse existing.
- Update `src/components/ui/LinksList.tsx` to show metadata when available.
- Add refresh button in link menu.

## Validation and error handling

- Validate URL before fetching.
- Mark fetch as failed after timeouts or blocked domains.
- Do not block link creation if metadata fails.

## Security and privacy

- Fetch metadata server-side only.
- Enforce allowed protocols (http or https).
- Avoid fetching internal or private IP ranges.

## Performance

- Cache metadata results and avoid frequent refreshes.
- Rate limit fetches per user.

## Testing plan

- Unit tests for metadata parser.
- Integration tests for `fetchMetadata` action with mocked HTTP.
- UI tests for preview fallback.

## Rollout and migration

- Backfill metadata for existing links in batches.

## Open questions

- Should we show images in grid view only?
