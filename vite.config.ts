import { defineConfig, PluginOption } from "vite"
import react from "@vitejs/plugin-react-swc"
import svgr from "vite-plugin-svgr"
import fs from "fs"

// Define full-reload plugin
const fullReloadAlways: PluginOption = {
  name: "full-reload-always",
  handleHotUpdate({ server }) {
    server.ws.send({ type: "full-reload" })
    return []
  }
} as PluginOption

// Conditional server configuration based on environment
const serverConfig =
  process.env.NODE_ENV === "development"
    ? {
        https: {
          key: fs.readFileSync("certs/localhost+2-key.pem"),
          cert: fs.readFileSync("certs/localhost+2.pem")
        },
        port: 5173,
        proxy: {
          "/api": {
            target: "http://localhost:5001", // Your backend server
            changeOrigin: true
            // rewrite: path => path.replace(/^\/api/, "") // Optional: removes '/api' prefix if needed
          }
        }
      }
    : {
        port: 5173,
        proxy: {
          "/api": {
            target: "http://localhost:5001", // Your backend server
            changeOrigin: true
          }
        }
      }

// Export Vite configuration
export default defineConfig({
  server: serverConfig,
  resolve: {
    alias: {
      "@root": "/src",
      "@services": "/src/services",
      "@store": "/src/store",
      "@components": "/src/components",
      "@constants": "/src/constants",
      "@hooks": "/src/hooks",
      "@utils": "/src/utils",
      "@types": "/src/types",
      "@templates": "/src/templates",
      "@routes": "/src/routes",
      "@context": "/src/context"
    }
  },
  plugins: [react(), svgr({ include: "**/*.svg" }), fullReloadAlways]
})
