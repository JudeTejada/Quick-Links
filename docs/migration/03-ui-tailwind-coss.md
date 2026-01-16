# UI migration to Tailwind + Coss UI (keep the UI unchanged)

## Goal

Rebuild the UI with Tailwind CSS and Coss UI while preserving the current layout, spacing, and behavior shown in the existing Solid app and screenshot.

## Current UI inventory (from repo)

Components from `@hope-ui/solid`:

- Layout: `Container`, `Box`, `Flex`, `HStack`, `Spacer`
- Typography: `Heading`, `Text`, `FormLabel`, `FormHelperText`
- Controls: `Button`, `IconButton`, `Input`
- Overlays: `Popover`, `Menu`, `Modal`
- Feedback: `SkeletonText`, `SkeletonCircle`, `notificationService`
- Lists: `List`, `ListItem`, `UnorderedList`, `Anchor`

Global CSS:

- `src/index.css` provides `bookmark-item` and `list-item` transitions.

Icons:

- `solid-icons/hi`, `solid-icons/bi`

## Layout details to preserve

Home layout (`/`):

- Header row: title + email left, sign-out button right.
- Content: categories list stacked vertically.
- Padding: `p-4` on small screens, `p-20` on md+.
- Max width: `max-w-5xl`.

Login layout (`/login`):

- Centered card with heading, text, and email form.
- Full-height (`min-h-screen`) centered grid.

404 layout:

- Centered, minimal text + back button.

## Tailwind + Coss UI setup steps

1. Install Tailwind and configure `content` to include all `src/**/*.{ts,tsx}`.
2. Follow the Coss UI installation guide for:
   - Tailwind plugin (if required)
   - Base styles import
   - Component class names and variants
3. Add global CSS for existing transitions (copy `src/index.css`).

## Component mapping guide (Hope UI -> Tailwind/Coss UI)

Use this as a reference while porting each component.

Layout:

- `Container` -> `<div className="mx-auto max-w-5xl p-4 md:p-20">`
- `Flex` -> `<div className="flex items-center">`
- `HStack` -> `<div className="flex items-center gap-4">`
- `Spacer` -> `<div className="flex-1" />`

Typography:

- `Heading size="3xl"` -> `text-3xl font-semibold`
- `Heading size="base"` -> `text-base`
- `Text` -> `text-sm` or `text-base` as needed

Buttons:

- `Button` -> Coss button component + Tailwind variants
- `IconButton` -> Coss icon button or custom `button` with `rounded-full`

Inputs:

- `Input` -> Coss input + Tailwind error state styles
- `FormLabel` / `FormHelperText` -> `label` + `text-sm text-red-600`

Popovers and Menus:

- `Popover` / `Menu` -> Coss popover/menu
- Keep placement: `top-start`

Modal:

- `Modal` -> Coss dialog
- Preserve title/body/footer structure

Skeletons:

- `SkeletonText`, `SkeletonCircle` -> Coss skeletons or Tailwind `animate-pulse`

Notifications:

- Replace `notificationService` with Coss toast or a small toast library

Icons:

- Replace `solid-icons` with `react-icons` or `lucide-react` equivalents

## Screen-by-screen migration steps

### 1) Home

1. Build the header row with flex alignment and `justify-between`.
2. Keep email under the title in muted text (`text-gray-500`).
3. Keep the sign-out button aligned right.
4. Render categories list with `gap-4` and `mb-8`.
5. Preserve the list item outline when editing links.

### 2) Category list items

1. Category heading left, menu icon right.
2. Inline edit uses an input + close icon button.
3. Add link button appears only when not editing links.
4. Edit links mode shows delete buttons on each link.
5. Category delete modal: confirm/cancel with consistent spacing.

### 3) Login

1. Center container with `min-h-screen grid place-items-center`.
2. Keep heading size and helper text.
3. Preserve button full width.

### 4) 404

1. Centered text and back button.

## CSS transitions to retain

Copy `src/index.css` into the new app or recreate in Tailwind:

- `.bookmark-item` and `.list-item` fade in/out.
- Keep `transition: all 200ms`.

## Visual parity checklist

- Spacing: `p-4 md:p-20`, `mb-4`, `gap-4` etc.
- Button sizes: `sm` for inline actions, default for primary actions.
- Icon sizes: 16px for delete, 24-25px for close.
- Badge/list icon sizes match existing.
- Offline banner retains warning style.

## Notes on keeping the screenshot look

If the current app is wrapped in a background card (as shown in the screenshot):

- Add a full-screen background container with a soft green gradient.
- Place a white rounded card with shadow around the main content.
  If the screenshot is from a wrapper outside the app, skip this.
