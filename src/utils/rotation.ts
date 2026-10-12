import type { Routine, RoutineType } from "@root/types/data"

// "PPL: Push" belongs to the "PPL" family; the next workout in a rotation is the next type in it
const family = (name: string) => name.split(":")[0].trim()

export const suggestNextType = (types: RoutineType[], routines: Routine[]): RoutineType | undefined => {
  if (!types.length) return undefined

  const latest = [...routines].sort(
    (a, b) => +new Date((b as { date?: string }).date ?? 0) - +new Date((a as { date?: string }).date ?? 0)
  )[0]
  const lastType = latest && types.find(type => `${type.id}` === `${latest.routineTypeId}`)
  if (!lastType) return types[0]

  const siblings = types.filter(type => family(type.name) === family(lastType.name))
  const index = siblings.findIndex(type => type.id === lastType.id)
  return siblings[(index + 1) % siblings.length] ?? lastType
}
