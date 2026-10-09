import { contrastRatio, ensureInk, fitToInk, mix, over, rgba } from "./color"
import type { Palette } from "./palettes"

export type ThemeMode = "light" | "dark"
export type ThemeStyle = "vivid" | "flat"
export type ThemeVars = Record<string, string>

export interface Theme {
  dark: boolean
  vars: ThemeVars
}

/** Nudges `colour` until it reads as text (>= 4.5:1) on `surface`. */
const readableOn = (colour: string, surface: string, dark: boolean) => {
  let c = colour
  const towards = dark ? "#ffffff" : "#000000"
  for (let i = 0; i < 24 && contrastRatio(c, surface) < 4.5; i++) c = mix(c, towards, 0.07)
  return c
}

interface Spec {
  base: string
  backdrop: string
  surface: string
  elevated: string
  overlay: string
  borderSubtle: string
  borderDefault: string
  borderStrong: string
  cardBorder: string
  cardShadow: string
  text1: string
  text2: string
  text3: string
  success: string
  danger: string
  warning: string
  info: string
  pillBg: string
  glassHeader: string
  glassNav: string
  glassSheet: string
  glassBlur: string
  navShadow: string
  shadowSm: string
  shadowMd: string
  shadowLg: string
}

const flat = (dark: boolean): Spec =>
  dark
    ? {
        base: "#14161b",
        backdrop: "none",
        surface: "#1f2229",
        elevated: "#2a2e37",
        overlay: "#353a45",
        borderSubtle: "rgba(255,255,255,0.08)",
        borderDefault: "rgba(255,255,255,0.14)",
        borderStrong: "rgba(255,255,255,0.28)",
        cardBorder: "rgba(255,255,255,0.08)",
        cardShadow: "0 2px 8px rgba(0,0,0,0.3)",
        text1: "#f4f5f7",
        text2: "#b9bdc8",
        text3: "#9298a6",
        success: "#4ade80",
        danger: "#ff8a8f",
        warning: "#fbbf24",
        info: "#7db4e6",
        pillBg: "#2f343e",
        glassHeader: "#14161b",
        glassNav: "#1b1e24",
        glassSheet: "#1f2229",
        glassBlur: "none",
        navShadow: "0 -1px 0 rgba(255,255,255,0.06)",
        shadowSm: "0 1px 3px rgba(0,0,0,0.3)",
        shadowMd: "0 4px 12px rgba(0,0,0,0.4)",
        shadowLg: "0 8px 24px rgba(0,0,0,0.5)"
      }
    : {
        base: "#f3f4f7",
        backdrop: "none",
        surface: "#ffffff",
        elevated: "#f0f1f5",
        overlay: "#e6e8ee",
        borderSubtle: "rgba(0,0,0,0.07)",
        borderDefault: "rgba(0,0,0,0.13)",
        borderStrong: "rgba(0,0,0,0.26)",
        cardBorder: "rgba(0,0,0,0.07)",
        cardShadow: "0 1px 3px rgba(0,0,0,0.08)",
        text1: "#14161c",
        text2: "#454b5a",
        text3: "#5f6677",
        success: "#0b7d36",
        danger: "#c4212b",
        warning: "#a94a05",
        info: "#1f5fae",
        pillBg: "#e6e8ee",
        glassHeader: "#f3f4f7",
        glassNav: "#ffffff",
        glassSheet: "#ffffff",
        glassBlur: "none",
        navShadow: "0 -1px 0 rgba(0,0,0,0.06)",
        shadowSm: "0 1px 3px rgba(0,0,0,0.08)",
        shadowMd: "0 4px 12px rgba(0,0,0,0.12)",
        shadowLg: "0 8px 24px rgba(0,0,0,0.18)"
      }

// Vivid: gradient glow backdrop with frosted-glass surfaces on top
const vividDark = (p: Palette): Spec => {
  const [g1, g2, g3] = p.glow
  const base = "#0a0c1a"
  const bg = mix(base, g1, 0.1)
  const a = 0.08
  const surface = over("#ffffff", a, bg)
  return {
    base,
    backdrop: `radial-gradient(70% 38% at 12% -4%, ${rgba(g1, 0.55)} 0%, transparent 70%), radial-gradient(60% 34% at 104% 24%, ${rgba(g2, 0.34)} 0%, transparent 72%), radial-gradient(70% 40% at -10% 104%, ${rgba(g3, 0.4)} 0%, transparent 70%), linear-gradient(180deg, #0d1026, #080a17)`,
    surface,
    elevated: over("#ffffff", a + 0.05, bg),
    overlay: over("#ffffff", a + 0.1, bg),
    borderSubtle: "rgba(255,255,255,0.09)",
    borderDefault: "rgba(255,255,255,0.15)",
    borderStrong: "rgba(255,255,255,0.3)",
    cardBorder: "rgba(255,255,255,0.14)",
    cardShadow: "0 1px 0 rgba(255,255,255,0.06) inset, 0 12px 32px -12px rgba(0,0,0,0.6)",
    text1: "#f7f8ff",
    text2: "#c6cadf",
    text3: "#a2a8c4",
    success: "#5eeb98",
    danger: "#ff8d92",
    warning: "#fbbf24",
    info: "#8cc0ee",
    pillBg: "rgba(255,255,255,0.10)",
    glassHeader: "rgba(10,12,26,0.55)",
    glassNav: "rgba(18,21,42,0.68)",
    glassSheet: "rgba(18,21,42,0.82)",
    glassBlur: "blur(20px) saturate(140%)",
    navShadow: "0 -10px 34px -10px rgba(0,0,0,0.45)",
    shadowSm: "0 1px 0 rgba(255,255,255,0.05) inset",
    shadowMd: "0 8px 24px -10px rgba(0,0,0,0.55)",
    shadowLg: "0 16px 40px -14px rgba(0,0,0,0.65)"
  }
}

