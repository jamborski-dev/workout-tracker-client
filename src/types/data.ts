// import { User } from "@root/store/slices/users/users.slice"
// import { FixMeLater } from "./FixMeLater"

export type ErrorPayload = {
  message: string
  status: number
  code: string
}

export type Alert = {
  message: string | JSX.Element
  severity: "error" | "warning" | "info"
}

type MetaData = {
  id: string
  createdAt: string
  updatedAt: string
}

export type MetaDataKeys = keyof MetaData

export type Routine = MetaData & {
  date: string
  userId: string
  name: string
  notes?: string
  movements: Movement[]
}

export type GetAllRoutinesPayload = { userId: string }
export type GetOneRoutinePayload = { userId: string; routineId: string }
export type CreateRoutinePayload = Omit<Routine, MetaDataKeys>
export type UpdateRoutinePayload = Omit<Routine, MetaDataKeys> & { id: string }

export type InitRoutinePayload = { userId: string; date?: string }
export type InitRoutineServiceReturn = { id: string }

export interface MovementSet {
  plannedReps: number
  plannedWeight: number
}

export interface Movement {
  exerciseId: string
  sets: MovementSet[]
}

export type Exercise = MetaData & {
  name: string
  description: string
}

export type GetAllExercisesPayload = { userId: string }
export type CreateExercisePayload = Omit<Exercise, MetaDataKeys>
export type UpdateExercisePayload = Omit<Exercise, MetaDataKeys> & { id: string }
