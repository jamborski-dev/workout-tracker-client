import { createAsyncThunk, createSelector } from "@reduxjs/toolkit"
import { selectAccessToken } from "@root/store/slices/auth/auth.slice"
import { selectUserId } from "@root/store/slices/user/user.selectors"
import { RootState } from "@root/store/store"
import { IDType } from "@root/types/data"

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

interface ThunkOptions {
  includeAccessToken?: boolean
  includeUserId?: boolean
}

type DefaultStateParams = {
  accessToken: string
  userId: IDType
}

export const createThunk = <
  ThunkPayload extends UnknownObject | undefined,
  Returned = undefined,
  StateParams extends UnknownObject = UnknownObject // StateParams can be defined by user and will be merged
>(
  typePrefix: string,
  serviceFn: (arg: ThunkPayload & DefaultStateParams & StateParams) => Promise<Returned>,
  additionalSelectors?: Array<(state: RootState) => Partial<StateParams>>,
  options: ThunkOptions = { includeAccessToken: true, includeUserId: true }
) => {
  return createAsyncThunk<Returned, ThunkPayload, { state: RootState; rejectValue: string }>(
    typePrefix,
    async (arg, { getState, rejectWithValue }) => {
      try {
        // StateParams will be merged with DefaultStateParams
        let stateParams = {} as DefaultStateParams & StateParams

        // Conditionally include accessToken and userId selectors by default
        const defaultSelectors: Array<(state: RootState) => Partial<DefaultStateParams>> = []
        if (options.includeAccessToken) {
          defaultSelectors.push(
            wrapSelector(selectAccessToken, "accessToken") as (
              state: RootState
            ) => Partial<DefaultStateParams>
          )
        }
        if (options.includeUserId) {
          defaultSelectors.push(
            wrapSelector(selectUserId, "userId") as (
              state: RootState
            ) => Partial<DefaultStateParams>
          )
        }

        // Combine default selectors with any additional selectors provided
        const allSelectors = additionalSelectors
          ? [...defaultSelectors, ...additionalSelectors]
          : defaultSelectors

        // Merge the results of all selectors
        allSelectors.forEach(selector => {
          stateParams = { ...stateParams, ...selector(getState()) }
        })

        // Merging the ThunkPayload (arg) with the stateParams
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
