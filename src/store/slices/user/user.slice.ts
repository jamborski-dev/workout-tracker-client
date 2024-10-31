import { createSlice } from "@reduxjs/toolkit"
import { IDType } from "@root/types/data"

export interface User {
  id: IDType
  email: string
  username: string
}

interface UserState {
  isLoading: boolean
  error?: string
  userId: IDType
}

const initialState: UserState = {
  isLoading: false,
  userId: 1
}

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {}
})

export default usersSlice.reducer
// export const { } = usersSlice.actions
