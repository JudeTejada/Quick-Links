# Feature 16: Mobile share sheet integration

## Summary

Enable PWA share target so users can share URLs from mobile apps.

## Goals

- Accept shared URLs via Web Share Target.
- Provide quick save flow on mobile.

## Non-goals

- Native app development.

## User stories

- I can share a link from my browser to Quick Links.
- I can choose a category and save quickly.

## UX flows

- Share target opens a minimal save page.
- Page pre-fills the shared URL and suggests a category.
- Confirmation message and option to close.

## Data model changes (Convex)

- None required.

## Backend changes

- Use existing `links.create` mutation.
- Ensure auth is required; prompt login if needed.

## Frontend changes

- Update `public/manifest.webmanifest` with share target config.
- Add route `src/routes/share-target.tsx` to handle POST or GET.
- Reuse `QuickLinksInput` and category selector.

## Validation and error handling

- Handle missing or invalid shared data.
- Show clear error if user is not logged in.

## Security and privacy

- Accept share requests only from same origin.
- Do not log shared URLs in analytics without consent.

## Performance

- Keep share target UI lightweight and mobile friendly.

## Testing plan

- Manual tests on mobile browsers with share target support.
- Unit tests for parsing shared payload.

## Rollout and migration

- Ensure manifest and service worker are deployed first.

## Open questions

- Which mobile browsers should be officially supported?
