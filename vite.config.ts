import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'next/image': path.resolve(__dirname, './src/components/common/Image.tsx'),
      'next/link': path.resolve(__dirname, './src/components/common/Link.tsx'),
      'next/dynamic': path.resolve(__dirname, './src/components/common/dynamic.tsx'),
      'next/navigation': path.resolve(__dirname, './src/components/common/navigation.ts'),
    },
  },
  server: {
    port: 3000,
    open: false,
  },
});

