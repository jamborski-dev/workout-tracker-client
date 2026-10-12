import type { IDType } from "@root/types/data"

export type GridSet = {
  id: IDType
  plannedReps?: number | null
  plannedWeight?: number | null
  actualReps?: number | null
  actualWeight?: number | null
  completed?: boolean
  isWarmup?: boolean
}

export type CellKind = "Reps" | "Weight"
export type CellSide = "planned" | "actual"
export type ActiveCell = { setId: IDType; kind: CellKind; side: CellSide }

export type GridChange = (setId: IDType, field: string, value: number | boolean | null) => void
