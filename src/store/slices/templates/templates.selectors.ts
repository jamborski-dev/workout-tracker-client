import { createSelector } from "@reduxjs/toolkit"
import type { RootState } from "@store/store"

const selectTemplatesState = (state: RootState) => state.templates

export const selectTemplates = createSelector(selectTemplatesState, state => state.list)
export const selectTemplatesLoading = createSelector(selectTemplatesState, state => state.isLoading)
