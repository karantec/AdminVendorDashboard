import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

export default defineConfig({
  plugins: [react(), svgr()],
  build: {
    rollupOptions: {
      onwarn(warning, warn) {
        // Ignore eval warnings from @react-jvectormap/core library
        if (
          warning.code === 'EVAL' && 
          warning.id?.includes('@react-jvectormap/core')
        ) {
          return;
        }
        warn(warning);
      }
    }
  },
  optimizeDeps: {
    // Exclude problematic dependencies from optimization
    exclude: ['@react-jvectormap/core'],
  }
});