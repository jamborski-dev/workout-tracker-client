import { createSelector } from "@reduxjs/toolkit"
import { RootState } from "@store/store"

const selectUsersState = (state: RootState) => state.user

export const selectUsersLoading = createSelector(selectUsersState, state => state.isLoading)
export const selectUserId = createSelector(selectUsersState, state => state.userId)
