// Function to convert Hex to RGB
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  // Remove the hash at the start if it's there
  hex = hex.replace(/^#/, "")

  // Handle shorthand notation like #03F
  if (hex.length === 3) {
    hex = hex
      .split("")
      .map(char => char + char)
      .join("")
  }

  // If not a valid 6-character hex code, return null
  if (hex.length !== 6) {
    return null
  }

  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)

  return { r, g, b }
}

// Function to convert RGB to HSL
function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255
  g /= 255
  b /= 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0,
    s = 0
  const l = (max + min) / 2

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0)
        break
      case g:
        h = (b - r) / d + 2
        break
      case b:
        h = (r - g) / d + 4
        break
    }
    h *= 60
  }

  return { h, s: s * 100, l: l * 100 }
}

// Function to convert HSL to CSS format
function hslToCss(h: number, s: number, l: number): string {
  return `hsl(${h.toFixed(0)}, ${s.toFixed(0)}%, ${l.toFixed(0)}%)`
}

// Function to generate a gradient from a hex color
export function generateHslGradientFromHex(hex: string, colorShift = 15, angle = 135): string {
  // Convert the Hex to RGB
  const rgb = hexToRgb(hex)
  if (!rgb) {
    throw new Error("Invalid hex color")
  }

  // Convert the RGB to HSL
  const { h, s, l } = rgbToHsl(rgb.r, rgb.g, rgb.b)

  // Create the original HSL color
  const originalHsl = hslToCss(h, s, l)

  // Create the HSL color with the hue shifted by 15 degrees
  const adjustedHsl = hslToCss((h + colorShift) % 360, s, l)

  // Return the CSS gradient string
  return `linear-gradient(${angle}deg, ${originalHsl}, ${adjustedHsl})`
}
