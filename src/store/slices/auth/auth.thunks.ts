import { LoginPayload } from "./auth.types"
import { loginUser, refreshToken } from "@root/services/auth.service"
import { AuthReturn } from "@store/slices/auth/auth.types"
import { createThunk } from "@root/utils/store"

export const loginUserAction = createThunk<LoginPayload, AuthReturn>("auth/login", loginUser)

export const refreshTokenAction = createThunk<undefined, AuthReturn>(
  "auth/refreshToken",
  refreshToken
)
