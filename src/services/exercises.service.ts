import { Exercise, IDType } from "@root/types/data"
import { secureServiceCall } from "@root/utils/service"

export const getAllExercises = async () => {
  return await secureServiceCall<undefined, Exercise[]>({
    method: "get",
    path: `/fit/exercises`,
    errorMessage: "Error fetching exercises"
  })
}

// `requestPublic` files an admin review request; `base` (admins only) adds to the base library
export type CreateExerciseServicePayload = Omit<Exercise, "id"> & {
  requestPublic?: boolean
  base?: boolean
}

export const createExercise = async (payload: CreateExerciseServicePayload) => {
  return await secureServiceCall<CreateExerciseServicePayload, Exercise>({
    params: payload,
    method: "post",
    path: "/fit/exercises",
    errorMessage: "Error creating exercise:"
  })
}

export const updateExercise = async (params: {
  payload: Partial<Exercise> & { requestPublic?: boolean }
  exerciseId: IDType
}) => {
  const { payload, exerciseId } = params
  return await secureServiceCall<Partial<Exercise> & { requestPublic?: boolean }, Exercise>({
    params: payload,
    method: "patch",
    path: `/fit/exercises/${exerciseId}`,
    errorMessage: "Error editing exercise"
  })
}

export const deleteExercise = async ({ exerciseId }: { exerciseId: IDType }) => {
  return await secureServiceCall<undefined, undefined>({
    method: "delete",
    path: `/fit/exercises/${exerciseId}`,
    errorMessage: "Error deleting exercise"
  })
}

export type LastSets = {
  setup?: string | null
  sets: { reps: number | null; weight: number | null; isWarmup: boolean }[]
} | null

// What the user did the last time with this exercise (null when never)
export const getLastSets = async (exerciseId: IDType) => {
  return await secureServiceCall<undefined, LastSets>({
    method: "get",
    path: `/fit/exercises/${exerciseId}/last`,
    errorMessage: "Error fetching previous sets"
  })
}
