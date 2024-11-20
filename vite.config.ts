import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  server: { 
            host: true,
            port: 3000,
            proxy: {
              "/api": {
                target: "http://10.211.55.5:8000",
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, "/"),
              }
            }
   },
  plugins: [react()],
})
