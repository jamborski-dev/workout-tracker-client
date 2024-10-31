// import { User } from "@root/store/slices/users/users.slice"
// import { FixMeLater } from "./FixMeLater"

export type IDType = number | string

export type AccessToken = string | null
export type WithAuth = { accessToken: AccessToken }

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
  id: IDType
  createdAt: string
  updatedAt: string
}

export type MetaDataKeys = keyof MetaData

export type Routine = {
  id: IDType
  date: string
  userId: IDType
  name: string
  notes?: string
  movements: Movement[]
}

export type DBRoutine = MetaData & Routine

export type GetAllRoutinesPayload = { userId: IDType } & WithAuth
export type GetRoutineByIdPayload = { userId: IDType; routineId: IDType } & WithAuth

export type UpdateRoutineActionPayload = {
  userId: IDType
  routineId: IDType
  payload: UpdateRoutineServicePayload
} & WithAuth
export type UpdateRoutineServicePayload = Partial<Omit<DBRoutine, MetaDataKeys>>

export type InitRoutinePayload = { userId: IDType } & WithAuth
export type InitRoutineServiceReturn = { id: IDType }

export type DeleteRoutineActionPayload = { userId: IDType; routineId: IDType } & WithAuth

export interface MovementSet {
  id: IDType
  order: number
  summary?: string
  movementId?: IDType
  actualReps?: number
  actualWeight?: number
  plannedReps?: number
  plannedWeight?: number
}

export interface Movement {
  id: IDType
  order: number
  routineId?: IDType | null
  exerciseId?: number | null
  summary?: MovementSummary
  notes?: string | null
  sets: MovementSet[]
}

// EXERCISES
export type Exercise = {
  id: IDType
  name: string
  description: string
  muscleGroup: string
}

export type DBExercise = MetaData & Exercise

// Actions
export type GetAllExercisesPayload = { userId: IDType }
export type CreateExercisePayload = Omit<Exercise, MetaDataKeys>
export type UpdateExercisePayload = Omit<Exercise, MetaDataKeys> & { id: IDType }

// Service

// MOVEMENTS

// Actions

export type AddMovementActionPayload = {
  routineId: IDType
  userId: IDType
  order: number
} & WithAuth

export type RemoveMovementActionPayload = {
  routineId: IDType
  userId: IDType
  movementId: IDType
} & WithAuth

export type UpdateMovementActionPayload = {
  userId: IDType
  routineId: IDType
  movementId: IDType
  payload: UpdateMovementServicePayload
} & WithAuth

export type UpdateMovementServicePayload = Partial<Omit<Movement, MetaDataKeys>>

// Sets
export type AddSetActionPayload = {
  userId: IDType
  routineId: IDType
  movementId: IDType
  order: number
}
export type AddSetServicePayload = Pick<MovementSet, "order">

export type RemoveSetActionPayload = {
  userId: IDType
  routineId: IDType
  movementId: IDType
  setId: IDType
}
export type RemoveSetServicePayload = Pick<RemoveSetActionPayload, "setId">

export type UpdateSetActionPayload = {
  userId: IDType
  routineId: IDType
  movementId: IDType
  setId: IDType
  payload: UpdateSetServicePayload
}
export type UpdateSetServicePayload = Partial<Omit<MovementSet, MetaDataKeys | "movementId">>

export type UpdateManySetsActionPayload = {
  userId: IDType
  routineId: IDType
  movementId: IDType
  payload: UpdateManySetsServicePayload
}
export type UpdateManySetsServicePayload = {
  summary: MovementSummary
  sets: Partial<Omit<MovementSet, MetaDataKeys | "movementId">>[]
}

export type MovementSummary = string
