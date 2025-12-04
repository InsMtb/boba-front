import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Use relative paths for built assets so the app works on Amplify and subpaths
  base: './',
})
