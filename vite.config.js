import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import svgr from 'vite-plugin-svgr';


export default defineConfig({
  plugins: [react(),svgr({include: "**/*.svg?react",}),],
  server: {
    host: '0.0.0.0',  // Allows access from any network
    port: 8005         // Replace with your desired port
  }
})
