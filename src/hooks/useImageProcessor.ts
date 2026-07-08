import { useState, useCallback } from 'react'
import { ColorInfo, GridSettings, WorkMode } from '../types'
import { findClosestColor } from '../utils/colorUtils'
import { removeBackgroundSmart } from '../utils/backgroundRemover'
import { kMeansQuantize } from '../utils/colorQuantizer'

/** 加载到 canvas 的图片 */
function loadImage(imageUrl: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('图片加载失败'))
    img.src = imageUrl
  })
}

/**
 * 图像处理 Hook
 * 支持三种工作模式：生成拼豆、直接编辑、像素图
 * 支持撤销/重做
 */
export function useImageProcessor() {
  const [grid, setGrid] = useState<ColorInfo[][]>([])
  const [originalImage, setOriginalImage] = useState<string | null>(null)
  const [processedImage, setProcessedImage] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isRemovingBackground, setIsRemovingBackground] = useState(false)

  // 撤销/重做历史
  const [history, setHistory] = useState<ColorInfo[][][]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)

  /**
   * 推入历史记录
   */
  const pushHistory = useCallback((newGrid: ColorInfo[][]) => {
    setHistory(prev => {
      const truncated = prev.slice(0, historyIndex + 1)
      truncated.push(newGrid)
      // 限制历史记录数量
      if (truncated.length > 30) {
        truncated.shift()
      }
      return truncated
    })
    setHistoryIndex(prev => Math.min(prev + 1, 29))
  }, [historyIndex])

  /**
   * 撤销
   */
  const undo = useCallback(() => {
    if (historyIndex <= 0) return
    const newIndex = historyIndex - 1
    setHistoryIndex(newIndex)
    setGrid(history[newIndex])
  }, [history, historyIndex])

  /**
   * 重做
   */
  const redo = useCallback(() => {
    if (historyIndex >= history.length - 1) return
    const newIndex = historyIndex + 1
    setHistoryIndex(newIndex)
    setGrid(history[newIndex])
  }, [history, historyIndex])

  /**
   * 清除网格
   */
  const clearGrid = useCallback(() => {
    setGrid([])
    setOriginalImage(null)
    setProcessedImage(null)
    setHistory([])
    setHistoryIndex(-1)
  }, [])

  /**
   * 根据工作模式处理图片
   * - generate: 生成拼豆模式（颜色匹配）
   * - edit: 直接编辑模式（保留原色）
   * - pixel: 像素图模式（1:1 映射）
   */
  const processImage = useCallback(async (
    imageUrl: string,
    settings: GridSettings,
    palette: ColorInfo[],
    workMode: WorkMode,
    colorLimit: number,
    useTransparentBackground: boolean = false
  ): Promise<void> => {
    setIsProcessing(true)
    try {
      const img = await loadImage(imageUrl)
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')!

      canvas.width = settings.width
      canvas.height = settings.height

      if (useTransparentBackground) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
      } else {
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      }

      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = 'high'
      ctx.drawImage(img, 0, 0, settings.width, settings.height)

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const pixels = imageData.data

      let workingPalette = palette

      // 像素图模式：使用 K-Means 聚类生成精确的调色板
      if (workMode === 'pixel' && colorLimit < palette.length) {
        const { centroids } = kMeansQuantize(pixels, colorLimit)
        workingPalette = centroids.map((c, i) => ({
          ...c,
          id: `quantized-${i}`,
          name: `自动色 ${i + 1}`,
        }))
      }

      const newGrid: ColorInfo[][] = []

      for (let y = 0; y < settings.height; y++) {
        const row: ColorInfo[] = []
        for (let x = 0; x < settings.width; x++) {
          const index = (y * settings.width + x) * 4
          const r = pixels[index]
          const g = pixels[index + 1]
          const b = pixels[index + 2]
          const a = pixels[index + 3]

          // 透明像素使用白色
          if (a < 50) {
            const whiteColor = workingPalette.find(c => c.id === 'white' || c.id === 'K10') || workingPalette[0]
            row.push(whiteColor)
            continue
          }

          // 直接编辑模式：保留原色
          if (workMode === 'edit') {
            row.push({
              id: `original-${x}-${y}-${Date.now()}`,
              name: `原色 #${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`,
              r,
              g,
              b,
            })
          } else {
            // 生成/像素图模式：颜色匹配
            const closestColor = findClosestColor({ r, g, b }, workingPalette)
            row.push(closestColor)
          }
        }
        newGrid.push(row)
      }

      setGrid(newGrid)
      setOriginalImage(imageUrl)
      setHistory([newGrid])
      setHistoryIndex(0)
    } catch (error) {
      console.error('图片处理失败:', error)
      throw error
    } finally {
      setIsProcessing(false)
    }
  }, [])

  /**
   * 去除背景
   */
  const removeBackground = useCallback(async (imageUrl: string): Promise<string> => {
    setIsRemovingBackground(true)
    try {
      const result = await removeBackgroundSmart(imageUrl)
      setProcessedImage(result)
      return result
    } catch (error) {
      console.error('背景去除失败:', error)
      throw error
    } finally {
      setIsRemovingBackground(false)
    }
  }, [])

  /**
   * 修改单个网格颜色（用于直接编辑模式）
   */
  const updateCell = useCallback((x: number, y: number, color: ColorInfo) => {
    setGrid(prev => {
      const newGrid = prev.map(row => [...row])
      if (newGrid[y]) {
        newGrid[y][x] = color
      }
      return newGrid
    })
  }, [])

  /**
   * 替换所有指定颜色
   */
  const replaceColor = useCallback((oldColor: ColorInfo, newColor: ColorInfo) => {
    setGrid(prev => {
      const newGrid = prev.map(row =>
        row.map(cell =>
          cell.r === oldColor.r && cell.g === oldColor.g && cell.b === oldColor.b
            ? newColor
            : cell
        )
      )
      pushHistory(newGrid)
      return newGrid
    })
  }, [pushHistory])

  return {
    grid,
    originalImage,
    processedImage,
    isProcessing,
    isRemovingBackground,
    historyIndex,
    historyLength: history.length,
    canUndo: historyIndex > 0,
    canRedo: historyIndex < history.length - 1,
    processImage,
    removeBackground,
    clearGrid,
    undo,
    redo,
    updateCell,
    replaceColor,
  }
}
