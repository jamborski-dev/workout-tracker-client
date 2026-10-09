export type IDType = number | string

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
  routineTypeId?: IDType
  routineType?: string | RoutineType
  notes?: string
  movements: Movement[]
}

export type DBRoutine = MetaData & Routine

export type RoutineType = {
  id: IDType
  name: string
  // Exercise categories that suit this workout, most relevant first
  categories?: string[]
}

export type CreateRoutineTypeDto = {
  name: string
}

export type UpdateRoutineTypeDto = {
  name?: string
}

export type GetRoutineByIdPayload = { routineId: IDType }

export type UpdateRoutineActionPayload = {
  routineId: IDType
  payload: UpdateRoutineServicePayload
}
export type UpdateRoutineServicePayload = Partial<Omit<DBRoutine, MetaDataKeys>>

export type InitRoutineServiceReturn = { id: IDType }

// Everything optional: the server falls back to defaults
export type InitRoutinePayload = {
  name?: string
  date?: string
  routineTypeId?: IDType
}

export type DeleteRoutineActionPayload = { routineId: IDType }

export interface MovementSet {
  id: IDType
  order: number
  summary?: string
  movementId?: IDType
  actualReps?: number
  actualWeight?: number
  plannedReps?: number
  plannedWeight?: number
  isWU?: boolean
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
  category?: string | null
  complexity?: string | null
  equipment?: string | null
  favourite?: boolean
  // Library state (set by the server)
  visibility?: "PRIVATE" | "PUBLIC"
  reviewStatus?: "NONE" | "PENDING" | "APPROVED" | "REJECTED"
  reviewNote?: string | null
  isMine?: boolean
  isBase?: boolean
}

export type DBExercise = MetaData & Exercise

// Actions
export type CreateExercisePayload = Omit<Exercise, MetaDataKeys>
export type UpdateExercisePayload = Omit<Exercise, MetaDataKeys> & { id: IDType }

// Service

// MOVEMENTS

// Actions

export type AddMovementActionPayload = {
  routineId: IDType
  order: number
}

export type DeleteMovementActionPayload = {
  routineId: IDType
  movementId: IDType
}

export type UpdateMovementActionPayload = {
  routineId: IDType
  movementId: IDType
  payload: UpdateMovementServicePayload
}

export type UpdateMovementServicePayload = Partial<Omit<Movement, MetaDataKeys>>

export type UpdateManyMovementsActionPayload = {
  routineId: IDType
  payload: UpdateMovementServicePayload[]
}

export type UpdateManyMovementsServicePayload = {
  payload: UpdateMovementServicePayload[]
}

// Sets
export type AddSetActionPayload = {
  routineId: IDType
  movementId: IDType
  order: number
}
export type AddSetServicePayload = Pick<MovementSet, "order">

export type RemoveSetActionPayload = {
  routineId: IDType
  movementId: IDType
  setId: IDType
}
export type RemoveSetServicePayload = Pick<RemoveSetActionPayload, "setId">

export type UpdateSetActionPayload = {
  routineId: IDType
  movementId: IDType
  setId: IDType
  payload: UpdateSetServicePayload
}
export type UpdateSetServicePayload = Partial<Omit<MovementSet, MetaDataKeys | "movementId">>

export type UpdateManySetsActionPayload = {
  routineId: IDType
  movementId: IDType
  payload: UpdateManySetsServicePayload
}
export type UpdateManySetsServicePayload = {
  summary: MovementSummary
  sets: Partial<Omit<MovementSet, MetaDataKeys | "movementId">>[]
}

export type MovementSummary = string
