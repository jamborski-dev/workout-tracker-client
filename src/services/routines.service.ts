import {
  GetRoutineByIdPayload,
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
import { secureServiceCall } from "@root/utils/service"

export const getAllRoutines = () => {
  return secureServiceCall<undefined, Routine[]>({
    method: "get",
    path: `/fit/routines`,
    errorMessage: "Error fetching routines"
  })
}

export const getRoutineById = async (payload: GetRoutineByIdPayload) => {
  const { routineId } = payload
  return await secureServiceCall<undefined, Routine>({
    method: "get",
    path: `/fit/routines/${routineId}`,
    errorMessage: "Error fetching routine"
  })
}

export const initRoutine = async () => {
  return await secureServiceCall<undefined, InitRoutineServiceReturn>({
    method: "post",
    path: `/fit/routines/init`,
    errorMessage: "Error fetching routines"
  })
}

export const updateRoutine = async (updatePayload: UpdateRoutineActionPayload) => {
  const { routineId, payload } = updatePayload
  return await secureServiceCall<UpdateRoutineServicePayload, Routine>({
    params: payload,
    method: "patch",
    path: `/fit/routines/${routineId}`,
    errorMessage: "Error editing routine"
  })
}

export const deleteRoutine = async (params: DeleteRoutineActionPayload) => {
  const { routineId } = params
  return await secureServiceCall<undefined, never>({
    method: "delete",
    path: `//fit/routines/${routineId}`,
    errorMessage: "Error deleting routine"
  })
}

export const addMovement = async (params: AddMovementActionPayload) => {
  const { routineId, order } = params
  return await secureServiceCall<Pick<AddMovementActionPayload, "order">, Routine>({
    params: { order },
    method: "post",
    path: `/fit/routines/${routineId}/movements`,
    errorMessage: "Error adding movement"
  })
}

// todo rename to deleteMovement
export const deleteMovement = async (params: DeleteMovementActionPayload) => {
  const { routineId, movementId } = params
  return await secureServiceCall<undefined, never>({
    method: "delete",
    path: `/fit/routines/${routineId}/movements/${movementId}`,
    errorMessage: "Error removing movement"
  })
}

// rename to patchMovement
export const updateMovement = async (params: UpdateMovementActionPayload) => {
  const { routineId, movementId, payload } = params
  return await secureServiceCall<UpdateMovementServicePayload, Movement>({
    params: payload,
    method: "patch",
    path: `/fit/routines/${routineId}/movements/${movementId}`,
    errorMessage: "Error updating movement"
  })
}

export const updateManyMovements = async (params: UpdateManyMovementsActionPayload) => {
  const { routineId, payload } = params
  return await secureServiceCall<UpdateManyMovementsServicePayload, Movement[]>({
    params: { payload },
    method: "patch",
    path: `/fit/routines/${routineId}/movements`,
    errorMessage: "Error updating movements"
  })
}

// Sets
// rename to postSet
export const addSet = async (params: AddSetActionPayload) => {
  const { routineId, movementId, order } = params
  return await secureServiceCall<AddSetServicePayload, MovementSet>({
    params: { order },
    method: "post",
    path: `/fit/routines/${routineId}/movements/${movementId}/sets`,
    errorMessage: "Error adding set"
  })
}

// todo rename to deleteSet
export const removeSet = async (params: RemoveSetActionPayload) => {
  const { routineId, movementId, setId } = params
  return await secureServiceCall<undefined, { movementId: IDType; setId: IDType }>({
    method: "delete",
    path: `/fit/routines/${routineId}/movements/${movementId}/sets/${setId}`,
    errorMessage: "Error removing set"
  })
}

export const patchSet = async (params: UpdateSetActionPayload) => {
  const { routineId, movementId, setId, payload } = params
  return await secureServiceCall<UpdateSetServicePayload, MovementSet>({
    params: payload,
    method: "patch",
    path: `/fit/routines/${routineId}/movements/${movementId}/sets/${setId}`,
    errorMessage: "Error updating set"
  })
}

export const patchManySets = async (params: UpdateManySetsActionPayload) => {
  const { routineId, movementId, payload } = params

  return await secureServiceCall<UpdateManySetsServicePayload, MovementSet[]>({
    params: payload,
    method: "patch",
    path: `/fit/routines/${routineId}/movements/${movementId}/sets`,
    errorMessage: "Error updating sets"
  })
}
