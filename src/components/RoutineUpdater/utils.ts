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
      if (currentReps > 0) {
        summary += `${currentCount}x${currentReps} @ ${currentWeight}kg, `
      }
      currentReps = actualReps
      currentWeight = actualWeight
      currentCount = 1
    }
  }

  if (currentReps > 0) {
    summary += `${currentCount}x${currentReps} @${currentWeight}kg`
  }

  return summary || "-"
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

// const getTransformedPayloadObject = (
//   setId: IDType,
//   field: string,
//   value: number,
// ): MovementSet => {
//   const transformedField = field.split(".")[2]

//   // find if the set exists in the local state
//   const set = updatePayload.find(set => set.id === setId)

//   // if it exists, update the field
//   if (set) {
//     return updatePayload.map(set => {
//       if (set.id === setId) {
//         return {
//           ...set,
//           [transformedField]: value
//         }
//       }
//       return set
//     })
//   }

//   // get order variable from the set of id setId
//   const order = movement.sets.find(set => set.id === setId)?.order || movement.sets.length

//   // if not found, create a new set with the updated field
//   return [
//     ...updatePayload,
//     {
//       id: setId,
//       order,
//       [transformedField]: value
//     }
//   ]
// }
