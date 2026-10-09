import { LoginPayload } from "./auth.types"
import { loadSession, loginUser } from "@root/services/auth.service"
import { AuthReturn } from "@store/slices/auth/auth.types"
import { createThunk } from "@root/utils/store"

export const loginUserAction = createThunk<LoginPayload, AuthReturn>("auth/login", loginUser)

export const loadSessionAction = createThunk<undefined, AuthReturn>("auth/loadSession", loadSession)
