import {
  createExercise,
  deleteExercise,
  updateExercise,
  getAllExercises,
  type CreateExerciseServicePayload
} from "@root/services/exercises.service"
import { Exercise, IDType } from "@root/types/data"
import { createThunk } from "@root/utils/store"

export const getAllExercisesAction = createThunk<undefined, Exercise[]>(
  "exercises/getAll",
  getAllExercises
)

export const createExerciseAction = createThunk<CreateExerciseServicePayload, Exercise>(
  "exercises/create",
  createExercise
)

export const updateExerciseAction = createThunk<
  { exerciseId: IDType; payload: Partial<Exercise> & { requestPublic?: boolean } },
  Exercise
>("exercises/update", updateExercise)

export const deleteExerciseAction = createThunk<{ exerciseId: IDType }, undefined>(
  "exercises/delete",
  deleteExercise
)
