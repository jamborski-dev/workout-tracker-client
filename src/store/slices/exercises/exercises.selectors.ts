import { createSelector } from "@reduxjs/toolkit"
import { RootState } from "@store/store"

const selectExercisesState = (state: RootState) => state.exercises

export const selectExercisesLoading = createSelector(selectExercisesState, state => state.isLoading)

export const selectExercisesError = createSelector(selectExercisesState, state => state.error)
export const selectFormUpdateValues = createSelector(
  selectExercisesState,
  state => state.form.updateValues
)
export const selectFormMode = createSelector(selectExercisesState, state => state.form.mode)

export const selectCurrentExercise = createSelector(
  selectExercisesState,
  state => state.currentExercise
)
export const selectCurrentExerciseUpdating = createSelector(
  selectExercisesState,
  state => state.isUpdating
)

export const selectExerciseList = createSelector(selectExercisesState, state => state.list)
