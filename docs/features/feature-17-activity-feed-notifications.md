# Feature 17: Activity feed and notifications

## Summary

Track user actions and show a lightweight activity feed and notifications.

## Goals

- Log key actions (create, update, delete).
- Provide an activity feed view.
- Show unread notifications in UI.

## Non-goals

- Real-time collaboration notifications (covered by workspaces).

## User stories

- I can see my recent activity.
- I can mark notifications as read.

## UX flows

- Activity feed route or drawer.
- Notification bell with unread count.
- "Mark all as read" action.

## Data model changes (Convex)

- Add `activity` table:
  - `userId`, `type`, `entityId`, `entityType`, `createdAt`.
  - Index `by_user_createdAt`.
- Add `notifications` table:
  - `userId`, `activityId`, `readAt`, `createdAt`.

## Backend changes

- Update existing mutations to insert activity rows.
- Add `notifications.listByUser` query.
- Add `notifications.markRead` mutation.

## Frontend changes

- Add notification bell in header.
- Add activity feed component and route.
- Add UI to mark items as read.

## Validation and error handling

- Ensure activities are only created for valid actions.

## Security and privacy

- Users can only access their own activity and notifications.

## Performance

- Paginate activity feed.

## Testing plan

- Unit tests for activity creation and notification read state.
- UI tests for unread count updates.

## Rollout and migration

- Start logging new activities after deployment.

## Open questions

- Which actions should generate notifications vs. only activity?
