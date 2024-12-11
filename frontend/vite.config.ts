import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react({
    // Ensure that the React plugin uses the automatic JSX runtime
    jsxRuntime: "automatic", // This ensures no need to import React manually
  }),],
})
