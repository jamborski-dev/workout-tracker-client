import { createSlice, PayloadAction, createAction } from "@reduxjs/toolkit"
import { RootState } from "@root/store/store"

// Define the AppState type
interface AppState {
  timer: number
  uuid: string | null
  status: string
}

// Define the initial state
const initialState: AppState = {
  timer: 0,
  uuid: null,
  status: "idle"
}

// Define a custom action creator for startTimer
const startTimer = createAction<{ payload: number; meta: { requestId: string } }>("app/startTimer")

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    resetTimer: state => {
      state.timer = 0
      state.uuid = null
      state.status = "idle"
    }
  },
  extraReducers: builder => {
    builder.addCase(
      startTimer,
      (state, action: PayloadAction<{ payload: number; meta: { requestId: string } }>) => {
        state.timer = action.payload.payload // Correctly access the nested payload
        state.status = "running"
        state.uuid = action.payload.meta.requestId // Correctly access the nested meta property
      }
    )
  }
})

export const { resetTimer } = appSlice.actions
export { startTimer }
export default appSlice.reducer

export const selectTimer = (state: RootState) => state.app.timer
