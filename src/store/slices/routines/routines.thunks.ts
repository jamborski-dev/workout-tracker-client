import {
  createRoutine,
  deleteRoutine,
  updateRoutine,
  getAllRoutines,
  getOneRoutine,
  initRoutine
} from "@root/services/routines.service"
import {
  CreateRoutinePayload,
  GetAllRoutinesPayload,
  GetOneRoutinePayload,
  InitRoutinePayload,
  InitRoutineServiceReturn,
  Routine,
  UpdateRoutinePayload
} from "@root/types/data"
import { createAsyncThunkWithHandler } from "@root/utils/store"

export const getAllRoutinesAction = createAsyncThunkWithHandler<Routine[], GetAllRoutinesPayload>(
  "routines/getAll",
  getAllRoutines
)

export const getOneRoutineAction = createAsyncThunkWithHandler<Routine, GetOneRoutinePayload>(
  "routines/getOne",
  getOneRoutine
)

export const initRoutineAction = createAsyncThunkWithHandler<
  InitRoutineServiceReturn,
  InitRoutinePayload
>("routines/init", initRoutine)

export const createRoutineAction = createAsyncThunkWithHandler<Routine, CreateRoutinePayload>(
  "routines/create",
  createRoutine
)

export const updateRoutineAction = createAsyncThunkWithHandler<Routine, UpdateRoutinePayload>(
  "routines/update",
  updateRoutine
)

export const deleteRoutineAction = createAsyncThunkWithHandler<Routine, string>(
  "routines/delete",
  deleteRoutine
)
