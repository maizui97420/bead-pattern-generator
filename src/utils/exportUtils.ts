import { ColorInfo, ExportOptions } from '../types'
import { rgbToHex } from './colorUtils'

/** 统计项数据结构 */
interface StatItem {
  hex: string
  color: ColorInfo
  count: number
  percentage: string
}

/**
 * 计算颜色统计，按数量降序排列
 */
function calcColorStats(grid: ColorInfo[][]): StatItem[] {
  const map = new Map<string, { color: ColorInfo; count: number }>()
  const total = grid.length * (grid[0]?.length || 0)

  for (const row of grid) {
    for (const cell of row) {
      const key = rgbToHex(cell.r, cell.g, cell.b)
      const existing = map.get(key)
      if (existing) {
        existing.count++
      } else {
        map.set(key, { color: cell, count: 1 })
      }
    }
  }

  return Array.from(map.entries())
    .map(([hex, { color, count }]) => ({
      hex,
      color,
      count,
      percentage: total > 0 ? ((count / total) * 100).toFixed(1) : '0.0',
    }))
    .sort((a, b) => b.count - a.count)
}

/**
 * 导出为 PNG 图片
 * 底部附带详细的颜色统计表格（名称、色号、数量、百分比）
 */
export async function exportToPNG(
  grid: ColorInfo[][],
  options: ExportOptions,
  beadSize: number
): Promise<void> {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')!

  const padding = 40
  const cellSize = beadSize * options.resolution
  const gridW = grid[0]?.length || 0
  const gridH = grid.length

  // 图纸主体尺寸
  const patternWidth = gridW * cellSize
  const patternHeight = gridH * cellSize

  // 统计区域参数
  const stats = calcColorStats(grid)
  const colWidth = 220 // 每列宽度
  const cols = Math.max(1, Math.floor(patternWidth / colWidth))
  const rows = Math.ceil(stats.length / cols)
  const rowHeight = 28 // 每行高度
  const legendTitleH = 36 // 标题高度
  const legendGap = 20 // 图纸与统计之间的间距
  const legendHeight = options.includeLegend
    ? legendTitleH + rows * rowHeight + padding
    : 0

  // 画布总尺寸
  canvas.width = Math.max(patternWidth + padding * 2, cols * colWidth + padding * 2)
  canvas.height = patternHeight + padding * 2 + legendGap + legendHeight

  // 白色背景
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // 绘制标题
  ctx.font = 'bold 18px Arial, "Microsoft YaHei", sans-serif'
  ctx.fillStyle = '#1f2937'
  ctx.textAlign = 'center'
  ctx.fillText(
    `拼豆图纸  ${gridW} × ${gridH} = ${gridW * gridH} 颗`,
    canvas.width / 2,
    28
  )

  // 绘制网格拼豆
  ctx.strokeStyle = '#d1d5db'
  ctx.lineWidth = 0.5
  for (let y = 0; y < gridH; y++) {
    for (let x = 0; x < gridW; x++) {
      const cell = grid[y][x]
      const cx = padding + x * cellSize + cellSize / 2
      const cy = padding + 30 + y * cellSize + cellSize / 2
      const r = cellSize / 2 - 1

      ctx.beginPath()
      ctx.arc(cx, cy, Math.max(r, 2), 0, Math.PI * 2)
      ctx.fillStyle = rgbToHex(cell.r, cell.g, cell.b)
      ctx.fill()
      ctx.stroke()
    }
  }

  // 绘制统计区域
  if (options.includeLegend && stats.length > 0) {
    const legendTop = padding + 30 + patternHeight + legendGap

    // 统计标题 + 分隔线
    ctx.beginPath()
    ctx.moveTo(padding, legendTop)
    ctx.lineTo(canvas.width - padding, legendTop)
    ctx.strokeStyle = '#e5e7eb'
    ctx.lineWidth = 1
    ctx.stroke()

    ctx.font = 'bold 14px Arial, "Microsoft YaHei", sans-serif'
    ctx.fillStyle = '#374151'
    ctx.textAlign = 'left'
    ctx.fillText(`🎨 颜色统计  （共 ${stats.length} 种颜色）`, padding, legendTop + 22)

    // 绘制每个颜色的统计行
    const startY = legendTop + legendTitleH
    stats.forEach((s, idx) => {
      const col = idx % cols
      const row = Math.floor(idx / cols)
      const x = padding + col * colWidth
      const y = startY + row * rowHeight

      // 颜色圆点
      ctx.beginPath()
      ctx.arc(x + 10, y + 10, 8, 0, Math.PI * 2)
      ctx.fillStyle = s.hex
      ctx.fill()
      ctx.strokeStyle = '#d1d5db'
      ctx.lineWidth = 0.5
      ctx.stroke()

      // 颜色名称
      ctx.font = '12px Arial, "Microsoft YaHei", sans-serif'
      ctx.fillStyle = '#1f2937'
      ctx.textAlign = 'left'
      const nameText = s.color.name.length > 8 ? s.color.name.slice(0, 8) + '…' : s.color.name
      ctx.fillText(nameText, x + 26, y + 10)

      // 色号（小字）
      if (s.color.code) {
        ctx.font = '10px Arial, monospace'
        ctx.fillStyle = '#6b7280'
        ctx.fillText(s.color.code, x + 26, y + 22)
      }

      // 数量 + 百分比（右对齐）
      const rightX = x + colWidth - 10
      ctx.font = 'bold 11px Arial, monospace'
      ctx.fillStyle = '#4b5563'
      ctx.textAlign = 'right'
      ctx.fillText(`${s.count}颗`, rightX, y + 10)

      ctx.font = '10px Arial, monospace'
      ctx.fillStyle = '#9ca3af'
      ctx.fillText(`${s.percentage}%`, rightX, y + 22)
    })
  }

  const link = document.createElement('a')
  link.download = `拼豆图纸_${gridW}x${gridH}_${Date.now()}.png`
  link.href = canvas.toDataURL('image/png')
  link.click()
}

