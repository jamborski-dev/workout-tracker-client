import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "@fontsource/poppins/latin.css"
import "@fontsource/pt-sans-narrow/latin.css"
import "@fontsource-variable/afacad-flux"

import AppRoot from "./pages/AppRoot.tsx"
import "./index.css"
import { store } from "@store/store"
import { Provider } from "react-redux"
import { BrowserRouter } from "react-router-dom"
import ErrorBoundary from "@components/ErrorBoundary.tsx"

const requiredEnvVars = ["VITE_SERVER_URL"]

const missingEnvVars = requiredEnvVars.filter(envVar => !import.meta.env[envVar])

if (missingEnvVars.length > 0) {
  throw new Error(`Missing required environment variables: ${missingEnvVars.join(", ")}`)
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <ErrorBoundary>
          <AppRoot />
        </ErrorBoundary>
      </Provider>
    </BrowserRouter>
  </StrictMode>
)
