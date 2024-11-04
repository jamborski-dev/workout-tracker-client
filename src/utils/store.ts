import { createAsyncThunk, createSelector } from "@reduxjs/toolkit"
import { RootState } from "@root/store/store"

export const wrapSelector = <T, Key extends string>(
  selector: (state: RootState) => T,
  key: Key
) => {
  return createSelector(
    [selector],
    value =>
      ({
        [key]: value
      } as Record<Key, T>)
  )
}

type UnknownObject = Record<string, unknown>

export const createThunk = <
  ThunkPayload extends UnknownObject | undefined,
  Returned = undefined,
  StateParams extends UnknownObject = UnknownObject
>(
  typePrefix: string,
  serviceFn: (arg: ThunkPayload & StateParams) => Promise<Returned>,
  additionalSelectors?: Array<(state: RootState) => Partial<StateParams>>
) => {
  return createAsyncThunk<Returned, ThunkPayload, { state: RootState; rejectValue: string }>(
    typePrefix,
    async (arg, { getState, rejectWithValue }) => {
      try {
        let stateParams = {} as StateParams

        // Apply additional selectors if any
        if (additionalSelectors) {
          additionalSelectors.forEach(selector => {
            stateParams = { ...stateParams, ...selector(getState()) }
          })
        }

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
