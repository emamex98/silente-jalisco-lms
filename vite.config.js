import { sentryVitePlugin } from "@sentry/vite-plugin";
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), sentryVitePlugin({
    org: "silentejalisco",
    project: "silente_lms"
  })],

  resolve: {
    alias: {
      src: '/src',
      '@components': '/src/components',
      '@assets': '/src/assets',
      '@routes': '/src/routes',
      '@context': '/src/context',
      '@libs': '/src/libs',
      '@utils': '/src/utils',
      '@hooks': '/src/hooks',
    },
  },

  build: {
    sourcemap: true
  }
});