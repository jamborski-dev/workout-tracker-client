import { Routine } from "@root/types/data"

export interface RoutinesState {
  list: Routine[]
  selected?: Routine
  openMovementId?: number
  showActualReps: boolean
  isLoading: boolean
  isUpdating: boolean
  error: string | null
}
