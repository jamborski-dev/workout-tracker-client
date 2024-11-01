import {
  createExercise,
  deleteExercise,
  updateExercise,
  getAllExercises
} from "@root/services/exercises.service"
import { CreateExercisePayload, Exercise, IDType } from "@root/types/data"
import { createThunk } from "@root/utils/store"

export const getAllExercisesAction = createThunk<undefined, Exercise[]>(
  "exercises/getAll",
  getAllExercises
)

export const createExerciseAction = createThunk<{ exercise: CreateExercisePayload }, Exercise>(
  "exercises/create",
  createExercise,
  [],
  { includeUserId: false }
)

export const updateExerciseAction = createThunk<
  { exerciseId: IDType; payload: Partial<Exercise> },
  Exercise
>("exercises/update", updateExercise, [], { includeUserId: false })

export const deleteExerciseAction = createThunk<{ exerciseId: IDType }, Exercise>(
  "exercises/delete",
  deleteExercise,
  [],
  { includeUserId: false }
)
