import { configureStore } from "@reduxjs/toolkit"
import routinesReducer from "@store/slices/routines/routines.slice"
import usersReducer from "@root/store/slices/user/user.slice"
import toastReducer from "@store/slices/toast/toast.slice"
import pageReducer from "@store/slices/page/page.slice"
import exercisesReducer from "@store/slices/exercises/exercises.slice"
import { listenerMiddleware } from "@store/middleware/listenerMiddleware"
import appReducer from "@store/slices/app/app.slice"
import authReducer from "@store/slices/auth/auth.slice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    app: appReducer,
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