const vividLight = (p: Palette): Spec => {
  const [g1, g2, g3] = p.glow
  const base = "#f4f1ff"
  const bg = mix(base, g1, 0.06)
  const surface = over("#ffffff", 0.74, bg)
  return {
    base,
    backdrop: `radial-gradient(70% 38% at 10% -4%, ${rgba(g1, 0.3)} 0%, transparent 70%), radial-gradient(60% 34% at 104% 22%, ${rgba(g2, 0.26)} 0%, transparent 72%), radial-gradient(70% 40% at -8% 104%, ${rgba(g3, 0.26)} 0%, transparent 70%), linear-gradient(165deg, #f7f4ff, #fff2ea)`,
    surface,
    elevated: mix(surface, "#1e1e46", 0.05),
    overlay: mix(surface, "#1e1e46", 0.1),
    borderSubtle: "rgba(30,30,70,0.09)",
    borderDefault: "rgba(30,30,70,0.16)",
    borderStrong: "rgba(30,30,70,0.3)",
    cardBorder: "rgba(255,255,255,0.95)",
    cardShadow: `0 1px 0 rgba(255,255,255,0.9) inset, 0 14px 34px -14px ${rgba(g1, 0.38)}`,
    text1: "#12141f",
    text2: "#43495c",
    text3: "#5f6679",
    success: "#0b7d36",
    danger: "#c4212b",
    warning: "#a94a05",
    info: "#1f5fae",
    pillBg: "rgba(30,30,70,0.07)",
    glassHeader: "rgba(247,244,255,0.6)",
    glassNav: "rgba(255,255,255,0.72)",
    glassSheet: "rgba(255,255,255,0.86)",
    glassBlur: "blur(20px) saturate(140%)",
    navShadow: "0 -10px 34px -10px rgba(30,30,70,0.25)",
    shadowSm: "0 1px 2px rgba(30,30,70,0.08)",
    shadowMd: `0 8px 24px -10px ${rgba(g1, 0.3)}`,
    shadowLg: `0 16px 40px -14px ${rgba(g1, 0.38)}`
  }
}

export function buildTheme(mode: ThemeMode, style: ThemeStyle, palette: Palette): Theme {
  const dark = mode === "dark"
  const spec = style === "flat" ? flat(dark) : dark ? vividDark(palette) : vividLight(palette)

  // Accent fill with guaranteed-readable ink, plus the same accent tuned to read as text
  const { colour: accent, ink } = ensureInk(palette.primary)
  // The gradient end only needs UI-level contrast (3:1), which keeps it bright
  const accentTo = fitToInk(palette.secondary, ink, 3)
  const accentText = readableOn(palette.primary, spec.surface, dark)
  const accentGradient =
    style === "flat" ? accent : `linear-gradient(135deg, ${accent}, ${accentTo})`

  const vars: ThemeVars = {
    "--bg-base": spec.base,
    "--bg-backdrop": spec.backdrop,
    "--surface": spec.surface,
    "--surface-elevated": spec.elevated,
    "--surface-overlay": spec.overlay,
    "--border-subtle": spec.borderSubtle,
    "--border-default": spec.borderDefault,
    "--border-strong": spec.borderStrong,
    "--card-border": spec.cardBorder,
    "--card-shadow": spec.cardShadow,
    "--text-1": spec.text1,
    "--text-2": spec.text2,
    "--text-3": spec.text3,
    "--success": spec.success,
    "--danger": spec.danger,
    "--warning": spec.warning,
    "--info": spec.info,
    "--pill-bg": spec.pillBg,
    "--glass-header": spec.glassHeader,
    "--glass-nav": spec.glassNav,
    "--glass-sheet": spec.glassSheet,
    "--glass-blur": spec.glassBlur,
    "--nav-shadow": spec.navShadow,
    "--shadow-sm": spec.shadowSm,
    "--shadow-md": spec.shadowMd,
    "--shadow-lg": spec.shadowLg,
    "--accent": accent,
    "--accent-to": accentTo,
    "--accent-gradient": accentGradient,
    "--accent-contrast": ink,
    "--accent-text": accentText,
    "--accent-soft": rgba(palette.primary, dark ? 0.22 : 0.14),
    "--accent-glow": `0 8px 24px -8px ${rgba(palette.primary, 0.6)}`,
    "--secondary": palette.secondary,
    // Legacy names still used by older styles
    "--app-bg": spec.base,
    "--app-accent": accent,
    "--app-accent-hover": mix(accent, dark ? "#ffffff" : "#000000", 0.12),
    "--surface-movement-block": spec.surface
  }

  return { dark, vars }
}
