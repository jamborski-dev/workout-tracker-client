import { Exercise } from "@root/types/data"

export interface ExercisesState {
  list: Exercise[]
  currentExercise?: Exercise
  form: {
    updateValues?: Exercise
    mode: "add" | "edit"
  }
  isLoading: boolean
  isUpdating: boolean
  error: string | null
}
