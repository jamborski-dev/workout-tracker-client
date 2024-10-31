import { createSelector } from "@reduxjs/toolkit"
import { IDType } from "@root/types/data"

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
export const selectOpenMovementId = createSelector(
  selectRoutinesState,
  state => state.openMovementId
)

export const selectRoutineId = createSelector(selectRoutine, routine => routine?.id)

export const selectMovementById = (state: RootState, id: IDType) => {
  const movement = state.routines.selected?.movements.find(m => m.id === id)
  return movement
}
