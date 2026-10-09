import { authClient } from "@root/lib/auth-client"
import { LoginPayload, AuthReturn, User } from "@root/store/slices/auth/auth.types"

// Keep only plain, serializable fields in Redux (the raw session user contains Date objects)
const toUser = (user: { id: string; email: string; name: string; role?: unknown }): User => ({
  id: user.id,
  email: user.email,
  name: user.name,
  role: typeof user.role === "string" ? user.role : undefined
})

export const loginUser = async ({ email, password }: LoginPayload): Promise<AuthReturn> => {
  const { data, error } = await authClient.signIn.email({ email, password })
  if (error || !data) {
    throw new Error(error?.message || "Invalid email or password")
  }
  return { user: toUser(data.user) }
}

// Restores the session from the cookie on app start
export const loadSession = async (): Promise<AuthReturn> => {
  const { data } = await authClient.getSession()
  if (!data?.user) {
    throw new Error("No active session")
  }
  return { user: toUser(data.user) }
}

export const logoutUser = async () => {
  await authClient.signOut()
}
