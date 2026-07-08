import { ImageAdjustments } from '../types'

/**
 * 应用图像美化参数，返回调整后的图片 dataURL
 * 使用 Canvas 像素处理实现对比度、饱和度、亮度调整
 */
export function applyImageAdjustments(
  imageUrl: string,
  adjustments: ImageAdjustments
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')!

      canvas.width = img.width
      canvas.height = img.height
      ctx.drawImage(img, 0, 0)

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const pixels = imageData.data

      // 调整参数
      const contrast = adjustments.contrast
      const saturation = adjustments.saturation
      const brightness = adjustments.brightness

      // 对比度系数（绕 128 中心旋转）
      const contrastFactor = (259 * (contrast * 100 + 255)) / (255 * (259 - contrast * 100))
      // 亮度偏移量
      const brightnessOffset = (brightness - 1) * 255

      for (let i = 0; i < pixels.length; i += 4) {
        let r = pixels[i]
        let g = pixels[i + 1]
        let b = pixels[i + 2]

        // 对比度调整
        r = contrastFactor * (r - 128) + 128
        g = contrastFactor * (g - 128) + 128
        b = contrastFactor * (b - 128) + 128

        // 亮度调整
        r = r + brightnessOffset
        g = g + brightnessOffset
        b = b + brightnessOffset

        // 饱和度调整
        const gray = 0.299 * r + 0.587 * g + 0.114 * b
        r = gray + saturation * (r - gray)
        g = gray + saturation * (g - gray)
        b = gray + saturation * (b - gray)

        // 限制在 0-255 范围
        pixels[i] = Math.max(0, Math.min(255, r))
        pixels[i + 1] = Math.max(0, Math.min(255, g))
        pixels[i + 2] = Math.max(0, Math.min(255, b))
      }

      ctx.putImageData(imageData, 0, 0)
      resolve(canvas.toDataURL('image/png'))
    }

    img.onerror = () => reject(new Error('图片加载失败'))
    img.src = imageUrl
  })
}

/**
 * 获取图片的主色调
 * 返回出现频率最高的颜色
 */
export function getImageMainColors(
  imageUrl: string,
  count: number = 12
): Promise<{ r: number; g: number; b: number; count: number }[]> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')!

      // 缩小到 100x100 加速分析
      const sampleSize = 100
      canvas.width = sampleSize
      canvas.height = sampleSize
      ctx.drawImage(img, 0, 0, sampleSize, sampleSize)

      const imageData = ctx.getImageData(0, 0, sampleSize, sampleSize)
      const pixels = imageData.data

      // 颜色量化到 32 级
      const colorMap = new Map<string, { r: number; g: number; b: number; count: number }>()

      for (let i = 0; i < pixels.length; i += 4) {
        const r = pixels[i]
        const g = pixels[i + 1]
        const b = pixels[i + 2]
        const a = pixels[i + 3]

        if (a < 128) continue

        // 量化到 32 级（8 倍步长）
        const qr = Math.round(r / 32) * 32
        const qg = Math.round(g / 32) * 32
        const qb = Math.round(b / 32) * 32
        const key = `${qr}-${qg}-${qb}`

        const existing = colorMap.get(key)
        if (existing) {
          existing.count++
          existing.r = Math.round((existing.r + r) / 2)
          existing.g = Math.round((existing.g + g) / 2)
          existing.b = Math.round((existing.b + b) / 2)
        } else {
          colorMap.set(key, { r, g, b, count: 1 })
        }
      }

      const sortedColors = Array.from(colorMap.values())
        .sort((a, b) => b.count - a.count)
        .slice(0, count)

      resolve(sortedColors)
    }

    img.onerror = () => reject(new Error('图片加载失败'))
    img.src = imageUrl
  })
}

/**
 * 默认图像美化参数
 */
export const defaultAdjustments: ImageAdjustments = {
  contrast: 1.0,
  saturation: 1.0,
  brightness: 1.0,
}
