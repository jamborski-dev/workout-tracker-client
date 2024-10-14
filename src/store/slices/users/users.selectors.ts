import { createSelector } from "@reduxjs/toolkit"
import { RootState } from "@store/store"

const selectUsersState = (state: RootState) => state.users

export const selectUsersLoading = createSelector(selectUsersState, state => state.isLoading)
export const selectUsers = createSelector(selectUsersState, state => state.users)

export const selectUser = createSelector(selectUsersState, state => state.selectedUser)
export const selectUserId = createSelector(selectUsersState, state => state.selectedUser?.id)
export const selectUserName = createSelector(
  selectUsersState,
  state => state.selectedUser?.username
)
