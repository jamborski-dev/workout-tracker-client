import { useSyncExternalStore } from "react"
import { buildTheme, type ThemeMode, type ThemeStyle } from "./buildTheme"
import { DEFAULT_PALETTE, PALETTES, type PaletteId } from "./palettes"

export type ThemeModePref = "system" | ThemeMode

export interface ThemePrefs {
  mode: ThemeModePref
  style: ThemeStyle
  palette: PaletteId
}

const STORAGE_KEY = "axis:theme"
const DEFAULT_PREFS: ThemePrefs = { mode: "system", style: "vivid", palette: DEFAULT_PALETTE }

const readPrefs = (): ThemePrefs => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_PREFS
    const parsed = JSON.parse(raw) as Partial<ThemePrefs>
    return {
      mode: ["system", "light", "dark"].includes(parsed.mode as string)
        ? (parsed.mode as ThemeModePref)
        : DEFAULT_PREFS.mode,
      style: parsed.style === "flat" ? "flat" : "vivid",
      palette: parsed.palette && parsed.palette in PALETTES ? parsed.palette : DEFAULT_PALETTE
    }
  } catch {
    return DEFAULT_PREFS
  }
}

let prefs: ThemePrefs = DEFAULT_PREFS
const listeners = new Set<() => void>()
const darkQuery =
  typeof window !== "undefined" && window.matchMedia
    ? window.matchMedia("(prefers-color-scheme: dark)")
    : null

const resolveMode = (pref: ThemeModePref): ThemeMode =>
  pref === "system" ? (darkQuery?.matches ? "dark" : "light") : pref

export const applyTheme = (next: ThemePrefs = prefs) => {
  const mode = resolveMode(next.mode)
  const theme = buildTheme(mode, next.style, PALETTES[next.palette])
  const root = document.documentElement
  for (const [name, value] of Object.entries(theme.vars)) root.style.setProperty(name, value)
  root.dataset.theme = mode
  root.dataset.themeStyle = next.style
  root.style.colorScheme = mode
}

export const setThemePrefs = (patch: Partial<ThemePrefs>) => {
  prefs = { ...prefs, ...patch }
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs))
  } catch {
    // storage unavailable: the preference just won't persist
  }
  applyTheme(prefs)
  for (const listener of listeners) listener()
}

/** Call once before the first render so the page never flashes the wrong theme. */
export const initTheme = () => {
  prefs = readPrefs()
  applyTheme(prefs)
  darkQuery?.addEventListener("change", () => {
    if (prefs.mode === "system") applyTheme(prefs)
  })
}

export const useThemePrefs = (): ThemePrefs =>
  useSyncExternalStore(
    listener => {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
    () => prefs
  )
