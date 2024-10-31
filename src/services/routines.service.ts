import {
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
  UpdateRoutineActionPayload,
  Movement,
  IDType,
  DeleteRoutineActionPayload
} from "@root/types/data"
import { buildEndpointPath, serviceCall, secureServiceCall } from "@root/utils/service"

// ✅ Done
export const getAllRoutines = (payload: GetAllRoutinesPayload) => {
  const { userId, accessToken } = payload
  const path = `${buildEndpointPath({ userId })}/routines`
  return secureServiceCall<undefined, Routine[]>({
    method: "get",
    path,
    errorMessage: "Error fetching routines",
    accessToken
  })
}

// ✅ Done
export const getRoutineById = async (payload: GetRoutineByIdPayload) => {
  const { userId, routineId, accessToken } = payload
  const path = buildEndpointPath({ userId, routineId })
  return await secureServiceCall<undefined, Routine>({
    method: "get",
    path,
    errorMessage: "Error fetching routine",
    accessToken
  })
}

// create new routine and return its ID
export const initRoutine = async (payload: InitRoutinePayload) => {
  const { userId, accessToken } = payload
  return await secureServiceCall<undefined, InitRoutineServiceReturn>({
    method: "post",
    path: `users/${userId}/routines/init`,
    errorMessage: "Error fetching routines",
    accessToken
  })
}

// for metadata updates
// rename to patchRoutine
export const updateRoutine = async (updatePayload: UpdateRoutineActionPayload) => {
  const { userId, routineId, payload, accessToken } = updatePayload
  return await secureServiceCall<UpdateRoutineServicePayload, Routine>({
    params: payload,
    method: "patch",
    path: `users/${userId}/routines/${routineId}`,
    errorMessage: "Error editing routine",
    accessToken
  })
}

// delete routine
export const deleteRoutine = async (params: DeleteRoutineActionPayload) => {
  const { userId, routineId, accessToken } = params
  return await secureServiceCall<undefined, never>({
    method: "delete",
    path: `/users/${userId}/routines/${routineId}`,
    errorMessage: "Error deleting routine",
    accessToken
  })
}

// partial updates

// should return just ID for new movement
// rename to postMovement
export const addMovement = async (params: AddMovementActionPayload) => {
  const { routineId, userId, order, accessToken } = params
  return await secureServiceCall<Pick<AddMovementActionPayload, "order">, Routine>({
    params: { order },
    method: "post",
    path: `users/${userId}/routines/${routineId}/movements`,
    errorMessage: "Error adding movement",
    accessToken
  })
}

// todo rename to deleteMovement
export const removeMovement = async (params: RemoveMovementActionPayload) => {
  const { routineId, userId, movementId, accessToken } = params
  return await secureServiceCall<undefined, never>({
    method: "delete",
    path: `users/${userId}/routines/${routineId}/movements/${movementId}`,
    errorMessage: "Error removing movement",
    accessToken
  })
}

// rename to patchMovement
export const updateMovement = async (params: UpdateMovementActionPayload) => {
  const { routineId, userId, movementId, accessToken, payload } = params
  return await secureServiceCall<UpdateMovementServicePayload, Movement>({
    params: payload,
    method: "patch",
    path: `users/${userId}/routines/${routineId}/movements/${movementId}`,
    errorMessage: "Error updating movement",
    accessToken
  })
}

export type UpdateManyMovementsActionPayload = {
  userId: IDType
  routineId: IDType
  payload: UpdateMovementServicePayload[]
}

export type UpdateManyMovementsServicePayload = {
  payload: UpdateMovementServicePayload[]
}

export const updateManyMovements = async (params: UpdateManyMovementsActionPayload) => {
  const { userId, routineId, payload } = params
  return await serviceCall<UpdateManyMovementsServicePayload, Movement[]>(
    { payload },
    "patch",
    `users/${userId}/routines/${routineId}/movements`,
    "Error updating movements"
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
