import { getUser } from "@root/services/user.service"
import { createThunk } from "@root/utils/store"

export const getUserAction = createThunk<undefined, void>("user/getUser", getUser, [], {
  includeUserId: false
})
