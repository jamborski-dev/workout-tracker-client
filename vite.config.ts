import { defineConfig, type PluginOption } from "vite"
import react from "@vitejs/plugin-react"
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
        host: true,
        https: {
          key: fs.readFileSync("certs/localhost+2-key.pem"),
          cert: fs.readFileSync("certs/localhost+2.pem")
        },
        port: Number(process.env.VITE_DEV_PORT) || 5173,
        strictPort: true,
        proxy: {
          "/api": {
            target: "https://localhost:5001", // Your backend server
            changeOrigin: true,
            secure: false
            // rewrite: path => path.replace(/^\/api/, "") // Optional: removes '/api' prefix if needed
          }
        }
      }
    : {
        port: 5173,
        proxy: {
          "/api": {
            target: "https://localhost:5001", // Your backend server
            changeOrigin: true,
            secure: false
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
  plugins: [
    react({
      babel: {
        plugins: [
          [
            "babel-plugin-styled-components",
            {
              displayName: true,
              fileName: true
            }
          ]
        ]
      }
    }),
    svgr({ include: "**/*.svg" }),
    fullReloadAlways
  ]
})
