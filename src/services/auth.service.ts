import { LoginPayload, AuthReturn } from "@root/store/slices/auth/auth.types"
import { secureServiceCall } from "@root/utils/service"

export const loginUser = (credentials: LoginPayload) => {
  return secureServiceCall<LoginPayload, AuthReturn>({
    params: credentials,
    method: "post",
    path: "/auth/login",
    errorMessage: "Failed to login"
  })
}

export const refreshToken = async () => {
  return await secureServiceCall<undefined, AuthReturn>({
    method: "post",
    path: "auth/refresh-token",
    errorMessage: "Failed to refresh token"
  })
}
