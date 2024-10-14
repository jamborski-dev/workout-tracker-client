import { CreateExercisePayload, Exercise, UpdateExercisePayload } from "@root/types/data"
import { serviceCall } from "@root/utils/service"

export const getAllExercises = async () => {
  const path = `/exercises`
  return await serviceCall<undefined, Exercise[]>(
    undefined,
    "get",
    path,
    "Error fetching exercises"
  )
}

export const createExercise = async (exercise: CreateExercisePayload) => {
  return await serviceCall<CreateExercisePayload, Exercise>(
    exercise,
    "post",
    "/exercises",
    "Error creating exercise:"
  )
}

export const updateExercise = async (updatePayload: UpdateExercisePayload) => {
  return await serviceCall<UpdateExercisePayload, Exercise>(
    updatePayload,
    "patch",
    `/exercises/${updatePayload.id}`,
    "Error editing exercise"
  )
}

export const deleteExercise = async (exerciseId: string) => {
  return await serviceCall<undefined, Exercise>(
    undefined,
    "delete",
    `/exercises/${exerciseId}`,
    "Error deleting exercise"
  )
}
