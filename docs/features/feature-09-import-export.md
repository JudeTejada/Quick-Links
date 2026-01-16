# Feature 09: Import and export

## Summary

Allow users to import bookmarks from HTML or CSV and export their data.

## Goals

- Support common bookmark HTML format.
- Provide CSV export and import.
- Give users a preview before import.

## Non-goals

- Sync with external services in real time.

## User stories

- I can import my browser bookmarks.
- I can export my data for backup.

## UX flows

- Settings -> Import/Export section.
- Upload file -> parse -> preview categories and links.
- Confirm import -> progress indicator.
- Export button -> download HTML or CSV.

## Data model changes (Convex)

- None required, but may add `importBatchId` fields for tracking.

## Backend changes

- Add `bookmarks.bulkCreate` mutation for categories.
- Add `links.bulkCreate` mutation for links.
- Add `exports.getAllByUser` query to fetch full dataset.

## Frontend changes

- Add parser utilities in `src/lib/importers`.
- Add preview UI in `src/routes/settings.tsx` or a new route.
- Add progress and error reporting UI.

## Validation and error handling

- Deduplicate categories by name if requested.
- Validate URLs and skip invalid entries.
- Provide a summary of skipped items.

## Security and privacy

- Do not upload files to third-party services.
- Ensure imports are scoped to the user.

## Performance

- Chunk large imports to avoid mutation size limits.
- Show progress based on chunk count.

## Testing plan

- Unit tests for HTML and CSV parsers.
- Integration tests for bulk insert mutations.

## Rollout and migration

- No migration; feature is additive.

## Open questions

- Should imports merge with existing categories or create new ones?
