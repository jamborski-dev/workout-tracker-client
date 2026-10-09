import type { MovementSet, MovementSummary } from "@root/types/data"
export const buildSummary = (sets: MovementSet[]): MovementSummary => {
  if (!sets.length) return "-"

  // Summarise what was logged; fall back to the plan when nothing has been logged yet
  const hasActual = sets.some(set => (set.actualReps ?? 0) > 0)
  const values = sets.map(set => ({
    reps: (hasActual ? set.actualReps : set.plannedReps) ?? 0,
    weight: (hasActual ? set.actualWeight : set.plannedWeight) ?? 0
  }))

  // Group consecutive identical sets: "3x5 @ 100kg, 1x3 @ 110kg"
  const groups: { count: number; reps: number; weight: number }[] = []
  for (const value of values) {
    const last = groups[groups.length - 1]
    if (last && last.reps === value.reps && last.weight === value.weight) {
      last.count++
    } else {
      groups.push({ count: 1, ...value })
    }
  }

  const summary = groups
    .filter(group => group.reps > 0)
    .map(group => `${group.count}x${group.reps} @ ${group.weight}kg`)
    .join(", ")

  return summary || "-"
}

const isEmpty = (value?: number | null) => !value || Number.isNaN(value)

// Actual values to log when a set is ticked off: the plan, but never over something already entered
export const actualsFromPlan = (set: MovementSet) => {
  const fields: { actualReps?: number; actualWeight?: number } = {}
  if (isEmpty(set.actualReps) && !isEmpty(set.plannedReps)) fields.actualReps = set.plannedReps
  if (isEmpty(set.actualWeight) && !isEmpty(set.plannedWeight)) fields.actualWeight = set.plannedWeight
  return fields
}
