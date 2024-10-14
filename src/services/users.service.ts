import { serviceCall } from "@root/utils/service"
import { User } from "@store/slices/users/users.slice"

export const getAllUsers = async () => {
  return serviceCall<undefined, User[]>(undefined, "get", "/users", "Error fetching users")
}
