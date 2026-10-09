import type { RoutineType } from "@root/types/data"

export interface RoutineTypesState {
  list: RoutineType[]
  current?: RoutineType
  isLoading: boolean
  isUpdating: boolean
  error: string | null
}
