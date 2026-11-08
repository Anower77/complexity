import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import tailwind from '@astrojs/tailwind';

const isProd = process.env.NODE_ENV === 'production';
const defaultBase = isProd ? '/complexity' : '/';

export default defineConfig({
  site: process.env.SITE || 'https://anower77.github.io',
  base: process.env.BASE_URL !== undefined ? process.env.BASE_URL : defaultBase,
  output: 'static',
  integrations: [
    react(),
    mdx({
      syntaxHighlight: 'shiki',
      shikiConfig: {
        theme: 'github-dark-dimmed'
      }
    }),
    tailwind({
      applyBaseStyles: false
    })
  ],
  vite: {
    resolve: {
      alias: {
        '@': '/src'
      }
    }
  }
});
