import { createSlice, isAnyOf } from "@reduxjs/toolkit"
import {
  deleteRoutineAction,
  updateRoutineAction,
  getAllRoutinesAction,
  getRoutineByIdAction,
  addMovementAction,
  deleteMovementAction,
  updateMovementAction,
  addSetAction,
  removeSetAction,
  updateSetAction,
  updateManySetsAction,
  updateMovementOrderAction,
  saveMovementAction
} from "./routines.thunks"
import type { RoutinesState } from "./routines.types"
import type { IDType, Movement, Routine } from "@root/types/data"
import { loadSessionAction, loginUserAction } from "@root/store/slices/auth/auth.thunks"
import { logout } from "@root/store/slices/auth/auth.slice"
import { startAppListening } from "@root/store/middleware/listenerMiddleware"
import { buildSummary } from "@root/components/RoutineUpdater/utils"
import { reorderItems, trimObjectsArray } from "@root/utils/array"
import {
  ROUTINES_STATE_STORAGE_KEY,
  getFromLocalStorage,
  saveToLocalStorage
} from "@root/utils/local-storage"

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

type PersistedRoutinesState = Pick<
  RoutinesState,
  "list" | "selected" | "openMovementId" | "showActualReps" | "dirtyMovementIds" | "ownerUserId"
>

const defaultState: RoutinesState = {
  list: [],
  showActualReps: true,
  dirtyMovementIds: [],
  isLoading: false,
  isUpdating: false,
  error: null
}

const getInitialState = (): RoutinesState => {
  const persistedState = getFromLocalStorage<PersistedRoutinesState>(ROUTINES_STATE_STORAGE_KEY)

  return {
    ...defaultState,
    ...persistedState
  }
}

const persistRoutinesState = (state: RoutinesState): void => {
  saveToLocalStorage<PersistedRoutinesState>(ROUTINES_STATE_STORAGE_KEY, {
    list: state.list,
    selected: state.selected,
    openMovementId: state.openMovementId,
    showActualReps: state.showActualReps,
    dirtyMovementIds: state.dirtyMovementIds,
    ownerUserId: state.ownerUserId
  })
}

const markDirty = (state: RoutinesState, movementId: IDType) => {
  if (!state.dirtyMovementIds.includes(movementId)) {
    state.dirtyMovementIds.push(movementId)
  }
}

const initialState: RoutinesState = getInitialState()

