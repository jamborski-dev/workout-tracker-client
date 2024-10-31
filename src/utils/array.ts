import { IDType } from "@root/types/data"
import { FixMeLater } from "@root/types/FixMeLater"

type ReorderableItem = {
  id: IDType
  order: IDType
  [key: string]: FixMeLater
}

export const reorderItems = <T extends ReorderableItem>(
  items: T[],
  itemId: IDType,
  direction: "up" | "down"
): T[] => {
  const itemsCopy = [...items]

  const currentIndex = itemsCopy.findIndex(item => item.id === itemId)
  if (currentIndex === -1) return items // If not found, return the original array

  const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1

  if (newIndex < 0 || newIndex >= itemsCopy.length) {
    return itemsCopy // No reordering if out of bounds
  }

  ;[itemsCopy[currentIndex], itemsCopy[newIndex]] = [itemsCopy[newIndex], itemsCopy[currentIndex]]

  return reindexArray(itemsCopy)
}

export const reindexArray = <T extends ReorderableItem>(items: T[]): T[] => {
  return items.map((item, index) => ({
    ...item,
    order: index
  }))
}

export const trimObjectsArray = (arr: FixMeLater[], keys: string[]) => {
  return arr.map(item => {
    const newObj: Record<string, unknown> = {}
    for (const key in item) {
      if (keys.includes(key)) {
        newObj[key] = item[key]
      }
    }
    return newObj
  })
}
