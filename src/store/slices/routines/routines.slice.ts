import { createSlice } from "@reduxjs/toolkit"
import {
  createRoutineAction,
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
  updateManySetsAction
} from "./routines.thunks"
import { RoutinesState } from "./routines.types"
import { IDType, Movement, Routine } from "@root/types/data"

// import { startAppListening } from "@store/middleware/listenerMiddleware"
// import { setRightPanel } from "../page/page.slice"

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
    togglePlannedActual: state => {
      state.showActualReps = !state.showActualReps
    },
    updateMovementSummary: (state, action) => {
      const movement = state.selected?.movements.find(m => m.id === action.payload.movementId)
      if (movement) {
        movement.summary = action.payload.summary
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
      .addCase(createRoutineAction.pending, state => {
        state.isUpdating = true
        state.error = null
      })
      .addCase(createRoutineAction.fulfilled, (state, action) => {
        const { date } = action.payload
        const index = state.list.findIndex(rtn => rtn.date <= date)
        if (index === -1) {
          state.list.push(action.payload)
        } else {
          state.list.splice(index, 0, action.payload)
        }
        state.isUpdating = false
      })
      .addCase(createRoutineAction.rejected, (state, action) => {
        state.error = action.payload as string
        state.isUpdating = false
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

    builder
      .addCase(deleteRoutineAction.pending, state => {
        state.isUpdating = true
        state.error = null
      })
      .addCase(deleteRoutineAction.fulfilled, (state, action) => {
        state.list = state.list.filter(rtn => rtn.id !== action.payload.id)
        state.isUpdating = false
      })
      .addCase(deleteRoutineAction.rejected, (state, action) => {
        state.error = action.payload as string
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
        state.selected!.movements = state.selected!.movements.filter(
          m => m.id !== action.meta.arg.movementId
        )
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

export const { loadRoutine, initRoutine, togglePlannedActual, updateMovementSummary } =
  routinesSlice.actions

export default routinesSlice.reducer

// startAppListening({
//   actionCreator: createRoutineAction.fulfilled,
//   effect: async (_, { dispatch }) => {
//     dispatch(setRightPanel(undefined))
//   }
// })
