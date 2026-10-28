import { defineConfig } from 'markupress';

export default defineConfig({
  title: 'MarkupKit',
  contentDir: 'docs',
  base: '/markupkit/',
  origin: 'https://threadlabs-studio.github.io',
  outDir: 'site',
  robots: true,
  editLink: 'https://github.com/threadlabs-studio/markupkit/edit/main/website/',
  nav: [
    { label: 'Markupress', href: 'https://threadlabs-studio.github.io/markupress/' },
    { label: 'GitHub', href: 'https://github.com/threadlabs-studio/markupkit' },
  ],
});
