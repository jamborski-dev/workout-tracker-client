import { mix, rotateHue } from "./color"

export type PaletteId = "ember" | "volt" | "pulse" | "glacier"

export interface Palette {
  id: PaletteId
  name: string
  tagline: string
  /** Brand colour: primary buttons, active states */
  primary: string
  /** Partner colour for gradients and progress */
  secondary: string
  /** Three colours for the blurred backdrop glows */
  glow: [string, string, string]
}

// Workout-flavoured palettes: energetic, saturated, designed to glow on dark and pop on light.
export const PALETTES: Record<PaletteId, Palette> = {
  ember: {
    id: "ember",
    name: "Ember",
    tagline: "Burn it down",
    primary: "#FF4D2E",
    secondary: "#FFB020",
    glow: ["#FF4D2E", "#FF9F1C", "#B5179E"]
  },
  volt: {
    id: "volt",
    name: "Volt",
    tagline: "Neon gym floor",
    primary: "#A3E635",
    secondary: "#19E6A0",
    glow: ["#84CC16", "#19E6A0", "#2563EB"]
  },
  pulse: {
    id: "pulse",
    name: "Pulse",
    tagline: "Heart rate up",
    primary: "#7C3AED",
    secondary: "#F43F5E",
    glow: ["#7C3AED", "#F43F5E", "#22D3EE"]
  },
  glacier: {
    id: "glacier",
    name: "Glacier",
    tagline: "Cold plunge",
    primary: "#0891B2",
    secondary: "#3B82F6",
    glow: ["#00B8FF", "#2DD4BF", "#6366F1"]
  }
}

export const PALETTE_IDS = Object.keys(PALETTES) as PaletteId[]
export const DEFAULT_PALETTE: PaletteId = "volt"

/** CSS gradient used for swatches in the picker */
export const swatch = (palette: Palette) =>
  `linear-gradient(90deg, ${palette.primary} 0 62%, ${palette.secondary} 62% 100%)`

// Handy for deriving extra stops from a palette
export const tint = (palette: Palette, deg: number) => mix(rotateHue(palette.primary, deg), "#ffffff", 0.2)
