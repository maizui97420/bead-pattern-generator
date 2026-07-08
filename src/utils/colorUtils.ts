import { RGBColor, ColorInfo } from '../types'

export function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(x => {
    const hex = Math.round(x).toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }).join('')
}

export function hexToRgb(hex: string): RGBColor | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  } : null
}

export function rgbToLab(r: number, g: number, b: number): [number, number, number] {
  const r1 = r / 255
  const g1 = g / 255
  const b1 = b / 255

  const r2 = r1 > 0.04045 ? Math.pow((r1 + 0.055) / 1.055, 2.4) : r1 / 12.92
  const g2 = g1 > 0.04045 ? Math.pow((g1 + 0.055) / 1.055, 2.4) : g1 / 12.92
  const b2 = b1 > 0.04045 ? Math.pow((b1 + 0.055) / 1.055, 2.4) : b1 / 12.92

  const x = (r2 * 0.4124 + g2 * 0.3576 + b2 * 0.1805) / 0.95047
  const y = (r2 * 0.2126 + g2 * 0.7152 + b2 * 0.0722) / 1.00000
  const z = (r2 * 0.0193 + g2 * 0.1192 + b2 * 0.9505) / 1.08883

  const x2 = x > 0.008856 ? Math.pow(x, 1/3) : (7.787 * x) + 16/116
  const y2 = y > 0.008856 ? Math.pow(y, 1/3) : (7.787 * y) + 16/116
  const z2 = z > 0.008856 ? Math.pow(z, 1/3) : (7.787 * z) + 16/116

  return [(116 * y2) - 16, 500 * (x2 - y2), 200 * (y2 - z2)]
}

export function calculateColorDistance(color1: RGBColor, color2: RGBColor): number {
  const [l1, a1, b1] = rgbToLab(color1.r, color1.g, color1.b)
  const [l2, a2, b2] = rgbToLab(color2.r, color2.g, color2.b)
  return Math.sqrt(Math.pow(l1 - l2, 2) + Math.pow(a1 - a2, 2) + Math.pow(b1 - b2, 2))
}

export function findClosestColor(targetColor: RGBColor, palette: ColorInfo[]): ColorInfo {
  let closestColor = palette[0]
  let minDistance = Infinity

  for (const color of palette) {
    const distance = calculateColorDistance(targetColor, color)
    if (distance < minDistance) {
      minDistance = distance
      closestColor = color
    }
  }

  return closestColor
}

export function getColorStatistics(grid: ColorInfo[][]): Map<string, { color: ColorInfo; count: number }> {
  const stats = new Map<string, { color: ColorInfo; count: number }>()

  for (const row of grid) {
    for (const cell of row) {
      const key = rgbToHex(cell.r, cell.g, cell.b)
      if (stats.has(key)) {
        stats.get(key)!.count++
      } else {
        stats.set(key, { color: cell, count: 1 })
      }
    }
  }

  return stats
}
