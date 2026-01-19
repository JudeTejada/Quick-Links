import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router';
import { ConvexAuthProvider } from '@convex-dev/auth/react';

import appCss from '../styles.css?url';
import { Page404 } from '../components/views/Page404';
import { convex } from '../lib/convex';
import { ToastProvider } from '../components/ui/toast';

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Quick Links',
      },
      {
        name: 'robots',
        content: 'follow, index',
      },
      {
        name: 'description',
        content: 'Manage and save your bookmarks. built with TanStack Start',
      },
      {
        property: 'og:type',
        content: 'Website',
      },
      {
        property: 'og:site_name',
        content: 'Jude Tejada',
      },
      {
        property: 'og:description',
        content: 'Manage and save your bookmarks. built with TanStack Start',
      },
      {
        property: 'og:title',
        content: 'Quick Links',
      },
      {
        property: 'og:image',
        content: '/assets/banner.png',
      },
      {
        property: 'og:url',
        content: 'https://quick-links-solid.vercel.app',
      },
      {
        name: 'twitter:card',
        content: 'summary_large_image',
      },
      {
        name: 'twitter:site',
        content: '@JudeTejada2',
      },
      {
        name: 'twitter:title',
        content: 'Quick Links',
      },
      {
        name: 'twitter:description',
        content: 'Manage and save your bookmarks. built with TanStack Start',
      },
      {
        name: 'twitter:image',
        content: '/assets/banner.png',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
      {
        rel: 'shortcut icon',
        type: 'image/ico',
        href: '/assets/logo/favicon.ico',
      },
      {
        rel: 'apple-touch-icon',
        sizes: '180x180',
        href: '/assets/logo/apple-touch-icon.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        href: '/assets/logo/favicon-32x32.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        href: '/assets/logo/favicon-16x16.png',
      },
      {
        rel: 'manifest',
        href: '/assets/logo/site.webmanifest',
      },
    ],
  }),

  shellComponent: RootDocument,
  notFoundComponent: Page404,
});

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="relative">
        <ConvexAuthProvider client={convex}>
          <ToastProvider position="bottom-right">
            <div className="isolate relative flex min-h-svh flex-col">{children}</div>
          </ToastProvider>
        </ConvexAuthProvider>
        <Scripts />
      </body>
    </html>
  );
}
