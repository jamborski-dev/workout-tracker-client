import { createSlice } from "@reduxjs/toolkit"
import { logout } from "@root/store/slices/auth/auth.slice"
import {
  createTemplateAction,
  deleteTemplateAction,
  getAllTemplatesAction,
  updateTemplateAction
} from "./templates.thunks"
import type { TemplatesState } from "./templates.types"

const initialState: TemplatesState = {
  list: [],
  isLoading: false,
  error: null
}

const templatesSlice = createSlice({
  name: "templates",
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getAllTemplatesAction.pending, state => {
        state.isLoading = true
        state.error = null
      })
      .addCase(getAllTemplatesAction.fulfilled, (state, action) => {
        state.list = action.payload
        state.isLoading = false
      })
      .addCase(getAllTemplatesAction.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      .addCase(createTemplateAction.fulfilled, (state, action) => {
        state.list = [action.payload, ...state.list]
      })
      .addCase(updateTemplateAction.fulfilled, (state, action) => {
        state.list = state.list.map(item => (item.id === action.payload.id ? action.payload : item))
      })
      .addCase(deleteTemplateAction.fulfilled, (state, action) => {
        state.list = state.list.filter(item => item.id !== action.meta.arg.templateId)
      })
      // Templates are per user: never show the previous user's after logout
      .addCase(logout, () => initialState)
  }
})

export default templatesSlice.reducer
