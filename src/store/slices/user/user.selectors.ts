import { createSelector } from "@reduxjs/toolkit"
import { RootState } from "@store/store"

const selectUsersState = (state: RootState) => state.user

export const selectUsersLoading = createSelector(selectUsersState, state => state.isLoading)
// The logged-in user lives in the auth slice; the user slice is a leftover placeholder.
export const selectUserId = (state: RootState) => state.auth.user?.id
