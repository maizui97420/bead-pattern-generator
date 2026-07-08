import { useState } from 'react'
import { Plus, Trash2, Edit2, X, Check, RotateCcw } from 'lucide-react'
import { ColorInfo } from '../types'
import { rgbToHex, hexToRgb } from '../utils/colorUtils'
import { seriesConfig } from '../data/mardPalette'

interface ColorPaletteProps {
  displayedColors: ColorInfo[]
  activeColors: ColorInfo[]
  currentColor: ColorInfo | null
  selectedSeries: string
  seriesConfig: typeof seriesConfig
  allSeries: string[]
  onSelectSeries: (series: string) => void
  onAddToActive: (color: ColorInfo) => void
  onRemoveFromActive: (colorId: string) => void
  onEditColor: (oldColorId: string, newColor: Omit<ColorInfo, 'id'>) => void
  onClearActive: () => void
  onResetActive: () => void
  onSelectColor: (color: ColorInfo | null) => void
}

/**
 * 调色板组件
 * 支持 MARD 完整色库浏览、色系筛选、活动调色板编辑
 */
export function ColorPalette({
  displayedColors,
  activeColors,
  currentColor,
  selectedSeries,
  seriesConfig,
  allSeries,
  onSelectSeries,
  onAddToActive,
  onRemoveFromActive,
  onEditColor,
  onClearActive,
  onResetActive,
  onSelectColor,
}: ColorPaletteProps) {
  const [editingColor, setEditingColor] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [editHex, setEditHex] = useState('')
  const [showAdvanced, setShowAdvanced] = useState(false)

  /**
   * 开始编辑颜色
   */
  const startEdit = (color: ColorInfo) => {
    setEditingColor(color.id)
    setEditName(color.name)
    setEditHex(rgbToHex(color.r, color.g, color.b))
  }

  /**
   * 保存编辑
   */
  const saveEdit = () => {
    if (!editingColor) return
    const rgb = hexToRgb(editHex)
    if (rgb) {
      onEditColor(editingColor, {
        name: editName || '自定义颜色',
        r: rgb.r,
        g: rgb.g,
        b: rgb.b,
      })
    }
    setEditingColor(null)
  }

  /**
   * 取消编辑
   */
  const cancelEdit = () => {
    setEditingColor(null)
  }

  return (
    <div className="bg-gray-50/80 rounded-xl border border-gray-200 p-5 space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <span className="text-2xl">🎨</span>
          颜色选择
        </h2>
      </div>

      {/* 当前选中的颜色 */}
      <div className="p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg">
        <div className="text-xs text-gray-500 mb-1.5">当前选中颜色:</div>
        {currentColor ? (
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-lg border-2 border-white shadow-sm"
              style={{ backgroundColor: rgbToHex(currentColor.r, currentColor.g, currentColor.b) }}
            />
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-700">{currentColor.name}</div>
              <div className="text-xs text-gray-400 font-mono">
                {rgbToHex(currentColor.r, currentColor.g, currentColor.b).toUpperCase()}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-sm text-gray-400 italic">未选择颜色</div>
        )}
      </div>

      {/* 色系筛选 */}
      <div>
        <div className="text-xs font-medium text-gray-600 mb-2">按色系筛选</div>
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => onSelectSeries('all')}
            className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
              selectedSeries === 'all'
                ? 'bg-indigo-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            全部
          </button>
          {allSeries.map(series => (
            <button
              key={series}
              onClick={() => onSelectSeries(series)}
              className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                selectedSeries === series
                  ? 'bg-indigo-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {seriesConfig[series]?.name || series}
            </button>
          ))}
        </div>
      </div>

      {/* MARD 色库浏览 */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="text-xs font-medium text-gray-600">
            💎 MARD 拼豆色库 ({displayedColors.length})
          </div>
          <div className="text-xs text-gray-400">点击添加到活动调色板</div>
        </div>
        <div className="grid grid-cols-8 gap-1.5 max-h-48 overflow-auto p-1">
          {displayedColors.map(color => (
            <div
              key={color.id}
              onClick={() => onAddToActive(color)}
              className="relative group cursor-pointer"
              title={`${color.name} - 点击添加`}
            >
              <div
                className="w-full aspect-square rounded-md border border-gray-200 hover:scale-110 transition-transform"
                style={{ backgroundColor: rgbToHex(color.r, color.g, color.b) }}
              />
              <div className="absolute inset-0 bg-indigo-500/70 opacity-0 group-hover:opacity-100 transition-opacity rounded-md flex items-center justify-center">
                <Plus className="w-3 h-3 text-white" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 活动调色板 */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="text-xs font-medium text-gray-600">
            活动调色板 ({activeColors.length})
          </div>
          <div className="flex gap-1.5">
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-xs text-indigo-500 hover:text-indigo-600"
            >
              {showAdvanced ? '收起' : '高级'}
            </button>
            <button
              onClick={onResetActive}
              className="text-xs text-gray-500 hover:text-gray-700"
              title="恢复默认"
            >
              <RotateCcw className="w-3.5 h-3.5 inline" />
            </button>
            <button
              onClick={onClearActive}
              className="text-xs text-red-500 hover:text-red-600"
              title="清除全部"
            >
              清除
            </button>
          </div>
        </div>
        <div className="grid grid-cols-6 gap-1.5 max-h-40 overflow-auto p-1 bg-gray-50 rounded-lg">
          {activeColors.length === 0 ? (
            <div className="col-span-6 text-center text-xs text-gray-400 py-4">
              暂无颜色，从 MARD 色库添加
            </div>
          ) : (
            activeColors.map(color => (
              <div
                key={color.id}
                className="relative group"
              >
                {editingColor === color.id ? (
                  <div className="bg-white rounded-md p-1 border-2 border-indigo-400">
                    <input
                      type="color"
                      value={editHex}
                      onChange={(e) => setEditHex(e.target.value)}
                      className="w-full h-6 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full text-xs mt-1 px-1 py-0.5 border border-gray-200 rounded"
                    />
                    <div className="flex gap-1 mt-1">
                      <button
                        onClick={saveEdit}
                        className="flex-1 p-0.5 bg-green-500 text-white rounded text-xs"
                      >
                        <Check className="w-3 h-3 mx-auto" />
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="flex-1 p-0.5 bg-gray-400 text-white rounded text-xs"
                      >
                        <X className="w-3 h-3 mx-auto" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div
                      onClick={() => onSelectColor(color)}
                      className={`w-full aspect-square rounded-md border-2 cursor-pointer transition-all ${
                        currentColor?.id === color.id
                          ? 'border-indigo-500 scale-105'
                          : 'border-white hover:scale-110'
                      }`}
                      style={{ backgroundColor: rgbToHex(color.r, color.g, color.b) }}
                      title={color.name}
                    />
                    {showAdvanced && (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            startEdit(color)
                          }}
                          className="absolute -top-1 -left-1 w-4 h-4 bg-indigo-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Edit2 className="w-2.5 h-2.5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            onRemoveFromActive(color.id)
                          }}
                          className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-2.5 h-2.5" />
                        </button>
                      </>
                    )}
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {showAdvanced && (
        <div className="p-2 bg-blue-50 rounded text-xs text-blue-700">
          💡 高级模式：点击颜色可选择，悬停时显示编辑/删除按钮
        </div>
      )}
    </div>
  )
}
