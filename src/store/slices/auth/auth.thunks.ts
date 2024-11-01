import { AccessToken } from "@root/types/data"
import { LoginPayload } from "./auth.slice"
import { loginUser } from "@root/services/auth.service"
import { createThunk } from "@root/utils/store"

export const loginUserAction = createThunk<LoginPayload, { accessToken: AccessToken }>(
  "auth/login",
  loginUser,
  [],
  {
    includeUserId: false,
    includeAccessToken: false
  }
)
