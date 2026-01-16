# Feature 01: Real authentication (magic link or OAuth)

## Summary

Replace the localStorage-only session with real authentication. Support magic link and/or OAuth provider, keep sessions secure, and let the UI rely on a real server-backed session.

## Goals

- Provide secure login and logout with persisted sessions.
- Support at least one provider (magic link or OAuth) with room for more.
- Avoid breaking the existing app flows.
- Keep user records in Convex as the source of truth.

## Non-goals

- Multi-factor auth.
- Admin user management UI.
- Complex account recovery flows beyond provider support.

## User stories

- As a user, I can sign in with email magic link or a provider.
- As a user, I stay signed in across reloads until I sign out.
- As a user, I see error states if authentication fails or expires.
- As a user, I can log out and my session is invalidated.

## UX flows

- Login route (`/login`)
  - Email input with "Send magic link".
  - Provider buttons (Google, GitHub) with redirect.
  - Loading state while redirecting or sending link.
  - Error banner when provider rejects or network fails.
- Magic link flow
  - User enters email -> request sent.
  - User clicks link -> `/auth/callback` route reads token, completes sign-in.
- OAuth flow
  - Login route triggers provider redirect.
  - Provider redirects to `/auth/callback` with code/state.
  - Callback exchanges code for session and navigates to `/`.
- Logout
  - Sign out button invalidates session, clears local cache, redirects to `/login`.

## Data model changes (Convex)

- Update `users` table in `convex/schema.ts`:
  - `authProvider` (string)
  - `providerUserId` (string)
  - `emailVerifiedAt` (number, optional)
  - `lastLoginAt` (number)
  - `avatarUrl` (string, optional)
- Add `sessions` table:
  - `userId` (id users)
  - `tokenHash` (string)
  - `expiresAt` (number)
  - `createdAt` (number)
  - `ip` (string, optional)
  - `userAgent` (string, optional)
  - Index on `tokenHash` and `userId`.
- Optional `authTokens` table for magic links:
  - `email`, `tokenHash`, `expiresAt`, `createdAt`, `usedAt`.

## Backend changes (Convex functions)

- Create `convex/auth.ts`:
  - `createMagicLinkToken` mutation.
  - `verifyMagicLinkToken` mutation.
  - `createSession` mutation.
  - `revokeSession` mutation.
  - `getSession` query (by token hash).
- Create a Convex `action` for OAuth exchange if needed:
  - `exchangeOAuthCode` action.
  - Use provider client secrets from env vars.
- Update `convex/users.ts`:
  - `upsertByProvider` mutation to link provider user ID to Convex user.
  - `getCurrentUser` query to return user + profile.
- Ensure all auth mutations validate email and provider inputs.

## Frontend changes (routes/components)

- Replace localStorage auth in `src/components/auth/AuthProvider.tsx`:
  - Read session token from cookie (httpOnly) or secure storage.
  - Call `getSession` and `getCurrentUser` on load.
  - Expose `signInWithEmail`, `signInWithProvider`, `signOut`.
- Update `src/components/auth/SignIn.tsx`:
  - Email form + provider buttons.
  - Success message for magic link sent.
  - Error and loading UI.
- Add route `src/routes/auth.callback.tsx`:
  - Parse query params, call verify or exchange, then redirect.
- Update route guards:
  - Replace in-component checks with a shared helper in `src/lib/auth.ts`.
  - Use `beforeLoad` in TanStack Router where possible.

## Validation and error handling

- Validate email format client-side and server-side.
- Prevent token reuse and enforce token expiration.
- Display user-friendly errors for invalid or expired tokens.
- Gracefully handle offline state and retry.

## Security and privacy

- Store session token in httpOnly cookie to avoid XSS.
- Use CSRF protection if cookies are used.
- Validate OAuth state parameter.
- Limit session duration and allow manual revoke.
- Log minimal auth metadata to avoid privacy leaks.

## Performance and reliability

- Cache `getCurrentUser` result in memory for the session.
- Avoid repeated session validation by memoizing in `AuthProvider`.
- Add rate limits for magic link requests.

## Testing plan

- Unit tests for token hashing and session creation.
- Integration tests for magic link verify and session revocation.
- UI tests for login, callback, and logout flows.

## Rollout and migration

- Add env vars for provider keys in `.env.local` and document in `README.md`.
- Deploy backend changes before UI switch.
- Add a migration step to sign out existing localStorage sessions.

## Open questions

- Which provider(s) should be supported first?
- Do we need email verification for all providers?
- What session duration is acceptable?
