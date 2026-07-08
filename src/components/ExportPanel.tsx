import { useState } from 'react'
import { Download, Image, FileText, FileImage } from 'lucide-react'
import { ColorInfo, ExportOptions } from '../types'
import { exportToPNG, exportToSVG, exportToText } from '../utils/exportUtils'

interface ExportPanelProps {
  grid: ColorInfo[][]
  beadSize: number
}

export function ExportPanel({ grid, beadSize }: ExportPanelProps) {
  const [includeLegend, setIncludeLegend] = useState(true)
  const [resolution, setResolution] = useState(2)

  const canExport = grid.length > 0 && grid[0]?.length > 0

  const handleExport = async (format: ExportOptions['format']) => {
    if (!canExport) return

    const options: ExportOptions = {
      format,
      includeLegend,
      resolution,
    }

    switch (format) {
      case 'png':
        await exportToPNG(grid, options, beadSize)
        break
      case 'svg':
        exportToSVG(grid, options, beadSize)
        break
    }
  }

  const handleExportText = () => {
    if (!canExport) return
    exportToText(grid)
  }

  return (
    <div className="bg-gray-50/80 rounded-xl border border-gray-200 p-5">
      <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <Download className="w-6 h-6 text-indigo-500" />
        导出
      </h2>

      {!canExport ? (
        <div className="text-center py-8">
          <Download className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-400">生成拼豆网格后可以导出</p>
        </div>
      ) : (
        <>
          <div className="space-y-4 mb-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">包含颜色图例</label>
              <button
                onClick={() => setIncludeLegend(!includeLegend)}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  includeLegend ? 'bg-indigo-500' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    includeLegend ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                导出分辨率 (当前: {resolution}x)
              </label>
              <input
                type="range"
                min="1"
                max="4"
                value={resolution}
                onChange={(e) => setResolution(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>1x (原始)</span>
                <span>4x (高清)</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => handleExport('png')}
              disabled={!canExport}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Image className="w-5 h-5" />
              导出为 PNG
            </button>

            <button
              onClick={() => handleExport('svg')}
              disabled={!canExport}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FileImage className="w-5 h-5" />
              导出为 SVG
            </button>

            <button
              onClick={handleExportText}
              disabled={!canExport}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FileText className="w-5 h-5" />
              导出颜色统计 (TXT)
            </button>
          </div>
        </>
      )}
    </div>
  )
}
