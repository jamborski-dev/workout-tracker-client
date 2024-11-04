import { createAsyncThunk } from "@reduxjs/toolkit"
import {
  deleteRoutine,
  updateRoutine,
  getAllRoutines,
  getRoutineById,
  initRoutine,
  addMovement,
  deleteMovement,
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
  DeleteMovementActionPayload,
  RemoveSetActionPayload,
  Routine,
  UpdateManySetsActionPayload,
  UpdateMovementActionPayload,
  UpdateRoutineActionPayload,
  UpdateSetActionPayload
} from "@root/types/data"
import { createThunk, getErrorMessage, wrapSelector } from "@root/utils/store"
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

export const deleteMovementAction = createThunk<
  Pick<DeleteMovementActionPayload, "movementId">,
  undefined,
  Pick<DeleteMovementActionPayload, "routineId" | "movementId">
>("routines/thunk/deleteMovement", deleteMovement, [wrapSelector(selectRoutineId, "routineId")])

export const updateMovementAction = createThunk<
  Pick<UpdateMovementActionPayload, "movementId" | "payload">,
  Movement,
  Pick<UpdateMovementActionPayload, "routineId">
>("routines/thunk/updateMovement", updateMovement, [wrapSelector(selectRoutineId, "routineId")])

export const saveMovementAction = createAsyncThunk<
  Movement,
  IDType,
  { state: RootState; rejectValue: string }
>("routines/thunk/saveMovement", async (id: IDType, { getState, dispatch, rejectWithValue }) => {
  try {
    const userId = getState().user.userId

    if (!userId) {
      throw new Error("Not authorized")
    }

    const movement = getState().routines.selected!.movements.find(m => m.id === id)
    const result = await updateMovement({
      routineId: getState().routines.selected!.id,
      movementId: id,
      payload: { ...movement }
    })
    return result
  } catch (error) {
    const errorMessage = getErrorMessage(error)
    return rejectWithValue(errorMessage)
  } finally {
    dispatch(resetTimer())
  }
})

// TODO define the type
export const updateMovementOrderAction = createThunk<FixMeLater, FixMeLater>(
  "routines/thunk/updateOrder",
  updateManyMovements
)

// Sets
export const addSetAction = createThunk<
  Pick<AddSetActionPayload, "movementId" | "order">,
  MovementSet,
  Pick<AddSetActionPayload, "routineId">
>("routines/thunk/addSet", addSet, [wrapSelector(selectRoutineId, "routineId")])

export const removeSetAction = createThunk<
  Pick<RemoveSetActionPayload, "setId">,
  { movementId: IDType; setId: IDType },
  Pick<RemoveSetActionPayload, "routineId" | "movementId">
>("routines/thunk/removeSet", removeSet, [
  wrapSelector(selectRoutineId, "routineId"),
  wrapSelector(selectRoutineId, "movementId")
])

// Not used
export const updateSetAction = createThunk<
  Pick<UpdateSetActionPayload, "setId" | "payload">,
  MovementSet,
  Pick<UpdateSetActionPayload, "routineId" | "movementId">
>("routines/thunk/updateSet", patchSet, [
  wrapSelector(selectRoutineId, "routineId"),
  wrapSelector(selectRoutineId, "movementId")
])

// Not used
export const updateManySetsAction = createThunk<
  Pick<UpdateManySetsActionPayload, "payload">,
  MovementSet[],
  Pick<UpdateManySetsActionPayload, "routineId" | "movementId">
>("routines/thunk/patchManySets", patchManySets, [
  wrapSelector(selectRoutineId, "routineId"),
  wrapSelector(selectRoutineId, "movementId")
])
