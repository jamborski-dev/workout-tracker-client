import { isRejected } from "@reduxjs/toolkit"
import { startAppListening } from "./listenerMiddleware"
import { showToast } from "@store/slices/toast/toast.slice"
import { createExerciseAction } from "@store/slices/exercises/exercises.thunks"

// Thunks that already surface their own errors inline
const SILENT_PREFIXES = ["auth/"]

// Any rejected thunk with a message becomes an error toast
startAppListening({
  matcher: isRejected,
  effect: async (action, { dispatch }) => {
    const type = action.type as string
    if (SILENT_PREFIXES.some(prefix => type.startsWith(prefix))) return
    if (action.meta?.aborted || action.meta?.condition) return

    const message =
      typeof action.payload === "string" && action.payload
        ? action.payload
        : (action.error?.message ?? "Something went wrong")
    dispatch(showToast({ message, type: "error" }))
  }
})

startAppListening({
  actionCreator: createExerciseAction.fulfilled,
  effect: async (_, { dispatch }) => {
    dispatch(showToast({ message: "Exercise created", type: "success" }))
  }
})
