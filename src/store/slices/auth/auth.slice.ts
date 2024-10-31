import { createSlice, createAsyncThunk, createSelector } from "@reduxjs/toolkit"
import { API } from "@root/services/axios"
import { RootState } from "@root/store/store"
import { AccessToken } from "@root/types/data"
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FixMeLater } from "@root/types/FixMeLater"

export type LoginPayload = { email: string; password: string }

// Define the loginUser thunk
export const loginUser = createAsyncThunk<string, LoginPayload, { rejectValue: string }>(
  "auth/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await API.post("/auth/login", credentials, {
        withCredentials: true
      })
      return response.data.accessToken // Return only the access token
    } catch (error: FixMeLater) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data)
      }
      return rejectWithValue(error.message)
    }
  }
)

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
      .addCase(loginUser.pending, state => {
        state.isLoading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isAuthChecked = true
        state.isLoading = false
        state.accessToken = action.payload
      })
      .addCase(loginUser.rejected, (state, action) => {
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

const selectAuthState = (state: RootState) => state.auth

// for use in thunks + services
export const selectAccessToken = createSelector(selectAuthState, state => state.accessToken)
