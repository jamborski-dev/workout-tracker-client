import { Routine } from "@root/types/data"

export interface RoutinesState {
  routines: Routine[]
  currentRoutine?: Routine
  form: {
    updateValues?: Routine
    mode: "add" | "edit"
  }
  isLoading: boolean
  isUpdating: boolean
  error: string | null
}
