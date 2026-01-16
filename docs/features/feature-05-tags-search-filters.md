# Feature 05: Tags, search, and filters

## Summary

Add tags to links, a global search bar, and filtering by tag, category, and date.

## Goals

- Tag links with reusable labels.
- Search links by title, URL, and tags.
- Filter results by category, tag, and date.

## Non-goals

- Full text search across page content.
- Tag sharing across users.

## User stories

- I can add tags like "work" or "research".
- I can search all links and filter results.
- I can quickly find recently added links.

## UX flows

- Global search input in the home header.
- Tag chips on each link with add or remove controls.
- Filter panel with tag list and date range.

## Data model changes (Convex)

- Add `tags` table:
  - `name` (string)
  - `userId` (id users)
  - `createdAt` (number)
  - Index `by_user_name`.
- Add `linkTags` table (join):
  - `linkId`, `tagId`, `userId`, `createdAt`
  - Index `by_link`, `by_tag`, `by_user_tag`.
- Optionally add `links.searchText` for denormalized search.

## Backend changes

- `tags.create`, `tags.listByUser`, `tags.remove`.
- `links.addTag`, `links.removeTag`.
- `links.search` query:
  - Accept `query`, `tagIds`, `categoryId`, `dateRange`.
  - Return matched links with tags.

## Frontend changes

- Add tag input component under `src/components/ui`.
- Update `LinksList` to show tag chips and add or remove flows.
- Add search bar to `src/routes/index.tsx`.
- Add filter drawer or sidebar for tags and date range.

## Validation and error handling

- Normalize tag names (trim, lower case).
- Enforce max tags per link.
- Show empty state when no results.

## Security and privacy

- Ensure tag and link access is scoped to userId.

## Performance

- Use paginated results for search.
- Debounce search input.

## Testing plan

- Unit tests for tag normalization and linkTag queries.
- Component tests for search results and filters.

## Rollout and migration

- No migration needed; new tags are optional.

## Open questions

- Should tags be global per user or per category?
