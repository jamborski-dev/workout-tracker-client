import { authClient } from "@root/lib/auth-client"
import { LoginPayload, AuthReturn, User } from "@root/store/slices/auth/auth.types"

export const loginUser = async ({ email, password }: LoginPayload): Promise<AuthReturn> => {
  const { data, error } = await authClient.signIn.email({ email, password })
  if (error || !data) {
    throw new Error(error?.message || "Invalid email or password")
  }
  return { user: data.user as User }
}

// Restores the session from the cookie on app start
export const loadSession = async (): Promise<AuthReturn> => {
  const { data } = await authClient.getSession()
  if (!data?.user) {
    throw new Error("No active session")
  }
  return { user: data.user as User }
}

export const logoutUser = async () => {
  await authClient.signOut()
}
