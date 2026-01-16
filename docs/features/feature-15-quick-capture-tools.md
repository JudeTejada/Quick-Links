# Feature 15: Quick capture tools (bookmarklet and extension)

## Summary

Provide a bookmarklet and optional extension for one-click capture.

## Goals

- Capture current tab URL into Quick Links.
- Prompt for category and tags.
- Work with existing auth session.

## Non-goals

- Full extension UI for browsing and editing.

## User stories

- I can click a bookmarklet to save the current page.
- I can pick a category before saving.

## UX flows

- Bookmarklet opens `/capture?url=...`.
- Capture page shows minimal form (category, tags).
- Save triggers `links.create` and closes tab.

## Data model changes (Convex)

- None required.

## Backend changes

- Add `links.capture` mutation to accept URL and optional category or tags.
- Validate ownership and inputs.

## Frontend changes

- Add `src/routes/capture.tsx` to parse query params.
- Add minimal UI using `QuickLinksInput` and category selector.
- Provide docs and snippet for bookmarklet in `README.md`.

## Validation and error handling

- Validate URL and show inline errors.
- Handle case when user is not authenticated.

## Security and privacy

- Require active session to create links.
- Prevent CSRF by requiring a same-origin request.

## Performance

- Keep capture route lightweight.

## Testing plan

- Unit tests for capture mutation.
- UI tests for capture flow.

## Rollout and migration

- Add a link to bookmarklet in settings.

## Open questions

- Should capture support selecting the active category automatically?
