import type {
  CreateRoutineTypeDto,
  IDType,
  RoutineType,
  UpdateRoutineTypeDto
} from "@root/types/data"
import { secureServiceCall } from "@root/utils/service"

export const getAllRoutineTypes = async () => {
  return await secureServiceCall<undefined, RoutineType[]>({
    method: "get",
    path: "/fit/routine-types",
    errorMessage: "Failed to fetch routine types"
  })
}

export const getRoutineTypeById = async (params: { routineTypeId: IDType }) => {
  const { routineTypeId } = params
  return await secureServiceCall<undefined, RoutineType>({
    method: "get",
    path: `/fit/routine-types/${routineTypeId}`,
    errorMessage: "Failed to fetch routine type"
  })
}

export const createRoutineType = async (params: CreateRoutineTypeDto) => {
  return await secureServiceCall<CreateRoutineTypeDto, { id: IDType }>({
    method: "post",
    path: "/fit/routine-types",
    params,
    errorMessage: "Failed to create routine type"
  })
}

export const updateRoutineType = async (params: {
  routineTypeId: IDType
  payload: UpdateRoutineTypeDto
}) => {
  const { routineTypeId, payload } = params
  return await secureServiceCall<UpdateRoutineTypeDto, RoutineType>({
    method: "patch",
    path: `/fit/routine-types/${routineTypeId}`,
    params: payload,
    errorMessage: "Failed to update routine type"
  })
}

export const deleteRoutineType = async (params: { routineTypeId: IDType }) => {
  const { routineTypeId } = params
  return await secureServiceCall<undefined, undefined>({
    method: "delete",
    path: `/fit/routine-types/${routineTypeId}`,
    errorMessage: "Failed to delete routine type"
  })
}
