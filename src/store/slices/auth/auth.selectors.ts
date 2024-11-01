import { createSelector } from "@reduxjs/toolkit"
import { RootState } from "@root/store/store"

export const selectAuthState = (state: RootState) => state.auth
export const selectAccessToken = createSelector(selectAuthState, state => state.accessToken)
