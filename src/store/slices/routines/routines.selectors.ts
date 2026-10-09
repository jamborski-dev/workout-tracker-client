import { createSelector } from "@reduxjs/toolkit"
import type { IDType } from "@root/types/data"

import type { RootState } from "@store/store"

const selectRoutinesState = (state: RootState) => state.routines

export const selectList = createSelector(selectRoutinesState, state =>
  [...state.list].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
)
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

const NO_CATEGORIES: string[] = []

// Exercise categories that suit the open routine's workout type, most relevant first
export const selectPreferredCategories = (state: RootState): string[] => {
  const routine = state.routines.selected
  if (!routine) return NO_CATEGORIES

  const typeId = routine.routineTypeId
  const fromList = state.routineTypes.list.find(type => `${type.id}` === `${typeId}`)
  const inline = typeof routine.routineType === "object" ? routine.routineType : undefined

  return fromList?.categories ?? inline?.categories ?? NO_CATEGORIES
}
