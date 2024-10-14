import { createAsyncThunk } from "@reduxjs/toolkit"
// import { store } from "@store/store"

// Generic function to create async thunks with unified error handling
export const createAsyncThunkWithHandler = <Returned, ThunkPayload>(
  typePrefix: string,
  serviceFn: (arg: ThunkPayload) => Promise<Returned>
) => {
  return createAsyncThunk<Returned, ThunkPayload, { rejectValue: string }>(
    typePrefix,
    async (arg, { rejectWithValue }) => {
      try {
        const result = await serviceFn(arg)
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
