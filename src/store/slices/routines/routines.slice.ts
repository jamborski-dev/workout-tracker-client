import { createSlice, isAnyOf } from "@reduxjs/toolkit"
import {
  deleteRoutineAction,
  updateRoutineAction,
  getAllRoutinesAction,
  getRoutineByIdAction,
  addMovementAction,
  removeMovementAction,
  updateMovementAction,
  addSetAction,
  removeSetAction,
  updateSetAction,
  updateManySetsAction,
  updateMovementOrderAction
} from "./routines.thunks"
import { RoutinesState } from "./routines.types"
import { IDType, Movement, Routine } from "@root/types/data"
import { startAppListening } from "@root/store/middleware/listenerMiddleware"
import { buildSummary } from "@root/components/RoutineUpdater/utils"
import { startTimer } from "../app/app.slice"
import { v4 as uuid } from "uuid"
import { reorderItems, trimObjectsArray } from "@root/utils/array"

const getEmptyMovement = ({
  id,
  routineId,
  order
}: {
  id: IDType
  routineId: IDType
  order: number
}): Movement => ({
  id,
  order,
  routineId,
  exerciseId: null,
  notes: null,
  summary: "-",
  sets: []
})

const initialState: RoutinesState = {
  list: [],
  showActualReps: true,
  isLoading: false,
  isUpdating: false,
  error: null
}

