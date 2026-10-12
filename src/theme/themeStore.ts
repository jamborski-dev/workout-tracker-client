import { useSyncExternalStore } from "react"
import { buildTheme, type ThemeMode, type ThemeStyle } from "./buildTheme"
import { DEFAULT_PALETTE, PALETTES, type PaletteId } from "./palettes"

export type ThemeModePref = "system" | ThemeMode

export type TextSize = "small" | "default" | "large" | "xlarge"
export type Density = "compact" | "comfortable" | "spacious"
export type MotionPref = "system" | "reduced" | "full"

export interface ThemePrefs {
  mode: ThemeModePref
  style: ThemeStyle
  palette: PaletteId
  textSize: TextSize
  density: Density
  motion: MotionPref
}

// Root font size (everything is rem-based, so text and layout scale together) and spacing multiplier
const TEXT_SCALE: Record<TextSize, string> = { small: "87.5%", default: "100%", large: "112.5%", xlarge: "125%" }
const DENSITY_SCALE: Record<Density, string> = { compact: "0.75", comfortable: "1", spacious: "1.3" }

const STORAGE_KEY = "axis:theme"
const DEFAULT_PREFS: ThemePrefs = {
  mode: "system",
  style: "vivid",
  palette: DEFAULT_PALETTE,
  textSize: "default",
  density: "comfortable",
  motion: "system"
}

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
      palette: parsed.palette && parsed.palette in PALETTES ? parsed.palette : DEFAULT_PALETTE,
      textSize: parsed.textSize && parsed.textSize in TEXT_SCALE ? parsed.textSize : DEFAULT_PREFS.textSize,
      density: parsed.density && parsed.density in DENSITY_SCALE ? parsed.density : DEFAULT_PREFS.density,
      motion: ["system", "reduced", "full"].includes(parsed.motion as string)
        ? (parsed.motion as MotionPref)
        : DEFAULT_PREFS.motion
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
  root.style.fontSize = TEXT_SCALE[next.textSize]
  root.style.setProperty("--density", DENSITY_SCALE[next.density])
  root.dataset.motion = next.motion
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
