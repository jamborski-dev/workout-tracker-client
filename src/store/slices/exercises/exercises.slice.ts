import { createSlice } from "@reduxjs/toolkit"
import { createExerciseAction, getAllExercisesAction } from "./exercises.thunks"
import { ExercisesState } from "./exercises.types"

const initialState: ExercisesState = {
  list: [],
  form: {
    mode: "add"
  },
  isLoading: false,
  isUpdating: false,
  error: null
}

const exercisesSlice = createSlice({
  name: "exercises",
  initialState,
  reducers: {
    setEdit: (state, action) => {
      state.form.mode = "edit"
      state.form.updateValues = action.payload
    },
    cancelEdit: state => {
      state.form.mode = "add"
      state.form.updateValues = undefined
    }
  },
  extraReducers: builder => {
    builder
      .addCase(getAllExercisesAction.pending, state => {
        state.isLoading = true
        state.error = null
      })
      .addCase(getAllExercisesAction.fulfilled, (state, action) => {
        state.list = action.payload
        state.isLoading = false
      })
      .addCase(getAllExercisesAction.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

    builder
      .addCase(createExerciseAction.pending, state => {
        state.isUpdating = true
        state.error = null
      })
      .addCase(createExerciseAction.fulfilled, (state, action) => {
        state.isUpdating = false
        state.list.push(action.payload)
      })
      .addCase(createExerciseAction.rejected, (state, action) => {
        state.isUpdating = false
        state.error = action.payload as string
      })
  }
})

export const { setEdit, cancelEdit } = exercisesSlice.actions
export default exercisesSlice.reducer
