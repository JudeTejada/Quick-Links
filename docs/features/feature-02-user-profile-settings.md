# Feature 02: User profile and settings

## Summary

Add a user profile and settings page so users can personalize their account, default view, and appearance.

## Goals

- Allow users to edit display name and avatar.
- Allow users to configure default sort/view.
- Provide a dedicated settings route.

## Non-goals

- Team settings (covered in workspace feature).
- Advanced billing preferences.

## User stories

- Update display name and avatar.
- Change default view mode (grid or compact) and default sort.
- Set timezone to improve reminders.

## UX flows

- Settings route at `/settings`.
- Sections: Profile, Preferences, Danger Zone.
- Save button with inline validation and success toast.
- Show current email as read-only.

## Data model changes (Convex)

- Extend `users` table in `convex/schema.ts`:
  - `displayName` (string, optional)
  - `avatarUrl` (string, optional)
  - `timezone` (string)
  - `defaultSort` (string)
  - `defaultView` (string)
  - `updatedAt` (number)

## Backend changes

- Add `users.getProfile` query.
- Add `users.updateProfile` mutation (displayName, avatarUrl, timezone).
- Add `users.updatePreferences` mutation (defaultSort, defaultView).
- Validate inputs and enforce userId match.

## Frontend changes

- New route `src/routes/settings.tsx`.
- Add `SettingsForm` component under `src/components/views`.
- Extend `AuthProvider` or add `useProfile` hook to load profile.
- Update header area on `src/routes/index.tsx` to show displayName and avatar.

## Validation and error handling

- Limit display name length.
- Validate avatar URL format.
- Provide fallback avatar when image fails.

## Security and privacy

- Only allow self-updates.
- Avoid storing sensitive data in profile.

## Performance

- Cache profile in memory context.
- Use optimistic updates for settings.

## Testing plan

- Unit tests for `users.updateProfile`.
- Component tests for settings form.
- Test avatar fallback and validation errors.

## Rollout and migration

- Add default values for existing users.
- Gradually roll out settings route link in UI.

## Open questions

- Should avatar upload be hosted internally or rely on external URLs?
