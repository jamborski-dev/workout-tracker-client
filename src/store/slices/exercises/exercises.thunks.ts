import {
  createExercise,
  deleteExercise,
  updateExercise,
  getAllExercises
} from "@root/services/exercises.service"
import {
  CreateExercisePayload,
  GetAllExercisesPayload,
  Exercise,
  UpdateExercisePayload
} from "@root/types/data"
import { createAsyncThunkWithHandler } from "@root/utils/store"

export const getAllExercisesAction = createAsyncThunkWithHandler<
  Exercise[],
  GetAllExercisesPayload
>("exercises/getAll", getAllExercises)

export const createExerciseAction = createAsyncThunkWithHandler<Exercise, CreateExercisePayload>(
  "exercises/create",
  createExercise
)

export const updateExerciseAction = createAsyncThunkWithHandler<Exercise, UpdateExercisePayload>(
  "exercises/update",
  updateExercise
)

export const deleteExerciseAction = createAsyncThunkWithHandler<Exercise, string>(
  "exercises/delete",
  deleteExercise
)
