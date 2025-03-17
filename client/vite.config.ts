import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import EnvironmentPlugin from 'vite-plugin-environment';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    EnvironmentPlugin(
      { NODE_ENV: 'production', VITE_BASE_URL: '' },
      { loadEnvFiles: false }
    ),
  ],
});
