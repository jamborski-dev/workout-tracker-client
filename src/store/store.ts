import { configureStore } from "@reduxjs/toolkit"
import routinesReducer from "@store/slices/routines/routines.slice"
import usersReducer from "@store/slices/users/users.slice"
import toastReducer from "@store/slices/toast/toast.slice"
import pageReducer from "@store/slices/page/page.slice"
import exercisesReducer from "@store/slices/exercises/exercises.slice"
import { listenerMiddleware } from "@store/middleware/listenerMiddleware"

export const store = configureStore({
  reducer: {
    page: pageReducer,
    users: usersReducer,
    toast: toastReducer,
    routines: routinesReducer,
    exercises: exercisesReducer
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(listenerMiddleware.middleware)
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
