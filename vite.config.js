import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from 'tailwindcss';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@mui/icons-material': '@mui/icons-material/esm', // Aliases to use ESM version
    },
  },
  css: {
    postcss: {
      plugins: [tailwindcss()],
    },
  },
});