const routinesSlice = createSlice({
  name: "routines",
  initialState,
  reducers: {
    loadRoutine: (state, action) => {
      state.selected = action.payload
    },
    // Drops the locally persisted copy (logout / different user signed in)
    resetRoutinesState: state => {
      state.list = []
      state.selected = undefined
      state.openMovementId = undefined
      state.dirtyMovementIds = []
      state.ownerUserId = undefined
    },
    setRoutinesOwner: (state, action) => {
      state.ownerUserId = action.payload
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
    setMovementsOrder: (state, action) => {
      const selected = state.selected
      if (!selected) {
        return
      }

      const nextOrderById = new Map<IDType, number>()
      action.payload.forEach((id: IDType, index: number) => {
        nextOrderById.set(id, index)
      })

      selected.movements = [...selected.movements]
        .sort((a, b) => {
          const left = nextOrderById.get(a.id) ?? a.order
          const right = nextOrderById.get(b.id) ?? b.order
          return left - right
        })
        .map((movement, index) => ({
          ...movement,
          order: index
        }))
    },
    updateSet: (state, action) => {
      const { movementId, setId, field, value } = action.payload
      const movement = state.selected?.movements.find(m => m.id === movementId)
      if (movement) {
        const set = movement.sets.find(s => s.id === setId)
        if (set) {
          // @ts-expect-error - this is a dynamic field
          set[field] = value
          markDirty(state, movementId)
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
        markDirty(state, movementId)
      }
    },
    setSetsOrder: (state, action) => {
      const { movementId, setIds } = action.payload as {
        movementId: IDType
        setIds: IDType[]
      }
      const movement = state.selected?.movements.find(m => m.id === movementId)
      if (!movement) {
        return
      }
      markDirty(state, movementId)

      const nextOrderById = new Map<IDType, number>()
      setIds.forEach((id, index) => {
        nextOrderById.set(id, index)
      })

      movement.sets = [...movement.sets]
        .sort((a, b) => {
          const left = nextOrderById.get(a.id) ?? a.order
          const right = nextOrderById.get(b.id) ?? b.order
          return left - right
        })
        .map((set, index) => ({
          ...set,
          order: index
        }))
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
        const previous = state.selected
        const server = action.payload
        const sameRoutine = Boolean(previous) && `${previous?.id}` === `${server.id}`
        const serverMovements = server.movements ?? []

        // Server is the source of truth, except movements with local edits not yet saved
        const dirty = sameRoutine ? state.dirtyMovementIds : []
        const movements = serverMovements.map(movement =>
          dirty.includes(movement.id as IDType)
            ? (previous?.movements.find(local => local.id === movement.id) ?? movement)
            : movement
        )

        state.selected = { ...server, movements }
        state.dirtyMovementIds = dirty.filter(id => serverMovements.some(m => m.id === id))
        state.isLoading = false
      })
      .addCase(saveMovementAction.fulfilled, (state, action) => {
        state.dirtyMovementIds = state.dirtyMovementIds.filter(id => id !== action.meta.arg)
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
      .addCase(deleteMovementAction.pending, state => {
        state.isUpdating = true
        state.error = null
      })
      .addCase(deleteMovementAction.fulfilled, (state, action) => {
        state.isUpdating = false
        state.selected!.movements = state
          .selected!.movements.filter(m => m.id !== action.meta.arg.movementId)
          .map((m, index) => ({ ...m, order: index }))
      })
      .addCase(deleteMovementAction.rejected, (state, action) => {
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
        // biome-ignore lint/style/noNonNullAssertion: <explanation>
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
        // biome-ignore lint/style/noNonNullAssertion: we check for existence in the reducer, and if it doesn't exist we want it to throw an error
        state.selected!.movements.find(m => m.id === action.payload.movementId)!.sets = state
          .selected!.movements.find(m => m.id === action.payload.movementId)!
          .sets.filter(s => s.id !== action.payload.setId)
          .map((s, index) => ({ ...s, order: index })) // reindex
      })
      .addCase(removeSetAction.rejected, (state, action) => {
        // Set didn't exist on the server — remove it from local state anyway
        const { movementId, setId } = action.meta.arg
        const movement = state.selected?.movements.find(m => m.id === movementId)
        if (movement) {
          movement.sets = movement.sets
            .filter(s => s.id !== setId)
            .map((s, index) => ({ ...s, order: index }))
        }
        state.error = null
        state.isUpdating = false
      })

    builder
      .addCase(updateSetAction.pending, state => {
        state.isUpdating = true
        state.error = null
      })
      .addCase(updateSetAction.fulfilled, (state, action) => {
        state.isUpdating = false
        const { movementId, id: setId } = action.payload
        const movement = state.selected!.movements.find(m => m.id === movementId)!
        const setIndex = movement.sets.findIndex(s => s.id === setId)
        movement.sets[setIndex] = { ...movement.sets[setIndex], ...action.payload }
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
        const { movementId } = action.payload[0]
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
  resetRoutinesState,
  setRoutinesOwner,
  initRoutine,
  togglePlannedActual,
  updateMovementSummary,
  updateSet,
  reorderMovements,
  setMovementsOrder,
  reorderSets,
  setSetsOrder,
  editMovement,
  closeMovement
} = routinesSlice.actions

export default routinesSlice.reducer

// TODO move debounce into component, keep reset timer here as a trigger for the debounce
// Singleton instance of the debounced function

startAppListening({
  matcher: isAnyOf(
    updateSet,
    addSetAction.fulfilled,
    removeSetAction.fulfilled,
    reorderSets,
    setSetsOrder
  ),
  effect: async (action, { dispatch }) => {
    const { movementId } = action.payload as { movementId: number }
    dispatch(updateMovementSummary(movementId))
  }
})

startAppListening({
  matcher: isAnyOf(
    loadRoutine,
    resetRoutinesState,
    setRoutinesOwner,
    initRoutine,
    editMovement,
    closeMovement,
    togglePlannedActual,
    getAllRoutinesAction.fulfilled,
    getRoutineByIdAction.fulfilled,
    updateRoutineAction.fulfilled,
    deleteRoutineAction.fulfilled,
    updateSet,
    addSetAction.fulfilled,
    removeSetAction.fulfilled,
    updateSetAction.fulfilled,
    updateManySetsAction.fulfilled,
    reorderSets,
    setSetsOrder,
    addMovementAction.fulfilled,
    deleteMovementAction.fulfilled,
    updateMovementAction.fulfilled,
    saveMovementAction.fulfilled,
    reorderMovements,
    setMovementsOrder,
    updateMovementOrderAction.fulfilled
  ),
  effect: async (_, { getState }) => {
    persistRoutinesState(getState().routines)
  }
})

startAppListening({
  matcher: isAnyOf(reorderMovements, setMovementsOrder),
  effect: async (_, { getState, dispatch }) => {
    const movements = getState().routines.selected!.movements
    if (!movements.length) return
    const reorderPayload = trimObjectsArray(movements, ["id", "order"])
    dispatch(
      updateMovementOrderAction({ routineId: movements[0].routineId!, payload: reorderPayload })
    )
  }
})

startAppListening({
  actionCreator: setSetsOrder,
  effect: async (action, { cancelActiveListeners, delay, dispatch, getState }) => {
    cancelActiveListeners()
    await delay(600)

    const movementId = action.payload.movementId as IDType
    const exists = getState().routines.selected?.movements.some(m => m.id === movementId)
    if (exists) {
      dispatch(saveMovementAction(movementId))
    }
  }
})

startAppListening({
  matcher: isAnyOf(updateMovementAction.rejected, saveMovementAction.rejected),
  effect: async (action, { dispatch, getState }) => {
    const payload = action.payload as string
    if (!payload?.toLowerCase().includes("not found")) return
    const routineId = getState().routines.selected?.id
    if (routineId) {
      dispatch(getRoutineByIdAction({ routineId }))
    }
  }
})

// Never show one user's locally persisted routines to another
startAppListening({
  matcher: isAnyOf(loginUserAction.fulfilled, loadSessionAction.fulfilled),
  effect: async (action, { dispatch, getState }) => {
    const userId = (action.payload as { user: { id: string } }).user.id
    if (getState().routines.ownerUserId !== userId) {
      dispatch(resetRoutinesState())
      dispatch(setRoutinesOwner(userId))
    }
  }
})

startAppListening({
  actionCreator: logout,
  effect: async (_, { dispatch }) => {
    dispatch(resetRoutinesState())
  }
})
