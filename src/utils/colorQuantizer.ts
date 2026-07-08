import { RGBColor } from '../types'

/**
 * K-Means 颜色聚类
 * 用于将图片颜色量化到指定数量的颜色
 */
export function kMeansQuantize(
  pixels: Uint8ClampedArray,
  k: number,
  maxIterations: number = 10
): { centroids: RGBColor[] } {
  // 收集所有不透明像素
  const samples: RGBColor[] = []
  for (let i = 0; i < pixels.length; i += 4) {
    if (pixels[i + 3] > 128) {
      samples.push({
        r: pixels[i],
        g: pixels[i + 1],
        b: pixels[i + 2],
      })
    }
  }

  if (samples.length === 0) {
    return { centroids: [{ r: 255, g: 255, b: 255 }] }
  }

  // 限制采样数量以加速
  const maxSamples = 5000
  if (samples.length > maxSamples) {
    const step = Math.floor(samples.length / maxSamples)
    const reduced: RGBColor[] = []
    for (let i = 0; i < samples.length; i += step) {
      reduced.push(samples[i])
    }
    samples.length = 0
    samples.push(...reduced)
  }

  // K-Means++ 初始化
  const centroids: RGBColor[] = []
  centroids.push(samples[Math.floor(Math.random() * samples.length)])

  while (centroids.length < k) {
    const distances = samples.map(s => {
      let minDist = Infinity
      for (const c of centroids) {
        const dist = Math.pow(s.r - c.r, 2) + Math.pow(s.g - c.g, 2) + Math.pow(s.b - c.b, 2)
        if (dist < minDist) minDist = dist
      }
      return minDist
    })
    const totalDist = distances.reduce((sum, d) => sum + d, 0)
    let target = Math.random() * totalDist
    let idx = 0
    for (let i = 0; i < distances.length; i++) {
      target -= distances[i]
      if (target <= 0) {
        idx = i
        break
      }
    }
    centroids.push(samples[idx])
  }

  // 迭代聚类
  for (let iter = 0; iter < maxIterations; iter++) {
    const clusters: RGBColor[][] = Array.from({ length: k }, () => [])

    for (const s of samples) {
      let minDist = Infinity
      let cluster = 0
      for (let i = 0; i < centroids.length; i++) {
        const c = centroids[i]
        const dist = Math.pow(s.r - c.r, 2) + Math.pow(s.g - c.g, 2) + Math.pow(s.b - c.b, 2)
        if (dist < minDist) {
          minDist = dist
          cluster = i
        }
      }
      clusters[cluster].push(s)
    }

    let converged = true
    for (let i = 0; i < k; i++) {
      if (clusters[i].length === 0) continue
      const newCentroid = {
        r: Math.round(clusters[i].reduce((s, c) => s + c.r, 0) / clusters[i].length),
        g: Math.round(clusters[i].reduce((s, c) => s + c.g, 0) / clusters[i].length),
        b: Math.round(clusters[i].reduce((s, c) => s + c.b, 0) / clusters[i].length),
      }
      if (
        newCentroid.r !== centroids[i].r ||
        newCentroid.g !== centroids[i].g ||
        newCentroid.b !== centroids[i].b
      ) {
        converged = false
      }
      centroids[i] = newCentroid
    }

    if (converged) break
  }

  return { centroids }
}
