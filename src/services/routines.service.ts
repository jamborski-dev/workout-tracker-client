import {
  CreateRoutinePayload,
  GetAllRoutinesPayload,
  GetRoutineByIdPayload,
  InitRoutinePayload,
  Routine,
  InitRoutineServiceReturn,
  AddMovementActionPayload,
  UpdateMovementServicePayload,
  UpdateMovementActionPayload,
  RemoveMovementActionPayload,
  AddSetServicePayload,
  AddSetActionPayload,
  MovementSet,
  RemoveSetActionPayload,
  UpdateSetActionPayload,
  UpdateSetServicePayload,
  UpdateManySetsActionPayload,
  UpdateManySetsServicePayload,
  UpdateRoutineServicePayload,
  UpdateRoutineActionPayload
} from "@root/types/data"
import { buildUserEndpointPath, serviceCall } from "@root/utils/service"

export const getAllRoutines = async (payload: GetAllRoutinesPayload) => {
  const { userId } = payload
  const path = `${buildUserEndpointPath({ userId })}/routines`
  return await serviceCall<undefined, Routine[]>(
    undefined as never,
    "get",
    path,
    "Error fetching routines"
  )
}

export const getRoutineById = async (payload: GetRoutineByIdPayload) => {
  const { userId, routineId } = payload
  const path = `${buildUserEndpointPath({ userId, routineId })}`
  return await serviceCall<undefined, Routine>(
    undefined as never,
    "get",
    path,
    "Error fetching routine"
  )
}

// create new routine and return its ID
export const initRoutine = async (payload: InitRoutinePayload) => {
  const { userId } = payload
  const path = `${buildUserEndpointPath({ userId })}/routines/init`
  return await serviceCall<Omit<InitRoutinePayload, "userId">, InitRoutineServiceReturn>(
    payload,
    "post",
    path,
    "Error fetching routines"
  )
}

// This could be repurposed to create a new routine template
// rename to postRoutine
export const createRoutine = async (routine: CreateRoutinePayload) => {
  return await serviceCall<CreateRoutinePayload, Routine>(
    routine,
    "post",
    "/routines",
    "Error creating routine:"
  )
}

// for metadata updates
// rename to patchRoutine
export const updateRoutine = async (updatePayload: UpdateRoutineActionPayload) => {
  const { userId, routineId, payload } = updatePayload
  return await serviceCall<UpdateRoutineServicePayload, Routine>(
    payload,
    "patch",
    `users/${userId}/routines/${routineId}`,
    "Error editing routine"
  )
}

// delete routine
export const deleteRoutine = async (routineId: string) => {
  return await serviceCall<undefined, Routine>(
    undefined as never,
    "delete",
    `/routines/${routineId}`,
    "Error deleting routine"
  )
}

// partial updates

// should return just ID for new movement
// rename to postMovement
export const addMovement = async (params: AddMovementActionPayload) => {
  const { routineId, userId } = params
  return await serviceCall<undefined, Routine>(
    undefined as never,
    "post",
    `users/${userId}/routines/${routineId}/movements`,
    "Error adding movement",
    true
  )
}

// todo rename to deleteMovement
export const removeMovement = async (params: RemoveMovementActionPayload) => {
  const { routineId, userId, movementId } = params
  return await serviceCall(
    undefined as never,
    "delete",
    `users/${userId}/routines/${routineId}/movements/${movementId}`,
    "Error removing movement"
  )
}

// rename to patchMovement
export const updateMovement = async (params: UpdateMovementActionPayload) => {
  const { routineId, userId, movementId, payload } = params
  return await serviceCall<UpdateMovementServicePayload, Routine>(
    payload,
    "patch",
    `users/${userId}/routines/${routineId}/movements/${movementId}`,
    "Error updating movement"
  )
}

// Sets
// rename to postSet
export const addSet = async (params: AddSetActionPayload) => {
  const { userId, routineId, movementId, order } = params
  return await serviceCall<AddSetServicePayload, MovementSet>(
    { order },
    "post",
    `users/${userId}/routines/${routineId}/movements/${movementId}/sets`,
    "Error adding set"
  )
}

// todo rename to deleteSet
export const removeSet = async (params: RemoveSetActionPayload) => {
  const { userId, routineId, movementId, setId } = params
  return await serviceCall(
    undefined as never,
    "delete",
    `users/${userId}/routines/${routineId}/movements/${movementId}/sets/${setId}`,
    "Error removing set"
  )
}

export const patchSet = async (params: UpdateSetActionPayload) => {
  const { userId, routineId, movementId, setId, payload } = params
  return await serviceCall<UpdateSetServicePayload, MovementSet>(
    payload,
    "patch",
    `users/${userId}/routines/${routineId}/movements/${movementId}/sets/${setId}`,
    "Error updating set"
  )
}

export const patchManySets = async (params: UpdateManySetsActionPayload) => {
  const { userId, routineId, movementId, payload } = params

  return await serviceCall<UpdateManySetsServicePayload, MovementSet[]>(
    payload,
    "patch",
    `users/${userId}/routines/${routineId}/movements/${movementId}/sets`,
    "Error updating sets"
  )
}
