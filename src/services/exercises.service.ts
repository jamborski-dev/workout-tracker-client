import { AccessToken, Exercise, IDType } from "@root/types/data"
import { secureServiceCall } from "@root/utils/service"

export const getAllExercises = async ({ accessToken }: { accessToken: AccessToken }) => {
  const path = `/exercises`
  return await secureServiceCall<undefined, Exercise[]>({
    method: "get",
    path,
    errorMessage: "Error fetching exercises",
    accessToken
  })
}

export const createExercise = async (params: { accessToken: AccessToken }) => {
  const { accessToken } = params
  return await secureServiceCall<undefined, Pick<Exercise, "id">>({
    method: "post",
    path: "/exercises",
    errorMessage: "Error creating exercise:",
    accessToken
  })
}

export const updateExercise = async (params: {
  payload: Partial<Exercise>
  accessToken: AccessToken
  exerciseId: IDType
}) => {
  const { payload, accessToken, exerciseId } = params
  return await secureServiceCall<
    {
      payload: Partial<Exercise>
    },
    Exercise
  >({
    params: { payload },
    method: "patch",
    path: `/exercises/${exerciseId}`,
    errorMessage: "Error editing exercise",
    accessToken
  })
}

export const deleteExercise = async ({
  exerciseId,
  accessToken
}: {
  exerciseId: IDType
  accessToken: AccessToken
}) => {
  return await secureServiceCall<undefined, Exercise>({
    method: "delete",
    path: `/exercises/${exerciseId}`,
    errorMessage: "Error deleting exercise",
    accessToken
  })
}
