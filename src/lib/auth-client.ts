import { createAuthClient } from "better-auth/react"
import { magicLinkClient } from "better-auth/client/plugins"

// Same-origin: /api/auth is proxied (Vite in dev, nginx in prod)
export const authClient = createAuthClient({ plugins: [magicLinkClient()] })
