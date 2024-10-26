import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { getAllUsers } from "@root/services/users.service"
import { IDType } from "@root/types/data"

export interface User {
  id: IDType
  email: string
  username: string
}

interface UserState {
  isLoading: boolean
  error?: string
  selectedUser?: User
  users?: User[]
}

const initialState: UserState = {
  isLoading: false
}

export const getUsersAction = createAsyncThunk<User[], undefined, { rejectValue: Error }>(
  "users/getUsers",
  async () => {
    const users = await getAllUsers()
    return users
  }
)

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.selectedUser = state.users!.find(user => user.id === action.payload)
    }
  },
  extraReducers: builder => {
    builder
      .addCase(getUsersAction.pending, state => {
        state.isLoading = true
        state.error = undefined
      })
      .addCase(getUsersAction.fulfilled, (state, action) => {
        state.users = action.payload
        state.selectedUser = action.payload[0]
        state.isLoading = false
      })
      .addCase(getUsersAction.rejected, (state, action) => {
        state.isLoading = false
        state.error = getErrorMessage(action)
      })
  }
})

export default usersSlice.reducer
export const { setUser } = usersSlice.actions

// utils
export const getErrorMessage = (action: { payload?: { message?: string } }) => {
  return action.payload?.message || "An error occurred."
}
