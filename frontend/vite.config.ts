import react from '@vitejs/plugin-react';
import autoprefixer from 'autoprefixer';
import dotenv from 'dotenv';
import path from 'path';
import tailwindcss from 'tailwindcss';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';
import { courseConfig } from './src/config/course-config';

dotenv.config();

const folder = courseConfig.distBuildFolder; // ✅ usa configuração centralizada

export default defineConfig({
  base: './', // ✅ mantém caminhos relativos
  build: {
    outDir: path.resolve(__dirname, `dist/${folder}`),
    emptyOutDir: true,
  },
  plugins: [
    react({
      babel: {
        plugins: ['babel-plugin-react-compiler'],
      },
    }),
    svgr({
      svgrOptions: { icon: false },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@root': path.resolve(__dirname, './'),
    },
  },
  css: {
    postcss: {
      plugins: [tailwindcss, autoprefixer],
    },
  },
});
