export const LAST_APP_LOCATION_STORAGE_KEY = "axis:last-app-location"
export const ROUTINES_STATE_STORAGE_KEY = "axis:routines-state"
export const ROUTINE_DRAFT_STORAGE_KEY_PREFIX = "axis:routine-draft"

export const getRoutineDraftStorageKey = (routineId: string | number): string =>
  `${ROUTINE_DRAFT_STORAGE_KEY_PREFIX}:${routineId}`

const getStorage = (): Storage | null => {
  if (typeof window === "undefined") {
    return null
  }

  return window.localStorage
}

export const saveToLocalStorage = <T>(key: string, value: T): void => {
  try {
    const storage = getStorage()
    if (!storage) {
      return
    }

    storage.setItem(key, JSON.stringify(value))
  } catch {
    // Ignore storage write failures (private mode / quota / disabled storage)
  }
}

export const getFromLocalStorage = <T>(key: string): T | null => {
  try {
    const storage = getStorage()
    if (!storage) {
      return null
    }

    const rawValue = storage.getItem(key)

    if (!rawValue) {
      return null
    }

    return JSON.parse(rawValue) as T
  } catch {
    return null
  }
}

export const removeFromLocalStorage = (key: string): void => {
  try {
    const storage = getStorage()
    if (!storage) {
      return
    }

    storage.removeItem(key)
  } catch {
    // Ignore storage remove failures
  }
}
