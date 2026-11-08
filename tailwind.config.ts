import type { Config } from 'tailwindcss';
import typography from '@tailwindcss/typography';

export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        canvas: 'var(--bg-canvas)',
        surface: {
          DEFAULT: 'var(--bg-surface)',
          elevated: 'var(--bg-surface-elevated)',
          muted: 'var(--bg-surface-muted)'
        },
        border: {
          subtle: 'var(--border-subtle)',
          strong: 'var(--border-strong)',
          active: 'var(--border-active)'
        },
        text: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          muted: 'var(--text-muted)'
        },
        brand: {
          DEFAULT: 'var(--brand-primary)',
          subtle: 'var(--brand-subtle)',
          border: 'var(--brand-border)',
          hover: 'var(--brand-hover)'
        },
        status: {
          success: 'var(--status-success)',
          warning: 'var(--status-warning)',
          danger: 'var(--status-danger)',
          info: 'var(--status-info)'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        serif: ['Newsreader', 'Georgia', 'Cambria', 'serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace']
      },
      maxWidth: {
        'reading': '70ch',
        'content': '900px',
        'layout': '1440px'
      },
      width: {
        'sidebar-left': '300px',
        'sidebar-right': '240px'
      }
    }
  },
  plugins: [typography]
} satisfies Config;
