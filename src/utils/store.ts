import { createAsyncThunk } from "@reduxjs/toolkit"
import { RootState } from "@root/store/store"
// import { store } from "@store/store"

// Generic function to create async thunks with unified error handling
export const createAsyncThunkWithHandler = <ThunkPayload, Returned = undefined>(
  typePrefix: string,
  serviceFn: (arg: ThunkPayload) => Promise<Returned>
) => {
  return createAsyncThunk<Returned, ThunkPayload, { state: RootState; rejectValue: string }>(
    typePrefix,
    async (arg, { rejectWithValue }) => {
      try {
        const result = await serviceFn({ ...arg })
        return result
      } catch (error) {
        const errorMessage = getErrorMessage(error)
        return rejectWithValue(errorMessage)
      }
    }
  )
}

// Generic function to create async thunks with unified error handling
export const createAsyncThunkWithHandlerWithStore = <
  Returned,
  ThunkPayload,
  StateParams = Record<string, unknown>
>(
  typePrefix: string,
  serviceFn: (arg: ThunkPayload) => Promise<Returned>,
  selectStateParams?: (state: RootState) => StateParams
) => {
  return createAsyncThunk<Returned, ThunkPayload, { state: RootState; rejectValue: string }>(
    typePrefix,
    async (arg, { getState, rejectWithValue }) => {
      try {
        const stateParams = selectStateParams ? selectStateParams(getState()) : ({} as StateParams)
        const result = await serviceFn({ ...arg, ...stateParams })
        return result
      } catch (error) {
        const errorMessage = getErrorMessage(error)
        return rejectWithValue(errorMessage)
      }
    }
  )
}

export const getErrorMessage = (error: unknown): string => {
  if (typeof error === "string") {
    return String(error)
  } else if (error instanceof Error) {
    return String(error.message)
  } else {
    return "An error occurred"
  }
}

// export const getUserIdFromStore = () => {
//   return store.getState().users.selectedUser?.id
// }
