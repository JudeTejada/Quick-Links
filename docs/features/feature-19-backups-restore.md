# Feature 19: Backups and restore

## Summary

Provide export snapshots and a guided restore flow.

## Goals

- Allow users to download a backup file.
- Allow users to restore from a backup with preview.

## Non-goals

- Automatic scheduled backups to third-party storage.

## User stories

- I can back up my data before major changes.
- I can restore my data after a mistake.

## UX flows

- Settings -> Backups section.
- "Create backup" generates file and downloads.
- "Restore backup" uploads file, previews changes, confirms.

## Data model changes (Convex)

- Optional `backupRuns` table to track created backups.

## Backend changes

- Add `exports.getBackup` query to return full dataset.
- Add `imports.restoreBackup` mutation with validation.
- Add validation logic to reject invalid or foreign data.

## Frontend changes

- Add backup UI in settings.
- Add preview table of categories and links to be restored.
- Add warning dialog for destructive restore.

## Validation and error handling

- Validate schema version and required fields.
- Support partial restore or merge mode.

## Security and privacy

- Only allow restore for current user.
- Never upload backups to external services.

## Performance

- Use chunked restore for large backups.
- Show progress indicator.

## Testing plan

- Unit tests for backup schema validation.
- Integration tests for restore flow.

## Rollout and migration

- Add backup file versioning for future schema changes.

## Open questions

- Should restore replace existing data or merge by default?
