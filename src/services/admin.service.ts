import { API } from "@root/services/axios"

export type AllowedEmail = {
  id: string
  email: string
  role: "USER" | "ADMIN" | "TESTER"
  note: string | null
  inviteSentAt: string | null
  createdAt: string
  user: { emailVerified: boolean; createdAt: string } | null
}

export const getAllowedEmails = async () =>
  (await API.get<AllowedEmail[]>("/fit/admin/allowed-emails")).data

export const addAllowedEmail = async (payload: {
  email: string
  role: AllowedEmail["role"]
  note?: string
  sendInvite: boolean
}) => (await API.post<AllowedEmail>("/fit/admin/allowed-emails", payload)).data

export const sendInvite = async (id: string) =>
  (await API.post<AllowedEmail>(`/fit/admin/allowed-emails/${id}/invite`)).data

export const removeAllowedEmail = async (id: string) => {
  await API.delete(`/fit/admin/allowed-emails/${id}`)
}

export const getApiErrorMessage = (error: unknown): string => {
  const message = (error as { response?: { data?: { error?: string } } })?.response?.data?.error
  return message || (error instanceof Error ? error.message : "Something went wrong")
}

export type PendingExercise = {
  id: number
  name: string
  description: string | null
  muscleGroup: string | null
  category: string | null
  complexity: string | null
  equipment: string | null
  submittedAt: string | null
  owner: { email: string; name: string } | null
  similar: { id: number; name: string; category: string | null; equipment: string | null }[]
}

export const getPendingExercises = async () =>
  (await API.get<PendingExercise[]>("/fit/admin/exercises/pending")).data

export const approveExercise = async (id: number) => {
  await API.post(`/fit/admin/exercises/${id}/approve`)
}

export const rejectExercise = async (id: number, note: string) => {
  await API.post(`/fit/admin/exercises/${id}/reject`, { note })
}

export const mergeExercise = async (id: number, targetId: number) => {
  await API.post(`/fit/admin/exercises/${id}/merge`, { targetId })
}
