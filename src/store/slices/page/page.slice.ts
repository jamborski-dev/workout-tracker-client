import { createSelector, createSlice } from "@reduxjs/toolkit"
import { RootState } from "@root/store/store"

type RightPanelState = {
  title: string
  secondaryTitle: string
  view: string
}

interface PageState {
  showRightPanel: boolean
  rightPanel?: Partial<RightPanelState>
}

const initialState: PageState = {
  showRightPanel: false
}

const pageSlice = createSlice({
  name: "page",
  initialState,
  reducers: {
    setRightPanel(state, action) {
      state.rightPanel = action.payload
    }
  }
})

export const { setRightPanel } = pageSlice.actions

export default pageSlice.reducer

export const selectPageState = (state: RootState) => state.page
export const selectShowRightPanel = createSelector(selectPageState, state => state.showRightPanel)
export const selectRightPanel = createSelector(selectPageState, state => state.rightPanel)
