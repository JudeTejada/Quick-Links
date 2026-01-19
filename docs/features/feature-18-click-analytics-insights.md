# Feature 18: Click analytics and insights

## Summary

Track link clicks and show simple analytics dashboards.

## Goals

- Record link clicks per user.
- Show top links and trends.
- Allow filtering by date and category.

## Non-goals

- Cross-user analytics or public tracking.

## User stories

- I can see which links I use the most.
- I can filter analytics to a specific category.

## UX flows

- Analytics route with chart cards.
- Filters for date range and category.
- List of top links with counts.

## Data model changes (Convex)

- Add `linkClicks` table:
  - `linkId`, `userId`, `categoryId`, `createdAt`, `referrer`.
  - Index `by_user_date`, `by_link_date`.

## Backend changes

- Add `links.recordClick` mutation.
- Add `analytics.topLinks` and `analytics.trends` queries.
- Optionally aggregate daily counts into a rollup table.

## Frontend changes

- Update link click handler in `LinksList` to call recordClick.
- Add `src/routes/analytics.tsx` with charts and tables.

## Validation and error handling

- Debounce click recording to avoid duplicates.
- Allow users to opt out of analytics.

## Security and privacy

- Store only minimal analytics data.
- Ensure click data is scoped to userId.

## Performance

- Use rollup aggregation for large datasets.
- Avoid blocking navigation on click recording.

## Testing plan

- Unit tests for analytics queries.
- UI tests for charts and filters.

## Rollout and migration

- Start recording new clicks; old links will have no history.

## Open questions

- What charting library should be used?
