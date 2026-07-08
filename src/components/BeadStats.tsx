import { useMemo } from 'react'
import { Download, Table2 } from 'lucide-react'
import { ColorInfo } from '../types'
import { rgbToHex } from '../utils/colorUtils'

interface BeadStatsProps {
  grid: ColorInfo[][]
}

/**
 * 拼豆数量统计组件
 * 以表格形式展示每种颜色的详细使用统计
 */
export function BeadStats({ grid }: BeadStatsProps) {
  const totalBeads = grid.length * (grid[0]?.length || 0)

  // 计算颜色统计（按数量降序）
  const stats = useMemo(() => {
    const map = new Map<string, { color: ColorInfo; count: number }>()
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
        percentage: totalBeads > 0 ? ((count / totalBeads) * 100).toFixed(1) : '0.0',
      }))
      .sort((a, b) => b.count - a.count)
  }, [grid, totalBeads])

  /**
   * 导出统计为 CSV
   */
  const exportCSV = () => {
    const rows = [
      ['序号', '颜色名称', '色号', 'HEX', 'R', 'G', 'B', '数量', '占比'],
      ...stats.map((s, i) => [
        i + 1,
        s.color.name,
        s.color.code || '-',
        s.hex.toUpperCase(),
        s.color.r,
        s.color.g,
        s.color.b,
        s.count,
        `${s.percentage}%`,
      ]),
      ['', '', '', '', '', '', '总计', totalBeads, '100%'],
    ]
    const csv = rows.map(r => r.join(',')).join('\n')
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `拼豆统计_${new Date().toLocaleDateString()}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  /**
   * 导出统计为文本
   */
  const exportText = () => {
    const lines = [
      '═══════════════════════════════════════',
      '          拼 豆 数 量 统 计',
      '═══════════════════════════════════════',
      `图纸尺寸: ${grid[0]?.length || 0} x ${grid.length} = ${totalBeads} 颗`,
      `颜色种类: ${stats.length} 种`,
      '',
      '┌────┬────────────┬──────┬────────┬────────┐',
      '│ 序号 │ 颜色名称   │ 色号 │ 数量   │ 占比   │',
      '├────┼────────────┼──────┼────────┼────────┤',
      ...stats.map((s, i) =>
        `│ ${String(i + 1).padStart(2)}  │ ${s.color.name.padEnd(10)} │ ${(s.color.code || '-').padEnd(4)} │ ${String(s.count).padStart(4)}颗 │ ${s.percentage.padStart(5)}% │`
      ),
      '├────┴────────────┴──────┼────────┼────────┤',
      `│ 总计                   │ ${String(totalBeads).padStart(4)}颗 │ 100.0% │`,
      '└────────────────────────┴────────┴────────┘',
    ]
    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `拼豆统计_${new Date().toLocaleDateString()}.txt`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="mt-4 bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
      {/* 统计头部 */}
      <div className="px-4 py-3 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-gray-200 flex items-center justify-between">
        <h3 className="text-sm font-bold text-gray-700 flex items-center gap-2">
          <Table2 className="w-4 h-4 text-indigo-500" />
          拼豆数量统计
          <span className="text-xs font-normal text-gray-500">
            共 {stats.length} 种颜色 / {totalBeads} 颗
          </span>
        </h3>
        <div className="flex items-center gap-1.5">
          <button
            onClick={exportCSV}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-white text-gray-700 text-xs rounded-lg border border-gray-200 hover:bg-gray-50"
          >
            <Download className="w-3 h-3" />
            CSV
          </button>
          <button
            onClick={exportText}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-white text-gray-700 text-xs rounded-lg border border-gray-200 hover:bg-gray-50"
          >
            <Download className="w-3 h-3" />
            TXT
          </button>
        </div>
      </div>

      {/* 统计表格 */}
      <div className="overflow-x-auto max-h-80 overflow-y-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-gray-100">
            <tr>
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 w-12">序号</th>
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600">颜色</th>
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600">色号</th>
              <th className="px-3 py-2 text-right text-xs font-semibold text-gray-600">数量</th>
              <th className="px-3 py-2 text-right text-xs font-semibold text-gray-600">占比</th>
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 w-32">分布</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {stats.map((s, index) => (
              <tr key={s.hex} className="hover:bg-indigo-50/30 transition-colors">
                <td className="px-3 py-2 text-xs text-gray-500 font-mono">{index + 1}</td>
                <td className="px-3 py-2">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-5 h-5 rounded border border-gray-200 flex-shrink-0"
                      style={{ backgroundColor: s.hex }}
                    />
                    <span className="text-sm font-medium text-gray-700 truncate max-w-[120px]">
                      {s.color.name}
                    </span>
                  </div>
                </td>
                <td className="px-3 py-2 text-xs font-mono text-gray-500">
                  {s.color.code || '-'}
                </td>
                <td className="px-3 py-2 text-right text-sm font-semibold text-gray-700">
                  {s.count} <span className="text-xs font-normal text-gray-400">颗</span>
                </td>
                <td className="px-3 py-2 text-right text-xs text-gray-500">
                  {s.percentage}%
                </td>
                <td className="px-3 py-2">
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-indigo-500 transition-all duration-500"
                      style={{ width: `${s.percentage}%` }}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-gray-50 border-t border-gray-200">
            <tr>
              <td colSpan={3} className="px-3 py-2.5 text-xs font-semibold text-gray-600 text-right">
                总计
              </td>
              <td className="px-3 py-2.5 text-right text-sm font-bold text-indigo-600">
                {totalBeads} <span className="text-xs font-normal">颗</span>
              </td>
              <td className="px-3 py-2.5 text-right text-xs font-bold text-indigo-600">
                100%
              </td>
              <td />
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  )
}
