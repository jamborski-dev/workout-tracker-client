import {
  createExercise,
  deleteExercise,
  updateExercise,
  getAllExercises
} from "@root/services/exercises.service"
import { Exercise, IDType } from "@root/types/data"
import { createThunk } from "@root/utils/store"

export const getAllExercisesAction = createThunk<undefined, Exercise[]>(
  "exercises/getAll",
  getAllExercises
)

export const createExerciseAction = createThunk<undefined, Pick<Exercise, "id">>(
  "exercises/create",
  createExercise
)

export const updateExerciseAction = createThunk<
  { exerciseId: IDType; payload: Partial<Exercise> },
  Exercise
>("exercises/update", updateExercise)

export const deleteExerciseAction = createThunk<{ exerciseId: IDType }, Exercise>(
  "exercises/delete",
  deleteExercise
)
