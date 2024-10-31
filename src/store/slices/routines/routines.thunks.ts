import { createAsyncThunk } from "@reduxjs/toolkit"
import {
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
  patchManySets,
  updateManyMovements
} from "@root/services/routines.service"
import {
  AddMovementActionPayload,
  AddSetActionPayload,
  DeleteRoutineActionPayload,
  GetRoutineByIdPayload,
  IDType,
  InitRoutineServiceReturn,
  Movement,
  MovementSet,
  RemoveMovementActionPayload,
  RemoveSetActionPayload,
  Routine,
  UpdateManySetsActionPayload,
  UpdateMovementActionPayload,
  UpdateRoutineActionPayload,
  UpdateSetActionPayload
} from "@root/types/data"
import {
  createAsyncThunkWithHandler,
  createThunk,
  getErrorMessage,
  wrapSelector
} from "@root/utils/store"
import { RootState } from "@root/store/store"
import { resetTimer } from "@store/slices/app/app.slice"
import { FixMeLater } from "@root/types/FixMeLater"
import { selectRoutineId } from "./routines.selectors"

// Routines

export const getAllRoutinesAction = createThunk<undefined, Routine[]>(
  "routines/thunk/getAll",
  getAllRoutines
)

export const getRoutineByIdAction = createThunk<Pick<GetRoutineByIdPayload, "routineId">, Routine>(
  "routines/thunk/getOne",
  getRoutineById
)

export const initRoutineAction = createThunk<undefined, InitRoutineServiceReturn>(
  "routines/thunk/init",
  initRoutine
)

export const updateRoutineAction = createThunk<
  Pick<UpdateRoutineActionPayload, "payload">,
  Routine,
  Pick<UpdateRoutineActionPayload, "routineId">
>("routines/thunk/update", updateRoutine, [wrapSelector(selectRoutineId, "routineId")])

export const deleteRoutineAction = createThunk<
  Pick<DeleteRoutineActionPayload, "routineId">,
  Routine,
  Pick<DeleteRoutineActionPayload, "routineId">
>("routines/thunk/delete", deleteRoutine)

// Movements

export const addMovementAction = createThunk<
  Pick<AddMovementActionPayload, "order">,
  Routine,
  Pick<AddMovementActionPayload, "routineId">
>("routines/thunk/addMovement", addMovement, [wrapSelector(selectRoutineId, "routineId")])

export const removeMovementAction = createThunk<
  Pick<RemoveMovementActionPayload, "movementId">,
  undefined,
  Pick<RemoveMovementActionPayload, "routineId" | "movementId">
>("routines/thunk/removeMovement", removeMovement, [wrapSelector(selectRoutineId, "routineId")])

// All above done ✅

// TODO: refactor below to use authed calls
export const updateMovementAction = createAsyncThunkWithHandler<
  UpdateMovementActionPayload,
  Movement
>("routines/thunk/updateMovement", updateMovement)

export const saveMovementAction = createAsyncThunk<
  Movement,
  IDType,
  { state: RootState; rejectValue: string }
>("routines/thunk/saveMovement", async (id: IDType, { getState, dispatch, rejectWithValue }) => {
  try {
    const movement = getState().routines.selected!.movements.find(m => m.id === id)
    const result = await updateMovement({
      userId: 1,
      routineId: 1,
      movementId: id,
      payload: { ...movement },
      accessToken: getState().auth.accessToken
    })
    return result
  } catch (error) {
    const errorMessage = getErrorMessage(error)
    return rejectWithValue(errorMessage)
  } finally {
    dispatch(resetTimer())
  }
})

export const updateMovementOrderAction = createAsyncThunk<FixMeLater, FixMeLater>(
  "routines/thunk/updateOrder",
  updateManyMovements
)

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
