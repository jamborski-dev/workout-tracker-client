import { IDType } from "@root/types/data"

export type LoginPayload = {
  email: string
  password: string
}

export type AuthReturn = {
  user: User
}

export type User = {
  id: IDType
  email: string
  username?: string
}
