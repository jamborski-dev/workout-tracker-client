export type LoginPayload = {
  email: string
  password: string
}

export type AuthReturn = {
  user: User
}

export type User = {
  id: string
  email: string
  name: string
  role?: string
}
