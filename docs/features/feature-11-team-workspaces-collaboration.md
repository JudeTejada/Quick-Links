# Feature 11: Team workspaces and collaboration

## Summary

Introduce workspaces with roles so teams can share categories and links.

## Goals

- Create multiple workspaces per user.
- Support roles: owner, editor, viewer.
- Scope categories and links to a workspace.

## Non-goals

- Real-time conflict resolution beyond last write wins.

## User stories

- I can create a workspace and invite others.
- Editors can add and edit links.
- Viewers can only read.

## UX flows

- Workspace switcher in header.
- Invite modal with email and role.
- Workspace settings for managing members.

## Data model changes (Convex)

- Add `workspaces` table:
  - `name`, `ownerId`, `createdAt`.
- Add `workspaceMembers` table:
  - `workspaceId`, `userId`, `role`, `createdAt`.
  - Index `by_workspace_user`.
- Add `invites` table:
  - `workspaceId`, `email`, `role`, `token`, `expiresAt`.
- Update `bookmarks` and `links` to include `workspaceId`.

## Backend changes

- Add `workspaces.create`, `workspaces.listByUser`.
- Add `workspaces.invite`, `workspaces.acceptInvite`.
- Update all bookmark and link mutations to enforce role checks.
- Update `bookmarks.listByUser` to accept `workspaceId`.

## Frontend changes

- Add workspace selector component.
- Add invite flow in a new `src/routes/workspace.tsx`.
- Update queries to pass `workspaceId`.

## Validation and error handling

- Prevent duplicate invites.
- Handle users without access gracefully.

## Security and privacy

- Strict role checks in all mutations and queries.
- Avoid leaking workspace data to non-members.

## Performance

- Cache workspace list in context.

## Testing plan

- Unit tests for role checks.
- Integration tests for invites and membership.

## Rollout and migration

- Add a default workspace for existing users.
- Migrate existing data to the default workspace.

## Open questions

- Should ownership transfer be supported?
