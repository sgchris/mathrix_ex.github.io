import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/mathrix/',
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/firebase/auth')) {
            return 'firebase-auth'
          }

          if (id.includes('node_modules/firebase/firestore')) {
            return 'firebase-firestore'
          }

          if (id.includes('node_modules/firebase/app')) {
            return 'firebase-app'
          }

          if (id.includes('node_modules/firebase')) {
            return 'firebase-core'
          }

          if (id.includes('node_modules/katex')) {
            return 'katex'
          }

          if (id.includes('node_modules/react')) {
            return 'react-vendor'
          }

          if (id.includes('node_modules/@heroicons')) {
            return 'heroicons'
          }

          return undefined
        },
      },
    },
  },
})
