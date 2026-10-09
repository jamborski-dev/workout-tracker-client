import { createSlice } from "@reduxjs/toolkit"
import {
  createRoutineTypeAction,
  deleteRoutineTypeAction,
  getAllRoutineTypesAction,
  getRoutineTypeByIdAction,
  updateRoutineTypeAction
} from "./routineTypes.thunks"
import type { RoutineTypesState } from "./routineTypes.types"

const initialState: RoutineTypesState = {
  list: [],
  isLoading: false,
  isUpdating: false,
  error: null
}

const routineTypesSlice = createSlice({
  name: "routineTypes",
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getAllRoutineTypesAction.pending, state => {
        state.isLoading = true
        state.error = null
      })
      .addCase(getAllRoutineTypesAction.fulfilled, (state, action) => {
        state.list = action.payload
        state.isLoading = false
      })
      .addCase(getAllRoutineTypesAction.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

    builder
      .addCase(getRoutineTypeByIdAction.pending, state => {
        state.isLoading = true
        state.error = null
      })
      .addCase(getRoutineTypeByIdAction.fulfilled, (state, action) => {
        state.current = action.payload
        state.isLoading = false
      })
      .addCase(getRoutineTypeByIdAction.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

    builder
      .addCase(createRoutineTypeAction.pending, state => {
        state.isUpdating = true
        state.error = null
      })
      .addCase(createRoutineTypeAction.fulfilled, state => {
        state.isUpdating = false
      })
      .addCase(createRoutineTypeAction.rejected, (state, action) => {
        state.isUpdating = false
        state.error = action.payload as string
      })

    builder
      .addCase(updateRoutineTypeAction.pending, state => {
        state.isUpdating = true
        state.error = null
      })
      .addCase(updateRoutineTypeAction.fulfilled, (state, action) => {
        state.isUpdating = false
        state.list = state.list.map(item => (item.id === action.payload.id ? action.payload : item))
        if (state.current?.id === action.payload.id) {
          state.current = action.payload
        }
      })
      .addCase(updateRoutineTypeAction.rejected, (state, action) => {
        state.isUpdating = false
        state.error = action.payload as string
      })

    builder
      .addCase(deleteRoutineTypeAction.pending, state => {
        state.isUpdating = true
        state.error = null
      })
      .addCase(deleteRoutineTypeAction.fulfilled, (state, action) => {
        state.isUpdating = false
        state.list = state.list.filter(item => item.id !== action.meta.arg.routineTypeId)
        if (`${state.current?.id}` === `${action.meta.arg.routineTypeId}`) {
          state.current = undefined
        }
      })
      .addCase(deleteRoutineTypeAction.rejected, (state, action) => {
        state.isUpdating = false
        state.error = action.payload as string
      })
  }
})

export default routineTypesSlice.reducer
