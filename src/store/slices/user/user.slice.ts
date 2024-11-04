import { createSlice } from "@reduxjs/toolkit"
import { IDType } from "@root/types/data"

interface UserState {
  isLoading: boolean
  error: string | null
  userId?: IDType
  username?: string
}

const initialState: UserState = {
  isLoading: false,
  error: null
}

const usersSlice = createSlice({
  name: "user",
  initialState,
  reducers: {}
})

export default usersSlice.reducer
// export const { } = usersSlice.actions
