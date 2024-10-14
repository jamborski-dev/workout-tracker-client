import { createSlice } from "@reduxjs/toolkit"
// import { startAppListening } from "@store/middleware/listenerMiddleware"
// import {
//   createRoutineAction,
//   deleteRoutineAction,
//   updateRoutineAction,
//   getRoutinesAction
// } from "@store/slices/routines/routines.thunks"

interface ToastState {
  message: string
  type: "info" | "success" | "error" | "warning"
  show: boolean
}

const initialState: ToastState = {
  message: "",
  type: "info", // 'success', 'error', 'warning', etc.
  show: false
}

const toastSlice = createSlice({
  name: "toast",
  initialState,
  reducers: {
    showToast: (state, action) => {
      state.message = action.payload.message
      state.type = action.payload.type
      state.show = true
    },
    hideToast: state => {
      state.show = false
      state.message = ""
    }
  }
})

export const { showToast, hideToast } = toastSlice.actions
export default toastSlice.reducer

// // Routines

// startAppListening({
//   actionCreator: getRoutinesAction.rejected,
//   effect: async (action, { dispatch }) => {
//     dispatch(showToast({ message: action.payload, type: "error" }))
//   }
// })

// // CREATE
// startAppListening({
//   actionCreator: createRoutineAction.fulfilled,
//   effect: async (_, { dispatch }) => {
//     dispatch(showToast({ message: "Routine created", type: "success" }))
//   }
// })

// startAppListening({
//   actionCreator: createRoutineAction.rejected,
//   effect: async (action, { dispatch }) => {
//     dispatch(showToast({ message: action.payload, type: "error" }))
//   }
// })

// // UPDATE
// startAppListening({
//   actionCreator: updateRoutineAction.fulfilled,
//   effect: async (_, { dispatch }) => {
//     dispatch(showToast({ message: "Routine updated", type: "success" }))
//   }
// })

// startAppListening({
//   actionCreator: updateRoutineAction.rejected,
//   effect: async (action, { dispatch }) => {
//     dispatch(showToast({ message: action.payload, type: "error" }))
//   }
// })

// // DELETE
// startAppListening({
//   actionCreator: deleteRoutineAction.fulfilled,
//   effect: async (_, { dispatch }) => {
//     dispatch(showToast({ message: "Routine deleted", type: "success" }))
//   }
// })

// startAppListening({
//   actionCreator: deleteRoutineAction.rejected,
//   effect: async (action, { dispatch }) => {
//     dispatch(showToast({ message: action.payload, type: "error" }))
//   }
// })

// // DELETE
// startAppListening({
//   actionCreator: deleteRoutineAction.fulfilled,
//   effect: async (_, { dispatch }) => {
//     dispatch(showToast({ message: "Pot deleted", type: "success" }))
//   }
// })

// startAppListening({
//   actionCreator: deleteRoutineAction.rejected,
//   effect: async (action, { dispatch }) => {
//     dispatch(showToast({ message: action.payload, type: "error" }))
//   }
// })
