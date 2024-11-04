import { secureServiceCall } from "@root/utils/service"

export const getUser = async () => {
  return await secureServiceCall({
    path: "/user",
    method: "get",
    errorMessage: "Failed to get user"
  })
}