/**
 * 导出为 SVG 矢量图
 * 底部附带详细的颜色统计表格
 */
export function exportToSVG(
  grid: ColorInfo[][],
  options: ExportOptions,
  beadSize: number
): void {
  const cellSize = beadSize * options.resolution
  const padding = 40
  const gridW = grid[0]?.length || 0
  const gridH = grid.length

  const patternWidth = gridW * cellSize
  const patternHeight = gridH * cellSize

  const stats = calcColorStats(grid)
  const colWidth = 220
  const cols = Math.max(1, Math.floor(patternWidth / colWidth))
  const rows = Math.ceil(stats.length / cols)
  const rowHeight = 28
  const legendTitleH = 36
  const legendGap = 20
  const legendHeight = options.includeLegend
    ? legendTitleH + rows * rowHeight + padding
    : 0

  const svgWidth = Math.max(patternWidth + padding * 2, cols * colWidth + padding * 2)
  const svgHeight = patternHeight + padding * 2 + legendGap + legendHeight

  // 拼豆圆圈
  let circles = ''
  for (let y = 0; y < gridH; y++) {
    for (let x = 0; x < gridW; x++) {
      const cell = grid[y][x]
      const cx = padding + x * cellSize + cellSize / 2
      const cy = padding + 30 + y * cellSize + cellSize / 2
      const r = Math.max(cellSize / 2 - 1, 2)
      const fill = rgbToHex(cell.r, cell.g, cell.b)
      circles += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" stroke="#d1d5db" stroke-width="0.5"/>`
    }
  }

  // 标题
  const title = `<text x="${svgWidth / 2}" y="28" font-family="Arial, 'Microsoft YaHei', sans-serif" font-size="18" font-weight="bold" fill="#1f2937" text-anchor="middle">拼豆图纸  ${gridW} × ${gridH} = ${gridW * gridH} 颗</text>`

  // 分隔线
  const legendTop = padding + 30 + patternHeight + legendGap
  const line = `<line x1="${padding}" y1="${legendTop}" x2="${svgWidth - padding}" y2="${legendTop}" stroke="#e5e7eb" stroke-width="1"/>`

  // 统计标题
  const legendTitle = `<text x="${padding}" y="${legendTop + 22}" font-family="Arial, 'Microsoft YaHei', sans-serif" font-size="14" font-weight="bold" fill="#374151">🎨 颜色统计  （共 ${stats.length} 种颜色）</text>`

  // 统计项
  let statsSvg = ''
  const startY = legendTop + legendTitleH
  stats.forEach((s, idx) => {
    const col = idx % cols
    const row = Math.floor(idx / cols)
    const x = padding + col * colWidth
    const y = startY + row * rowHeight
    const rightX = x + colWidth - 10

    // 颜色圆点
    statsSvg += `<circle cx="${x + 10}" cy="${y + 10}" r="8" fill="${s.hex}" stroke="#d1d5db" stroke-width="0.5"/>`

    // 颜色名称
    const nameText = s.color.name.length > 8 ? s.color.name.slice(0, 8) + '…' : s.color.name
    statsSvg += `<text x="${x + 26}" y="${y + 10}" font-family="Arial, 'Microsoft YaHei', sans-serif" font-size="12" fill="#1f2937" dominant-baseline="middle">${nameText}</text>`

    // 色号
    if (s.color.code) {
      statsSvg += `<text x="${x + 26}" y="${y + 22}" font-family="Arial, monospace" font-size="10" fill="#6b7280" dominant-baseline="middle">${s.color.code}</text>`
    }

    // 数量
    statsSvg += `<text x="${rightX}" y="${y + 10}" font-family="Arial, monospace" font-size="11" font-weight="bold" fill="#4b5563" text-anchor="end" dominant-baseline="middle">${s.count}颗</text>`

    // 百分比
    statsSvg += `<text x="${rightX}" y="${y + 22}" font-family="Arial, monospace" font-size="10" fill="#9ca3af" text-anchor="end" dominant-baseline="middle">${s.percentage}%</text>`
  })

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${svgWidth}" height="${svgHeight}" viewBox="0 0 ${svgWidth} ${svgHeight}">
  <rect width="${svgWidth}" height="${svgHeight}" fill="white"/>
  ${title}
  ${circles}
  ${options.includeLegend && stats.length > 0 ? line + legendTitle + statsSvg : ''}
</svg>`

  const blob = new Blob([svg], { type: 'image/svg+xml' })
  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.download = `拼豆图纸_${gridW}x${gridH}_${Date.now()}.svg`
  link.href = url
  link.click()

  URL.revokeObjectURL(url)
}

/**
 * 导出为文本报告
 */
export function exportToText(grid: ColorInfo[][]): void {
  const stats = calcColorStats(grid)
  const total = grid.length * (grid[0]?.length || 0)

  const lines = [
    '═══════════════════════════════════════════════════',
    '              拼 豆 图 纸 统 计 报 告',
    '═══════════════════════════════════════════════════',
    '',
    `图纸尺寸: ${grid[0]?.length || 0} x ${grid.length} = ${total} 颗`,
    `颜色种类: ${stats.length} 种`,
    '',
    '┌────┬──────────────┬──────┬────────┬────────┐',
    '│ 序号 │ 颜色名称     │ 色号 │ 数量   │ 占比   │',
    '├────┼──────────────┼──────┼────────┼────────┤',
    ...stats.map((s, i) =>
      `│ ${String(i + 1).padStart(2)}  │ ${(s.color.name).padEnd(12)} │ ${(s.color.code || '-').padEnd(4)} │ ${String(s.count).padStart(4)}颗 │ ${s.percentage.padStart(5)}% │`
    ),
    '├────┴──────────────┴──────┼────────┼────────┤',
    `│ 总计                     │ ${String(total).padStart(4)}颗 │ 100.0% │`,
    '└──────────────────────────┴────────┴────────┘',
  ]

  const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.download = `拼豆图纸_${grid[0]?.length || 0}x${grid.length}_${Date.now()}.txt`
  link.href = url
  link.click()

  URL.revokeObjectURL(url)
}
