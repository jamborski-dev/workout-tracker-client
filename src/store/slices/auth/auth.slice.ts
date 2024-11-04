import { createSlice } from "@reduxjs/toolkit"
import { loginUserAction, refreshTokenAction } from "@store/slices/auth/auth.thunks"
import { User } from "@store/slices/auth/auth.types"

// Define the AuthSliceState type
type AuthSliceState = {
  isLoading: boolean
  isRefreshing: boolean
  isAuthChecked: boolean
  error: string | null
  user: User | null
}

const authSlice = createSlice({
  name: "auth",
  initialState: {
    isLoading: false,
    isRefreshing: false,
    isAuthChecked: false,
    error: null,
    user: null
  } as AuthSliceState,
  reducers: {
    logout: state => {
      state.user = null
    }
  },
  extraReducers: builder => {
    builder
      .addCase(loginUserAction.pending, state => {
        state.isLoading = true
        state.error = null
      })
      .addCase(loginUserAction.fulfilled, (state, action) => {
        state.isAuthChecked = true
        state.isLoading = false
        state.user = action.payload.user
      })
      .addCase(loginUserAction.rejected, (state, action) => {
        state.isAuthChecked = true
        state.isLoading = false
        state.error = action.payload as string
      })
      .addCase(refreshTokenAction.pending, state => {
        state.isRefreshing = true
        state.error = null
      })
      .addCase(refreshTokenAction.fulfilled, (state, action) => {
        state.isAuthChecked = true
        state.isRefreshing = false
        state.user = action.payload.user
      })
      .addCase(refreshTokenAction.rejected, state => {
        state.isAuthChecked = true
        state.isRefreshing = false
        state.user = null
      })
  }
})

export const { logout } = authSlice.actions
export default authSlice.reducer
