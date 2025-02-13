import path from 'node:path';
import { defineConfig, loadEnv, UserConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import alias from '@rollup/plugin-alias';
import tailwind from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import svgLoader from 'vite-svg-loader';

export default defineConfig(({ mode }): UserConfig => {
  const ENV = loadEnv(mode, process.cwd());
  const port = ENV.VITE_PORT || 3201;
  return {
    css: {
      postcss: {
        plugins: [tailwind(), autoprefixer()],
      },
    },
    plugins: [vue(), alias(), svgLoader()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      port: +port,
    },
  };
});
