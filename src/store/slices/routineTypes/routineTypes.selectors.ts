import { createSelector } from "@reduxjs/toolkit"
import type { RootState } from "@store/store"

const selectRoutineTypesState = (state: RootState) => state.routineTypes

export const selectRoutineTypes = createSelector(selectRoutineTypesState, state => state.list)
export const selectRoutineTypesLoading = createSelector(
  selectRoutineTypesState,
  state => state.isLoading
)
export const selectRoutineTypesError = createSelector(selectRoutineTypesState, state => state.error)
export const selectCurrentRoutineType = createSelector(
  selectRoutineTypesState,
  state => state.current
)
