import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  // Optimizaciones de build
  build: {
    // Chunk splitting para mejor caching
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks separados
          'react-vendor': ['react', 'react-dom'],
          'ui-vendor': ['lucide-react', 'react-window'],
          'ai-vendor': ['openai'],
          'utils-vendor': ['date-fns', 'clsx'],
        },
        // Nombres de archivos optimizados
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },

    // Optimizaciones de tamaño
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },

    // Source maps solo en desarrollo
    sourcemap: process.env.NODE_ENV === 'development',

    // Tamaño máximo de chunk
    chunkSizeWarningLimit: 1000,
  },

  // Optimizaciones de desarrollo
  server: {
    port: 3000,
    host: true,
    // HMR optimizado
    hmr: {
      overlay: true,
    },
  },

  // Optimizaciones de dependencias
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'lucide-react',
      'react-window',
      '@tanstack/react-query',
    ],
    exclude: ['@vite/client', '@vite/env'],
  },

  // Alias para imports más limpios
  resolve: {
    alias: {
      '@': '/src',
      '@components': '/src/components',
      '@hooks': '/src/hooks',
      '@services': '/src/services',
      '@utils': '/src/utils',
      '@types': '/src/types',
      '@styles': '/src/styles',
    },
  },

  // Variables de entorno
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
  },

  // Preview server para testing de producción
  preview: {
    port: 3001,
    host: true,
  },
})