const routinesSlice = createSlice({
  name: "routines",
  initialState,
  reducers: {
    loadRoutine: (state, action) => {
      state.selected = action.payload
    },
    initRoutine: state => {
      // const newRoutine = getInitRoutine(action.payload)
      const newRoutine = {} as Routine
      state.list.push(newRoutine)
      state.selected = newRoutine
    },
    editMovement: (state, action) => {
      state.openMovementId = action.payload
    },
    closeMovement: state => {
      state.openMovementId = undefined
    },
    togglePlannedActual: state => {
      state.showActualReps = !state.showActualReps
    },
    updateMovementSummary: (state, action) => {
      const movement = state.selected?.movements.find(m => m.id === action.payload)
      if (movement) {
        movement.summary = buildSummary(movement.sets)
      }
    },
    reorderMovements: (state, action) => {
      const { movementId, direction } = action.payload
      state.selected!.movements = reorderItems(state.selected!.movements, movementId, direction)
    },
    updateSet: (state, action) => {
      const { movementId, setId, field, value } = action.payload
      const movement = state.selected?.movements.find(m => m.id === movementId)
      if (movement) {
        const set = movement.sets.find(s => s.id === setId)
        if (set) {
          // @ts-expect-error - this is a dynamic field
          set[field] = value
        }
      }
    },
    reorderSets: (state, action) => {
      const { movementId, setId, direction } = action.payload
      const selected = state.selected
      if (selected) {
        const movements = selected.movements.map(movement => {
          if (movement.id === movementId) {
            return {
              ...movement,
              sets: reorderItems(movement.sets, setId, direction)
            }
          }
          return movement
        })

        // Update the state with a new reference
        state.selected = {
          ...selected,
          movements
        }
      }
    }
  },
  extraReducers: builder => {
    builder
      .addCase(getAllRoutinesAction.pending, state => {
        state.isLoading = true
        state.error = null
      })
      .addCase(getAllRoutinesAction.fulfilled, (state, action) => {
        state.list = action.payload
        state.isLoading = false
      })
      .addCase(getAllRoutinesAction.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

    builder
      .addCase(getRoutineByIdAction.pending, state => {
        state.isLoading = true
        state.error = null
      })
      .addCase(getRoutineByIdAction.fulfilled, (state, action) => {
        state.selected = action.payload
        if (!action.payload.movements?.length) {
          state.selected.movements = []
        }
        state.isLoading = false
      })
      .addCase(getRoutineByIdAction.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

    builder
      .addCase(deleteRoutineAction.pending, state => {
        state.isUpdating = true
      })
      .addCase(deleteRoutineAction.fulfilled, (state, action) => {
        state.isUpdating = false
        state.list = state.list.filter(routine => routine.id !== action.meta.arg.routineId)
      })
      .addCase(deleteRoutineAction.rejected, (state, action) => {
        state.isUpdating = false
        state.error = action.payload as string
      })

    builder
      .addCase(updateRoutineAction.pending, state => {
        state.isUpdating = true
        state.error = null
      })
      .addCase(updateRoutineAction.fulfilled, (state, action) => {
        state.selected = { ...state.selected, ...action.payload }
        state.isUpdating = false
      })
      .addCase(updateRoutineAction.rejected, (state, action) => {
        state.error = action.payload || "An error occurred"
        state.isUpdating = false
      })

    // Movements
    builder
      .addCase(addMovementAction.pending, state => {
        state.isUpdating = true
        state.error = null
      })
      .addCase(addMovementAction.fulfilled, (state, action) => {
        state.isUpdating = false
        state.selected!.movements.push(
          getEmptyMovement({
            id: action.payload.id,
            routineId: state.selected!.id,
            order: action.meta.arg.order
          })
        )
      })
      .addCase(addMovementAction.rejected, (state, action) => {
        state.error = action.payload as string
        state.isUpdating = false
      })

    builder
      .addCase(removeMovementAction.pending, state => {
        state.isUpdating = true
        state.error = null
      })
      .addCase(removeMovementAction.fulfilled, (state, action) => {
        state.isUpdating = false
        state.selected!.movements = state
          .selected!.movements.filter(m => m.id !== action.meta.arg.movementId)
          .map((m, index) => ({ ...m, order: index }))
      })
      .addCase(removeMovementAction.rejected, (state, action) => {
        state.error = action.payload as string
        state.isUpdating = false
      })

    builder
      .addCase(updateMovementAction.pending, state => {
        state.isUpdating = true
        state.error = null
      })
      .addCase(updateMovementAction.fulfilled, (state, action) => {
        state.isUpdating = false
        const movement = state.selected!.movements.find(m => m.id === action.payload.id)
        if (movement) {
          Object.assign(movement, action.payload)
        }
      })
      .addCase(updateMovementAction.rejected, (state, action) => {
        state.error = action.payload as string
        state.isUpdating = false
      })

    // Sets
    builder
      .addCase(addSetAction.pending, state => {
        state.isUpdating = true
        state.error = null
      })
      .addCase(addSetAction.fulfilled, (state, action) => {
        state.isUpdating = false
        state
          .selected!.movements.find(m => m.id === action.meta.arg.movementId)!
          .sets.push(action.payload)
      })
      .addCase(addSetAction.rejected, (state, action) => {
        state.error = action.payload as string
        state.isUpdating = false
      })

    builder
      .addCase(removeSetAction.pending, state => {
        state.isUpdating = true
        state.error = null
      })
      .addCase(removeSetAction.fulfilled, (state, action) => {
        state.isUpdating = false
        state.selected!.movements.find(m => m.id === action.meta.arg.movementId)!.sets = state
          .selected!.movements.find(m => m.id === action.meta.arg.movementId)!
          .sets.filter(s => s.id !== action.meta.arg.setId)
          .map((s, index) => ({ ...s, order: index })) // reindex
      })
      .addCase(removeSetAction.rejected, (state, action) => {
        state.error = action.payload as string
        state.isUpdating = false
      })

    builder
      .addCase(updateSetAction.pending, state => {
        state.isUpdating = true
        state.error = null
      })
      .addCase(updateSetAction.fulfilled, (state, action) => {
        state.isUpdating = false
        const { movementId, setId, payload } = action.meta.arg
        const movement = state.selected!.movements.find(m => m.id === movementId)!
        const setIndex = movement.sets.findIndex(s => s.id === setId)
        movement.sets[setIndex] = { ...movement.sets[setIndex], ...payload }
      })
      .addCase(updateSetAction.rejected, (state, action) => {
        state.error = action.payload as string
        state.isUpdating = false
      })

    builder
      .addCase(updateManySetsAction.pending, state => {
        state.isUpdating = true
        state.error = null
      })
      .addCase(updateManySetsAction.fulfilled, (state, action) => {
        state.isUpdating = false
        const { movementId } = action.meta.arg
        const { payload } = action
        const movement = state.selected!.movements.find(m => m.id === movementId)!
        movement.sets = movement.sets.map(s => {
          const updatedSet = payload.find(p => p.id === s.id)
          return updatedSet || s
        })
      })
      .addCase(updateManySetsAction.rejected, (state, action) => {
        state.error = action.payload as string
        state.isUpdating = false
      })
  }
})

export const {
  loadRoutine,
  initRoutine,
  togglePlannedActual,
  updateMovementSummary,
  updateSet,
  reorderMovements,
  reorderSets,
  editMovement,
  closeMovement
} = routinesSlice.actions

export default routinesSlice.reducer

// TODO move debounce into component, keep reset timer here as a trigger for the debounce
// Singleton instance of the debounced function

startAppListening({
  matcher: isAnyOf(updateSet, addSetAction.fulfilled, removeSetAction.fulfilled, reorderSets),
  effect: async (action, { dispatch }) => {
    const { movementId } = action.payload as { movementId: number }
    dispatch(startTimer({ payload: 4000, meta: { requestId: uuid() } }))
    dispatch(updateMovementSummary(movementId))
  }
})

startAppListening({
  matcher: isAnyOf(reorderMovements),
  effect: async (_, { getState, dispatch }) => {
    const movements = getState().routines.selected!.movements
    const reorderPayload = trimObjectsArray(movements, ["id", "order"])
    dispatch(updateMovementOrderAction({ userId: 1, routineId: 1, payload: reorderPayload }))
  }
})
