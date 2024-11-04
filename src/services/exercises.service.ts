import { Exercise, IDType } from "@root/types/data"
import { secureServiceCall } from "@root/utils/service"

export const getAllExercises = async () => {
  return await secureServiceCall<undefined, Exercise[]>({
    method: "get",
    path: `/fit/exercises`,
    errorMessage: "Error fetching exercises"
  })
}

export const createExercise = async () => {
  return await secureServiceCall<undefined, Pick<Exercise, "id">>({
    method: "post",
    path: "/fit/exercises",
    errorMessage: "Error creating exercise:"
  })
}

export const updateExercise = async (params: {
  payload: Partial<Exercise>
  exerciseId: IDType
}) => {
  const { payload, exerciseId } = params
  return await secureServiceCall<
    {
      payload: Partial<Exercise>
    },
    Exercise
  >({
    params: { payload },
    method: "patch",
    path: `/fit/exercises/${exerciseId}`,
    errorMessage: "Error editing exercise"
  })
}

export const deleteExercise = async ({ exerciseId }: { exerciseId: IDType }) => {
  return await secureServiceCall<undefined, Exercise>({
    method: "delete",
    path: `/fit/exercises/${exerciseId}`,
    errorMessage: "Error deleting exercise"
  })
}
