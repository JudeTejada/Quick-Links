import { MetaProvider, Title } from '@solidjs/meta';

import seoImage from '../../assets/banner.png';

export function Seo() {
  const meta = {
    title: 'Quick Links',
    description: 'Manage and save  your  bookmarks. built with Solid',
    image: seoImage,
    type: 'Website'
  };

  return (
    <MetaProvider>
      <Title>{meta.title}</Title>
      <meta charset='utf-8' />
      <meta name='robots' content='follow, index' />
      <meta
        name='description'
        content='Manage and save  your  bookmarks. built with Solid'
      />

      {/*  OPEN GRAPH / facebook*/}
      <meta property='og:type' content={meta.type} />
      <meta property='og:site_name' content='Jude Tejada' />
      <meta property='og:description' content={meta.description} />
      <meta property='og:title' content={meta.title} />
      <meta property='og:image' content={meta.image} />

      {/*  twitter*/}
      <meta name='twitter:card' content='summary_large_image' />
      <meta name='twitter:site' content='@JudeTejada2' />
      <meta name='twitter:title' content={meta.title} />
      <meta name='twitter:description' content={meta.description} />
      <meta name='twitter:image' content={meta.image} />

      <link
        rel='shortcut icon'
        type='image/ico'
        href='/src/assets/logo/favicon.ico'
      />
      <link
        rel='apple-touch-icon'
        sizes='180x180'
        href='/src/assets/logo//apple-touch-icon.png'
      />
      <link
        rel='icon'
        type='image/png'
        sizes='32x32'
        href='/src/assets/logo/favicon-32x32.png'
      />
      <link
        rel='icon'
        type='image/png'
        sizes='16x16'
        href='/src/assets/logo/favicon-16x16.png'
      />
      <link rel='manifest' href='/src/assets/logo/site.webmanifest' />
      <title>Quick Links</title>
    </Metap>
  );
}
