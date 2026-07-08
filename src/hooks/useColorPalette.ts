import { useState, useCallback, useMemo } from 'react'
import { ColorInfo, Palette } from '../types'
import { mardPalette, seriesConfig, getAllSeries, getColorsBySeries } from '../data/mardPalette'

/**
 * 将 MARD 色库转换为 ColorInfo 数组
 */
function mardToColorInfo(mardColors: typeof mardPalette): ColorInfo[] {
  return mardColors.map(c => ({
    id: c.code,
    name: `${c.code} ${c.name}`,
    code: c.code,
    r: c.r,
    g: c.g,
    b: c.b,
  }))
}

/**
 * 颜色调色板管理 Hook
 * 支持 MARD 完整色库、颜色编辑、添加、删除
 */
export function useColorPalette() {
  // 所有 MARD 颜色
  const allMardColors = useMemo(() => mardToColorInfo(mardPalette), [])

  // 选中的色系
  const [selectedSeries, setSelectedSeries] = useState<string>('all')
  // 当前用户使用的颜色（可编辑）
  const [activeColors, setActiveColors] = useState<ColorInfo[]>(
    mardToColorInfo(mardPalette).slice(0, 30) // 默认前 30 种
  )

  // 当前选中的颜色（用于调色板中的高亮）
  const [currentColor, setCurrentColor] = useState<ColorInfo | null>(null)

  // 可用的色系
  const allSeries = useMemo(() => getAllSeries(), [])

  /**
   * 当前显示的颜色列表（按色系筛选）
   */
  const displayedColors = useMemo(() => {
    if (selectedSeries === 'all') {
      return allMardColors
    }
    const mardColors = getColorsBySeries(selectedSeries)
    return mardToColorInfo(mardColors)
  }, [selectedSeries, allMardColors])

  /**
   * 添加颜色到活动调色板
   */
  const addToActive = useCallback((color: ColorInfo) => {
    setActiveColors(prev => {
      if (prev.some(c => c.r === color.r && c.g === color.g && c.b === color.b)) {
        return prev
      }
      return [...prev, color]
    })
  }, [])

  /**
   * 从活动调色板移除颜色
   */
  const removeFromActive = useCallback((colorId: string) => {
    setActiveColors(prev => prev.filter(c => c.id !== colorId))
  }, [])

  /**
   * 编辑活动调色板中的颜色
   */
  const editColor = useCallback((oldColorId: string, newColor: Omit<ColorInfo, 'id'>) => {
    setActiveColors(prev => prev.map(c =>
      c.id === oldColorId ? { ...newColor, id: oldColorId } : c
    ))
  }, [])

  /**
   * 清除活动调色板
   */
  const clearActive = useCallback(() => {
    setActiveColors([])
    setCurrentColor(null)
  }, [])

  /**
   * 恢复默认调色板
   */
  const resetActive = useCallback(() => {
    setActiveColors(mardToColorInfo(mardPalette).slice(0, 30))
  }, [])

  /**
   * 选择颜色
   */
  const selectColor = useCallback((color: ColorInfo | null) => {
    setCurrentColor(color)
  }, [])

  return {
    // 预设调色板
    palettes: [
      {
        id: 'mard',
        name: '💎 MARD 拼豆色库',
        colors: allMardColors,
      },
    ] as Palette[],
    currentPaletteId: 'mard',
    // MARD 完整色库
    mardColors: allMardColors,
    // 当前显示的颜色（按色系筛选）
    displayedColors,
    // 当前选中的色系
    selectedSeries,
    setSelectedSeries,
    // 所有色系
    allSeries,
    seriesConfig,
    // 活动调色板
    activeColors,
    // 当前选中的颜色
    currentColor,
    // 操作方法
    addToActive,
    removeFromActive,
    editColor,
    clearActive,
    resetActive,
    selectColor,
  }
}
