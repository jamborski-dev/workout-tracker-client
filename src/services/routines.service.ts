import {
  CreateRoutinePayload,
  GetAllRoutinesPayload,
  GetOneRoutinePayload,
  InitRoutinePayload,
  Routine,
  UpdateRoutinePayload,
  InitRoutineServiceReturn
} from "@root/types/data"
import { buildUserEndpointPath, serviceCall } from "@root/utils/service"

export const getAllRoutines = async (payload: GetAllRoutinesPayload) => {
  const { userId } = payload
  const path = `${buildUserEndpointPath({ userId })}/routines`
  return await serviceCall<undefined, Routine[]>(undefined, "get", path, "Error fetching routines")
}

export const getOneRoutine = async (payload: GetOneRoutinePayload) => {
  const { userId, routineId } = payload
  const path = `${buildUserEndpointPath({ userId, routineId })}`
  return await serviceCall<undefined, Routine>(undefined, "get", path, "Error fetching routine")
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
export const createRoutine = async (routine: CreateRoutinePayload) => {
  return await serviceCall<CreateRoutinePayload, Routine>(
    routine,
    "post",
    "/routines",
    "Error creating routine:"
  )
}

export const updateRoutine = async (updatePayload: UpdateRoutinePayload) => {
  return await serviceCall<UpdateRoutinePayload, Routine>(
    updatePayload,
    "patch",
    `/routines/${updatePayload.id}`,
    "Error editing routine"
  )
}

export const deleteRoutine = async (routineId: string) => {
  return await serviceCall<undefined, Routine>(
    undefined,
    "delete",
    `/routines/${routineId}`,
    "Error deleting routine"
  )
}
