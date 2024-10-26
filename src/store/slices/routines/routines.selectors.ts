import { createSelector } from "@reduxjs/toolkit"

import { RootState } from "@store/store"

const selectRoutinesState = (state: RootState) => state.routines

export const selectList = createSelector(selectRoutinesState, state => state.list)
export const selectRoutinesLoading = createSelector(selectRoutinesState, state => state.isLoading)
export const selectRoutinesError = createSelector(selectRoutinesState, state => state.error)
export const selectRoutine = createSelector(selectRoutinesState, state => state.selected)
export const selectRoutineIsUpdating = createSelector(
  selectRoutinesState,
  state => state.isUpdating
)
