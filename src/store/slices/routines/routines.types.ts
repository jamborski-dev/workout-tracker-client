import { Routine } from "@root/types/data"

export interface RoutinesState {
  list: Routine[]
  selected?: Routine
  openMovementId?: number
  showActualReps: boolean
  // Movements with local edits not yet confirmed saved to the server (survive reloads)
  dirtyMovementIds: (number | string)[]
  // User the persisted copy belongs to; cleared when a different user signs in
  ownerUserId?: string
  isLoading: boolean
  isUpdating: boolean
  error: string | null
}
