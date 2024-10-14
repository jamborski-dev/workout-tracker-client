import { createSlice } from "@reduxjs/toolkit"
import {
  createRoutineAction,
  deleteRoutineAction,
  updateRoutineAction,
  getAllRoutinesAction,
  getOneRoutineAction
} from "./routines.thunks"
import { RoutinesState } from "./routines.types"
import { startAppListening } from "@store/middleware/listenerMiddleware"
import { setRightPanel } from "../page/page.slice"

const initialState: RoutinesState = {
  routines: [],
  form: {
    mode: "add"
  },
  isLoading: false,
  isUpdating: false,
  error: null
}

const routinesSlice = createSlice({
  name: "routines",
  initialState,
  reducers: {
    setEdit: (state, action) => {
      state.form.mode = "edit"
      state.form.updateValues = action.payload
    },
    cancelEdit: state => {
      state.form.mode = "add"
      state.form.updateValues = undefined
    },

    setRoutine: (state, action) => {
      state.currentRoutine = action.payload
    }
  },
  extraReducers: builder => {
    builder
      .addCase(getAllRoutinesAction.pending, state => {
        state.isLoading = true
        state.error = null
      })
      .addCase(getAllRoutinesAction.fulfilled, (state, action) => {
        state.routines = action.payload
        state.isLoading = false
      })
      .addCase(getAllRoutinesAction.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

    builder
      .addCase(getOneRoutineAction.pending, state => {
        state.isLoading = true
        state.error = null
      })
      .addCase(getOneRoutineAction.fulfilled, (state, action) => {
        state.currentRoutine = action.payload
        state.isLoading = false
      })
      .addCase(getOneRoutineAction.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

    builder
      .addCase(createRoutineAction.pending, state => {
        state.isUpdating = true
        state.error = null
      })
      .addCase(createRoutineAction.fulfilled, (state, action) => {
        const { date } = action.payload
        const index = state.routines.findIndex(rtn => rtn.date <= date)
        if (index === -1) {
          state.routines.push(action.payload)
        } else {
          state.routines.splice(index, 0, action.payload)
        }
        state.isUpdating = false
      })
      .addCase(createRoutineAction.rejected, (state, action) => {
        state.error = action.payload as string
        state.isUpdating = false
      })

    builder
      .addCase(updateRoutineAction.pending, state => {
        state.isUpdating = true
        state.error = null
      })
      .addCase(updateRoutineAction.fulfilled, (state, action) => {
        const idx = state.routines.findIndex(rtn => rtn.id === action.payload.id)
        state.routines[idx] = action.payload
        state.isUpdating = false
      })
      .addCase(updateRoutineAction.rejected, (state, action) => {
        state.error = action.payload || "An error occurred"
        state.isUpdating = false
      })

    builder
      .addCase(deleteRoutineAction.pending, state => {
        state.isUpdating = true
        state.error = null
      })
      .addCase(deleteRoutineAction.fulfilled, (state, action) => {
        state.routines = state.routines.filter(rtn => rtn.id !== action.payload.id)
        state.isUpdating = false
      })
      .addCase(deleteRoutineAction.rejected, (state, action) => {
        state.error = action.payload as string
        state.isUpdating = false
      })
  }
})

export const { setEdit, cancelEdit } = routinesSlice.actions
export default routinesSlice.reducer

startAppListening({
  actionCreator: createRoutineAction.fulfilled,
  effect: async (_, { dispatch }) => {
    dispatch(setRightPanel(undefined))
  }
})
