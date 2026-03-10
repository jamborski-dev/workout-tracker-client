import { createSlice } from "@reduxjs/toolkit"

interface AdminState {
  error: string | null
  isLoading: boolean
  isUpdating: boolean
}

const initialState: AdminState = {
  error: null,
  isLoading: false,
  isUpdating: false
}

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    // Define your reducers here
  }
})

// export const { actions } = adminSlice.actions;

export default adminSlice.reducer
