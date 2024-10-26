import {
  createRoutine,
  deleteRoutine,
  updateRoutine,
  getAllRoutines,
  getRoutineById,
  initRoutine,
  addMovement,
  removeMovement,
  updateMovement,
  addSet,
  removeSet,
  patchSet,
  patchManySets
} from "@root/services/routines.service"
import {
  AddMovementActionPayload,
  AddSetActionPayload,
  CreateRoutinePayload,
  GetAllRoutinesPayload,
  GetRoutineByIdPayload,
  InitRoutinePayload,
  InitRoutineServiceReturn,
  MovementSet,
  RemoveMovementActionPayload,
  RemoveSetActionPayload,
  Routine,
  UpdateManySetsActionPayload,
  UpdateMovementActionPayload,
  UpdateRoutineActionPayload,
  UpdateSetActionPayload
} from "@root/types/data"
import { createAsyncThunkWithHandler } from "@root/utils/store"

export const getAllRoutinesAction = createAsyncThunkWithHandler<GetAllRoutinesPayload, Routine[]>(
  "routines/thunk/getAll",
  getAllRoutines
)

export const getRoutineByIdAction = createAsyncThunkWithHandler<GetRoutineByIdPayload, Routine>(
  "routines/thunk/getOne",
  getRoutineById
)

export const initRoutineAction = createAsyncThunkWithHandler<
  InitRoutinePayload,
  InitRoutineServiceReturn
>("routines/thunk/init", initRoutine)

export const createRoutineAction = createAsyncThunkWithHandler<CreateRoutinePayload, Routine>(
  "routines/thunk/create",
  createRoutine
)

export const updateRoutineAction = createAsyncThunkWithHandler<UpdateRoutineActionPayload, Routine>(
  "routines/thunk/update",
  updateRoutine
)

export const deleteRoutineAction = createAsyncThunkWithHandler<string, Routine>(
  "routines/thunk/delete",
  deleteRoutine
)

// partial updates
// Movements
export const addMovementAction = createAsyncThunkWithHandler<AddMovementActionPayload, Routine>(
  "routines/thunk/addMovement",
  addMovement
)

export const removeMovementAction = createAsyncThunkWithHandler<RemoveMovementActionPayload>(
  "routines/thunk/removeMovement",
  removeMovement
)

export const updateMovementAction = createAsyncThunkWithHandler<
  UpdateMovementActionPayload,
  Routine
>("routines/thunk/updateMovement", updateMovement)

// Sets
export const addSetAction = createAsyncThunkWithHandler<AddSetActionPayload, MovementSet>(
  "routines/thunk/addSet",
  addSet
)

export const removeSetAction = createAsyncThunkWithHandler<RemoveSetActionPayload>(
  "routines/thunk/removeSet",
  removeSet
)

export const updateSetAction = createAsyncThunkWithHandler<UpdateSetActionPayload, MovementSet>(
  "routines/thunk/updateSet",
  patchSet
)

export const updateManySetsAction = createAsyncThunkWithHandler<
  UpdateManySetsActionPayload,
  MovementSet[]
>("routines/thunk/patchManySets", patchManySets)
