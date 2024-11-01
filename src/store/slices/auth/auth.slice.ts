import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { API } from "@root/services/axios"
import { AccessToken } from "@root/types/data"
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FixMeLater } from "@root/types/FixMeLater"
import { loginUserAction } from "./auth.thunks"

export type LoginPayload = { email: string; password: string }

// Define the refreshAccessToken thunk
export const refreshAccessToken = createAsyncThunk(
  "auth/refreshAccessToken",
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.post(
        "/auth/refresh-token",
        {},
        {
          withCredentials: true
        }
      )
      return response.data.accessToken
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error: FixMeLater) {
      return rejectWithValue("Failed to refresh access token")
    }
  }
)

// Define the AuthSliceState type
type AuthSliceState = {
  accessToken: AccessToken
  isLoading: boolean
  refreshing: boolean
  isAuthChecked: boolean
  error: string | null
}

const authSlice = createSlice({
  name: "auth",
  initialState: {
    accessToken: null,
    isLoading: false,
    refreshing: false,
    isAuthChecked: false,
    error: null
  } as AuthSliceState,
  reducers: {
    logout: state => {
      state.accessToken = null
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
        state.accessToken = action.payload.accessToken
      })
      .addCase(loginUserAction.rejected, (state, action) => {
        state.isAuthChecked = true
        state.isLoading = false
        state.error = action.payload as string
      })
      .addCase(refreshAccessToken.pending, state => {
        state.refreshing = true
        state.error = null
      })
      .addCase(refreshAccessToken.fulfilled, (state, action) => {
        state.isAuthChecked = true
        state.refreshing = false
        state.accessToken = action.payload
      })
      .addCase(refreshAccessToken.rejected, state => {
        state.isAuthChecked = true
        state.refreshing = false
        state.accessToken = null
      })
  }
})

export const { logout } = authSlice.actions
export default authSlice.reducer
