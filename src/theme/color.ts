export type Rgb = [number, number, number]

export function hexToRgb(hex: string): Rgb {
  let h = hex.replace("#", "")
  if (h.length === 3)
    h = h
      .split("")
      .map(c => c + c)
      .join("")
  return [0, 2, 4].map((i) => Number.parseInt(h.slice(i, i + 2), 16)) as Rgb
}

export function rgbToHex([r, g, b]: Rgb): string {
  const to = (v: number): string =>
    Math.max(0, Math.min(255, Math.round(v)))
      .toString(16)
      .padStart(2, "0")
  return `#${to(r)}${to(g)}${to(b)}`
}

/** Linear mix of two hex colours; `t` is the weight of `b` (0 → a, 1 → b). */
export function mix(a: string, b: string, t: number): string {
  const A = hexToRgb(a)
  const B = hexToRgb(b)
  return rgbToHex(A.map((v, i) => v + (B[i] - v) * t) as Rgb)
}

/** `fg` at `alpha` composited over the opaque colour `bg`, returned as an opaque hex. */
export function over(fg: string, alpha: number, bg: string): string {
  return mix(bg, fg, alpha)
}

export function rgba(hex: string, alpha: number): string {
  const [r, g, b] = hexToRgb(hex)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

export function luminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex).map(v => {
    const c = v / 255
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

/** WCAG 2.x contrast ratio between two opaque hex colours. */
export function contrastRatio(a: string, b: string): number {
  const x = luminance(a)
  const y = luminance(b)
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05)
}

const INK_LIGHT = "#ffffff"
const INK_DARK = "#0b0d12"

/** The more readable of white / near-black on `bg`. */
export function bestText(bg: string): string {
  return contrastRatio(bg, INK_LIGHT) >= contrastRatio(bg, INK_DARK) ? INK_LIGHT : INK_DARK
}

export function rgbToHsl([r, g, b]: Rgb): [number, number, number] {
  const rn = r / 255
  const gn = g / 255
  const bn = b / 255
  const max = Math.max(rn, gn, bn)
  const min = Math.min(rn, gn, bn)
  const l = (max + min) / 2
  if (max === min) return [0, 0, l]
  const d = max - min
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
  let h: number
  if (max === rn) h = (gn - bn) / d + (gn < bn ? 6 : 0)
  else if (max === gn) h = (bn - rn) / d + 2
  else h = (rn - gn) / d + 4
  return [h * 60, s, l]
}

export function hslToRgb(h: number, s: number, l: number): Rgb {
  const hue = ((h % 360) + 360) % 360
  const c = (1 - Math.abs(2 * l - 1)) * s
  const x = c * (1 - Math.abs(((hue / 60) % 2) - 1))
  const m = l - c / 2
  let rgb: Rgb
  if (hue < 60) rgb = [c, x, 0]
  else if (hue < 120) rgb = [x, c, 0]
  else if (hue < 180) rgb = [0, c, x]
  else if (hue < 240) rgb = [0, x, c]
  else if (hue < 300) rgb = [x, 0, c]
  else rgb = [c, 0, x]
  return rgb.map(v => (v + m) * 255) as Rgb
}

/** Rotates the hue of `hex` by `deg` degrees, keeping saturation and lightness. */
export function rotateHue(hex: string, deg: number): string {
  const [h, s, l] = rgbToHsl(hexToRgb(hex))
  return rgbToHex(hslToRgb(h + deg, s, l))
}

export interface InkedColour {
  colour: string
  ink: string
}

/**
 * Returns `colour` (nudged if needed) together with the white / near-black ink that reads on it at
 * `min` contrast. White ink on a slightly deepened colour is preferred (it looks richer on brand
 * fills); only if that would take the colour too far from the original does it fall back to dark
 * ink, lightening if needed. Used for buttons and active pills so any user colour is safe.
 */
export function ensureInk(colour: string, min = 4.5): InkedColour {
  let c = colour
  for (let i = 0; i < 5; i++) {
    if (contrastRatio(c, INK_LIGHT) >= min) return { colour: c, ink: INK_LIGHT }
    c = mix(c, "#000000", 0.06)
  }
  c = colour
  for (let i = 0; i < 24; i++) {
    if (contrastRatio(c, INK_DARK) >= min) return { colour: c, ink: INK_DARK }
    c = mix(c, "#ffffff", 0.06)
  }
  return { colour: c, ink: INK_DARK }
}

/** Nudges `colour` lighter or darker until `ink` reads on it at `min` contrast. */
export function fitToInk(colour: string, ink: string, min = 4.5): string {
  let c = colour
  const towards = ink === INK_LIGHT ? "#000000" : "#ffffff"
  for (let i = 0; i < 24 && contrastRatio(c, ink) < min; i++) c = mix(c, towards, 0.06)
  return c
}

export interface CardColour {
  from: string
  to: string
  text: string
}

/** Darkens a two-stop gradient until white or near-black text reaches `min` on both stops. */
export function ensureCard([from, to]: [string, string], min = 4.5): CardColour {
  let a = from
  let b = to
  for (let i = 0; i < 16; i++) {
    const worst = (ink: string): number => Math.min(contrastRatio(a, ink), contrastRatio(b, ink))
    if (worst(INK_LIGHT) >= min) return { from: a, to: b, text: INK_LIGHT }
    if (worst(INK_DARK) >= min) return { from: a, to: b, text: INK_DARK }
    a = mix(a, "#000000", 0.08)
    b = mix(b, "#000000", 0.08)
  }
  return { from: a, to: b, text: INK_LIGHT }
}
