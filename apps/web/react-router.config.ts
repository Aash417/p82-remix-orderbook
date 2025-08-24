import type { Config } from '@react-router/dev/config';

export default {
   // Config options...
   // Server-side render by default, to enable SPA mode set this to `false`
   ssr: true,
   // Disable prerendering for fresh data on each request
   prerender: false,
} satisfies Config;
