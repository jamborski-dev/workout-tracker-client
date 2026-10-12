import { secureServiceCall } from "@root/utils/service"

export type MonthTotals = { workouts: number; sets: number; volume: number }
export type RoutineSummary = {
  id: number
  date: string
  type: string
  exercises: number
  sets: number
  volume: number
}
export type Stats = {
  current: MonthTotals
  previous: MonthTotals
  last: RoutineSummary | null
  recent: RoutineSummary[]
}

export const getStats = async () => {
  return await secureServiceCall<undefined, Stats>({
    method: "get",
    path: "/fit/stats",
    errorMessage: "Error fetching stats"
  })
}
