import {
  GetAllRoutinesPayload,
  GetRoutineByIdPayload,
  InitRoutinePayload,
  Routine,
  InitRoutineServiceReturn,
  AddMovementActionPayload,
  UpdateMovementServicePayload,
  UpdateMovementActionPayload,
  DeleteMovementActionPayload,
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
  DeleteRoutineActionPayload,
  UpdateManyMovementsActionPayload,
  UpdateManyMovementsServicePayload,
  IDType
} from "@root/types/data"
import { buildEndpointPath, secureServiceCall } from "@root/utils/service"

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

export const initRoutine = async (payload: InitRoutinePayload) => {
  const { userId, accessToken } = payload
  return await secureServiceCall<undefined, InitRoutineServiceReturn>({
    method: "post",
    path: `users/${userId}/routines/init`,
    errorMessage: "Error fetching routines",
    accessToken
  })
}

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

export const deleteRoutine = async (params: DeleteRoutineActionPayload) => {
  const { userId, routineId, accessToken } = params
  return await secureServiceCall<undefined, never>({
    method: "delete",
    path: `/users/${userId}/routines/${routineId}`,
    errorMessage: "Error deleting routine",
    accessToken
  })
}

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
export const deleteMovement = async (params: DeleteMovementActionPayload) => {
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

export const updateManyMovements = async (params: UpdateManyMovementsActionPayload) => {
  const { userId, routineId, payload, accessToken } = params
  return await secureServiceCall<UpdateManyMovementsServicePayload, Movement[]>({
    params: { payload },
    method: "patch",
    path: `users/${userId}/routines/${routineId}/movements`,
    errorMessage: "Error updating movements",
    accessToken
  })
}

// Sets
// rename to postSet
export const addSet = async (params: AddSetActionPayload) => {
  const { userId, routineId, movementId, order, accessToken } = params
  return await secureServiceCall<AddSetServicePayload, MovementSet>({
    params: { order },
    method: "post",
    path: `users/${userId}/routines/${routineId}/movements/${movementId}/sets`,
    errorMessage: "Error adding set",
    accessToken
  })
}

// todo rename to deleteSet
export const removeSet = async (params: RemoveSetActionPayload) => {
  const { userId, routineId, movementId, setId, accessToken } = params
  return await secureServiceCall<undefined, { movementId: IDType; setId: IDType }>({
    method: "delete",
    path: `users/${userId}/routines/${routineId}/movements/${movementId}/sets/${setId}`,
    errorMessage: "Error removing set",
    accessToken
  })
}

export const patchSet = async (params: UpdateSetActionPayload) => {
  const { userId, routineId, movementId, setId, payload, accessToken } = params
  return await secureServiceCall<UpdateSetServicePayload, MovementSet>({
    params: payload,
    method: "patch",
    path: `users/${userId}/routines/${routineId}/movements/${movementId}/sets/${setId}`,
    errorMessage: "Error updating set",
    accessToken
  })
}

export const patchManySets = async (params: UpdateManySetsActionPayload) => {
  const { userId, routineId, movementId, payload, accessToken } = params

  return await secureServiceCall<UpdateManySetsServicePayload, MovementSet[]>({
    params: payload,
    method: "patch",
    path: `users/${userId}/routines/${routineId}/movements/${movementId}/sets`,
    errorMessage: "Error updating sets",
    accessToken
  })
}
