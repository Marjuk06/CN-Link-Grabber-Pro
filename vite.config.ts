import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';

// Custom plugin to copy manifest.json, icons, and ensure sidepanel path matches manifest
function copyExtensionAssets() {
  return {
    name: 'copy-extension-assets',
    closeBundle() {
      const distDir = path.resolve(__dirname, 'dist');
      if (!fs.existsSync(distDir)) {
        fs.mkdirSync(distDir, { recursive: true });
      }

      // Copy manifest.json
      const manifestSrc = path.resolve(__dirname, 'manifest.json');
      const manifestDest = path.join(distDir, 'manifest.json');
      if (fs.existsSync(manifestSrc)) {
        fs.copyFileSync(manifestSrc, manifestDest);
      }

      // Copy icons directory
      const iconsSrc = path.resolve(__dirname, 'icons');
      const iconsDest = path.join(distDir, 'icons');
      if (fs.existsSync(iconsSrc)) {
        if (!fs.existsSync(iconsDest)) {
          fs.mkdirSync(iconsDest, { recursive: true });
        }
        const files = fs.readdirSync(iconsSrc);
        for (const file of files) {
          fs.copyFileSync(path.join(iconsSrc, file), path.join(iconsDest, file));
        }
      }

      // Ensure dist/sidepanel/index.html exists
      const nestedSidepanel = path.join(distDir, 'src', 'sidepanel');
      const targetSidepanel = path.join(distDir, 'sidepanel');
      if (fs.existsSync(nestedSidepanel)) {
        if (!fs.existsSync(targetSidepanel)) {
          fs.mkdirSync(targetSidepanel, { recursive: true });
        }
        const files = fs.readdirSync(nestedSidepanel);
        for (const file of files) {
          fs.copyFileSync(path.join(nestedSidepanel, file), path.join(targetSidepanel, file));
        }
      }

      // Also copy built sidepanel and assets directly to root workspace
      const rootSidepanel = path.resolve(__dirname, 'sidepanel');
      const rootAssets = path.resolve(__dirname, 'assets');
      if (fs.existsSync(targetSidepanel)) {
        if (!fs.existsSync(rootSidepanel)) fs.mkdirSync(rootSidepanel, { recursive: true });
        const files = fs.readdirSync(targetSidepanel);
        for (const file of files) {
          fs.copyFileSync(path.join(targetSidepanel, file), path.join(rootSidepanel, file));
        }
      }
      const distAssets = path.join(distDir, 'assets');
      if (fs.existsSync(distAssets)) {
        if (!fs.existsSync(rootAssets)) fs.mkdirSync(rootAssets, { recursive: true });
        const files = fs.readdirSync(distAssets);
        for (const file of files) {
          fs.copyFileSync(path.join(distAssets, file), path.join(rootAssets, file));
        }
      }
    },
  };
}

export default defineConfig({
  plugins: [react(), copyExtensionAssets()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: false,
    rollupOptions: {
      input: {
        sidepanel: path.resolve(__dirname, 'src/sidepanel/index.html'),
        'service-worker': path.resolve(__dirname, 'src/background/service-worker.ts'),
      },
      output: {
        entryFileNames: (chunkInfo) => {
          if (chunkInfo.name === 'service-worker') {
            return 'service-worker.js';
          }
          return 'assets/[name]-[hash].js';
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
  },
});
