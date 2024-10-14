import { defineConfig, PluginOption } from "vite"
import react from "@vitejs/plugin-react-swc"
import svgr from "vite-plugin-svgr"

const fullReloadAlways: PluginOption = {
  name: "full-reload-always",
  handleHotUpdate({ server }) {
    server.ws.send({ type: "full-reload" })
    return []
  }
} as PluginOption

// https://vitejs.dev/config/
export default defineConfig({
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
