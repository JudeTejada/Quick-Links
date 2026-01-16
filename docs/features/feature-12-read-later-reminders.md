# Feature 12: Read later and reminders

## Summary

Allow users to mark links as read later and schedule reminders.

## Goals

- Add read later toggle.
- Allow setting a reminder date.
- Provide a reminders view.

## Non-goals

- Email or push notifications beyond basic in-app.

## User stories

- I can flag a link to read later.
- I can set a reminder and see it in a list.

## UX flows

- Link menu includes "Read later" and "Set reminder".
- Reminders route lists upcoming reminders.
- Dismiss reminder clears it.

## Data model changes (Convex)

- Update `links` table:
  - `readLater` (boolean)
  - `reminderAt` (number, optional)
  - `reminderStatus` (string, pending, sent, dismissed)
  - `lastRemindedAt` (number, optional)
- Index `by_user_reminder` on `userId`, `reminderAt`.

## Backend changes

- Add `links.setReadLater` mutation.
- Add `links.setReminder` mutation.
- Add `links.listReminders` query.
- Optional scheduled function to mark reminders as due.

## Frontend changes

- Add read later toggle in `LinksList`.
- Add date and time picker for reminders.
- Add `src/routes/reminders.tsx` with list and filters.

## Validation and error handling

- Validate reminder date in the future.
- Handle timezone based on user settings.

## Security and privacy

- Reminders are scoped to userId only.

## Performance

- Use index on reminderAt for due queries.

## Testing plan

- Unit tests for reminder creation and dismissal.
- UI tests for reminder picker and list.

## Rollout and migration

- Default `readLater` to false for existing links.

## Open questions

- Should reminders support repeating schedules?
