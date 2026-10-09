import {
  createRoutineType,
  deleteRoutineType,
  getAllRoutineTypes,
  getRoutineTypeById,
  updateRoutineType
} from "@root/services/routine-types.service"
import type {
  CreateRoutineTypeDto,
  IDType,
  RoutineType,
  UpdateRoutineTypeDto
} from "@root/types/data"
import { createThunk } from "@root/utils/store"

export const getAllRoutineTypesAction = createThunk<undefined, RoutineType[]>(
  "routineTypes/getAll",
  getAllRoutineTypes
)

export const getRoutineTypeByIdAction = createThunk<{ routineTypeId: IDType }, RoutineType>(
  "routineTypes/getOne",
  getRoutineTypeById
)

export const createRoutineTypeAction = createThunk<CreateRoutineTypeDto, { id: IDType }>(
  "routineTypes/create",
  createRoutineType
)

export const updateRoutineTypeAction = createThunk<
  { routineTypeId: IDType; payload: UpdateRoutineTypeDto },
  RoutineType
>("routineTypes/update", updateRoutineType)

export const deleteRoutineTypeAction = createThunk<{ routineTypeId: IDType }, undefined>(
  "routineTypes/delete",
  deleteRoutineType
)
