import { Sparkles, Edit3, Grid3x3 } from 'lucide-react'
import { GridSettings, WorkMode, ImageAdjustments } from '../types'

interface SettingsProps {
  settings: GridSettings
  workMode: WorkMode
  colorLimit: number
  adjustments: ImageAdjustments
  onSettingsChange: (settings: GridSettings) => void
  onWorkModeChange: (mode: WorkMode) => void
  onColorLimitChange: (limit: number) => void
  onAdjustmentsChange: (adjustments: ImageAdjustments) => void
  onResetAdjustments: () => void
}

const workModeOptions: { value: WorkMode; label: string; description: string; icon: typeof Sparkles }[] = [
  {
    value: 'generate',
    label: '生成拼豆',
    description: '上传普通图片，生成拼豆图案',
    icon: Sparkles,
  },
  {
    value: 'edit',
    label: '直接编辑',
    description: '上传已有拼豆图纸，保留原色',
    icon: Edit3,
  },
  {
    value: 'pixel',
    label: '像素图模式',
    description: '1:1 映射拼豆颜色，适合超大图',
    icon: Grid3x3,
  },
]

/**
 * 设置面板组件
 * 包含工作模式、网格大小、拼豆尺寸、颜色数量、图像美化参数
 */
export function Settings({
  settings,
  workMode,
  colorLimit,
  adjustments,
  onSettingsChange,
  onWorkModeChange,
  onColorLimitChange,
  onAdjustmentsChange,
  onResetAdjustments,
}: SettingsProps) {
  return (
    <div className="bg-gray-50/80 rounded-xl border border-gray-200 p-5 space-y-4">
      <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
        <span className="text-2xl">⚙️</span>
        参数设置
      </h2>

      {/* 工作模式 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">工作模式</label>
        <div className="grid grid-cols-1 gap-2">
          {workModeOptions.map((option) => {
            const Icon = option.icon
            const isActive = workMode === option.value
            return (
              <button
                key={option.value}
                onClick={() => onWorkModeChange(option.value)}
                className={`flex items-start gap-3 p-3 rounded-lg border-2 transition-all text-left ${
                  isActive
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className={`p-1.5 rounded ${isActive ? 'bg-indigo-500' : 'bg-gray-200'}`}>
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-600'}`} />
                </div>
                <div className="flex-1">
                  <div className={`text-sm font-medium ${isActive ? 'text-indigo-700' : 'text-gray-700'}`}>
                    {option.label}
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">{option.description}</div>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* 网格大小 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          网格大小: {settings.width}x{settings.height}
        </label>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <div className="text-xs text-gray-500 mb-1">宽</div>
            <input
              type="range"
              min="8"
              max="80"
              value={settings.width}
              onChange={(e) => onSettingsChange({ ...settings, width: parseInt(e.target.value) })}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
            <div className="text-center text-xs text-gray-400 mt-0.5">{settings.width}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500 mb-1">高</div>
            <input
              type="range"
              min="8"
              max="80"
              value={settings.height}
              onChange={(e) => onSettingsChange({ ...settings, height: parseInt(e.target.value) })}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
            <div className="text-center text-xs text-gray-400 mt-0.5">{settings.height}</div>
          </div>
        </div>
      </div>

      {/* 拼豆尺寸 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          拼豆尺寸: {settings.beadSize}mm
        </label>
        <div className="grid grid-cols-4 gap-1.5">
          {[2.6, 5, 7, 10].map(size => (
            <button
              key={size}
              onClick={() => onSettingsChange({ ...settings, beadSize: size })}
              className={`px-2 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                settings.beadSize === size
                  ? 'bg-indigo-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {size}mm
            </button>
          ))}
        </div>
      </div>

      {/* 颜色数量限制 */}
      {workMode !== 'edit' && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700">颜色数量</label>
            <span className="text-sm font-bold text-indigo-600">{colorLimit}</span>
          </div>
          <input
            type="range"
            min="4"
            max="80"
            value={colorLimit}
            onChange={(e) => onColorLimitChange(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-500"
          />
          <div className="text-xs text-gray-400 mt-1">建议 6-16 种，图片颜色越少越简单</div>
        </div>
      )}

      {/* 图像美化参数 */}
      <div className="border-t pt-4">
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-gray-700">🎨 图像美化</label>
          <button
            onClick={onResetAdjustments}
            className="text-xs text-indigo-500 hover:text-indigo-600"
          >
            重置参数
          </button>
        </div>
        <div className="space-y-2.5">
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-gray-600">对比度</span>
              <span className="text-gray-400">{adjustments.contrast.toFixed(1)}</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={adjustments.contrast}
              onChange={(e) => onAdjustmentsChange({ ...adjustments, contrast: parseFloat(e.target.value) })}
              className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
          </div>
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-gray-600">饱和度</span>
              <span className="text-gray-400">{adjustments.saturation.toFixed(1)}</span>
            </div>
            <input
              type="range"
              min="0"
              max="2"
              step="0.1"
              value={adjustments.saturation}
              onChange={(e) => onAdjustmentsChange({ ...adjustments, saturation: parseFloat(e.target.value) })}
              className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
          </div>
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-gray-600">亮度</span>
              <span className="text-gray-400">{adjustments.brightness.toFixed(1)}</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="1.5"
              step="0.1"
              value={adjustments.brightness}
              onChange={(e) => onAdjustmentsChange({ ...adjustments, brightness: parseFloat(e.target.value) })}
              className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* 实际尺寸计算 */}
      <div className="p-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg">
        <div className="text-xs font-medium text-gray-600 mb-1">实际尺寸</div>
        <div className="text-xs text-gray-500">
          宽: <span className="font-medium text-gray-700">{(settings.width * settings.beadSize).toFixed(1)}mm</span>
          {' · '}
          高: <span className="font-medium text-gray-700">{(settings.height * settings.beadSize).toFixed(1)}mm</span>
        </div>
        <div className="text-xs text-gray-500 mt-0.5">
          总计: <span className="font-medium text-indigo-600">{settings.width * settings.height}</span> 颗拼豆
        </div>
      </div>
    </div>
  )
}
