import { createSelector } from "@reduxjs/toolkit"

import { RootState } from "@store/store"

const selectRoutinesState = (state: RootState) => state.routines

export const selectRoutines = createSelector(selectRoutinesState, state => state.routines)

export const selectRoutinesLoading = createSelector(selectRoutinesState, state => state.isLoading)

export const selectRoutinesError = createSelector(selectRoutinesState, state => state.error)
export const selectFormUpdateValues = createSelector(
  selectRoutinesState,
  state => state.form.updateValues
)
export const selectFormMode = createSelector(selectRoutinesState, state => state.form.mode)

export const selectCurrentRoutine = createSelector(
  selectRoutinesState,
  state => state.currentRoutine
)
export const selectCurrentRoutineUpdating = createSelector(
  selectRoutinesState,
  state => state.isUpdating
)
