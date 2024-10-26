import type { MovementSet, MovementSummary } from "@root/types/data"

export const buildSummary = (sets: MovementSet[]): MovementSummary => {
  if (!sets.length) return "-"

  let summary = ""
  let currentReps = sets[0].actualReps ?? 0
  let currentWeight = sets[0].actualWeight ?? 0
  let currentCount = 1

  for (let i = 1; i < sets.length; i++) {
    const set = sets[i]
    const actualReps = set.actualReps ?? 0
    const actualWeight = set.actualWeight ?? 0

    if (actualReps === currentReps && actualWeight === currentWeight) {
      currentCount++
    } else {
      summary += `${
        currentCount > 1 ? `${currentCount}x` : ""
      }${currentReps} @ ${currentWeight}kg, `
      currentReps = actualReps
      currentWeight = actualWeight
      currentCount = 1
    }
  }

  summary += `${currentCount > 1 ? `${currentCount}x` : ""}${currentReps} @ ${currentWeight}kg`

  return summary
}

export const mergePayload = (sets: MovementSet[], payload: MovementSet[]): MovementSet[] => {
  // use first arg as the base and treat as stale data
  // merge the payload with the base based on the sets.id === payload.id
  return sets.map(set => {
    const updatedSet = payload.find(p => p.id === set.id)
    if (updatedSet) {
      return { ...set, ...updatedSet }
    }
    return set
  })
}
