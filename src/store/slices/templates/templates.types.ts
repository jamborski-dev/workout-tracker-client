import type { RoutineTemplate } from "@root/types/data"

export interface TemplatesState {
  list: RoutineTemplate[]
  isLoading: boolean
  error: string | null
}
