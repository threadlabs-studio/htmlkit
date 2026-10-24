import { defineConfig } from '@threadlabs/htmlkit';
import { markupress } from 'markupress';

export default defineConfig({
  base: '/htmlkit/',
  origin: 'https://threadlabs-studio.github.io',
  outDir: 'site',
  robots: true,
  css: ['app/site.css'],
  plugins: [markupress({
    title: 'HTMLKit',
    contentDir: 'docs',
    editLink: 'https://github.com/threadlabs-studio/htmlkit/edit/main/website/',
    nav: [
      { label: 'Markupress', href: 'https://threadlabs-studio.github.io/markupress/' },
      { label: 'GitHub', href: 'https://github.com/threadlabs-studio/htmlkit' },
    ],
  })],
});
