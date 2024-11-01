import { LoginPayload } from "@root/store/slices/auth/auth.slice"
import { AccessToken } from "@root/types/data"
import { secureServiceCall } from "@root/utils/service"

export const loginUser = (credentials: LoginPayload) => {
  return secureServiceCall<LoginPayload, { accessToken: AccessToken }>({
    params: credentials,
    method: "post",
    path: "/auth/login",
    errorMessage: "Failed to login",
    accessToken: null
  })
}
