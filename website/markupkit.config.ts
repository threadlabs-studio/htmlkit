import { defineConfig } from '@threadlabs/markupkit';
import { markupress } from 'markupress';

export default defineConfig({
  base: '/markupkit/',
  origin: 'https://threadlabs-studio.github.io',
  outDir: 'site',
  robots: true,
  css: ['app/site.css'],
  plugins: [markupress({
    title: 'MarkupKit',
    contentDir: 'docs',
    editLink: 'https://github.com/threadlabs-studio/markupkit/edit/main/website/',
    nav: [
      { label: 'Markupress', href: 'https://threadlabs-studio.github.io/markupress/' },
      { label: 'GitHub', href: 'https://github.com/threadlabs-studio/markupkit' },
    ],
  })],
});
