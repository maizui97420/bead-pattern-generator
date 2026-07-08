import { useState, useCallback, useEffect } from 'react'
import { Sparkles } from 'lucide-react'
import { ImageUploader } from './components/ImageUploader'
import { BeadGrid } from './components/BeadGrid'
import { ColorPalette } from './components/ColorPalette'
import { Settings } from './components/Settings'
import { ExportPanel } from './components/ExportPanel'
import { useImageProcessor } from './hooks/useImageProcessor'
import { useColorPalette } from './hooks/useColorPalette'
import { GridSettings, WorkMode, ImageAdjustments } from './types'
import { defaultAdjustments } from './utils/imageAdjuster'
import { defaultGridSettings } from './data/defaultPalettes'

/**
 * 主应用组件
 * 布局设计：
 * - 顶部：简洁标题栏
 * - 主体：左侧边栏（设置+调色板+导出）+ 右侧主画布（上传+预览）
 */
function App() {
  const [settings, setSettings] = useState<GridSettings>(defaultGridSettings)
  const [workMode, setWorkMode] = useState<WorkMode>('generate')
  const [colorLimit, setColorLimit] = useState(12)
  const [adjustments, setAdjustments] = useState<ImageAdjustments>(defaultAdjustments)

  // 图像处理 Hook
  const {
    grid,
    isProcessing,
    canUndo,
    canRedo,
    processImage,
    undo,
    redo,
  } = useImageProcessor()

  // 调色板 Hook
  const {
    displayedColors,
    activeColors,
    currentColor,
    selectedSeries,
    seriesConfig,
    allSeries,
    setSelectedSeries,
    addToActive,
    removeFromActive,
    editColor,
    clearActive,
    resetActive,
    selectColor,
  } = useColorPalette()

  const handleImageSelect = useCallback(() => {
    // 仅清空网格，保留其他状态
  }, [])

  const handleGenerateGrid = useCallback(async (imageUrl: string) => {
    await processImage(
      imageUrl,
      settings,
      activeColors,
      workMode,
      colorLimit,
      false
    )
  }, [processImage, settings, activeColors, workMode, colorLimit])

  // 键盘快捷键
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault()
        undo()
      } else if (
        ((e.ctrlKey || e.metaKey) && e.key === 'y') ||
        ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'z')
      ) {
        e.preventDefault()
        redo()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [undo, redo])

  // 工作模式变化时调整默认参数
  useEffect(() => {
    if (workMode === 'edit') {
      setColorLimit(50)
    } else if (workMode === 'pixel') {
      setColorLimit(20)
    } else {
      setColorLimit(12)
    }
  }, [workMode])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部标题栏 - 简洁紧凑 */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-[1600px] mx-auto px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold text-gray-800 leading-tight">拼豆图案生成器</h1>
              <p className="text-[11px] text-gray-400 leading-tight">上传图片，生成拼豆图案</p>
            </div>
          </div>
          <div className="text-xs text-gray-400">
            v2.0
          </div>
        </div>
      </header>

      {/* 主体内容 */}
      <div className="max-w-[1600px] mx-auto flex h-[calc(100vh-48px)]">
        {/* 左侧边栏 - 设置+调色板+导出 */}
        <aside className="w-[340px] min-w-[340px] bg-white border-r border-gray-200 overflow-y-auto custom-scrollbar">
          <div className="p-4 space-y-4">
            {/* 设置 */}
            <Settings
              settings={settings}
              workMode={workMode}
              colorLimit={colorLimit}
              adjustments={adjustments}
              onSettingsChange={setSettings}
              onWorkModeChange={setWorkMode}
              onColorLimitChange={setColorLimit}
              onAdjustmentsChange={setAdjustments}
              onResetAdjustments={() => setAdjustments(defaultAdjustments)}
            />

            {/* 颜色选择 */}
            <ColorPalette
              displayedColors={displayedColors}
              activeColors={activeColors}
              currentColor={currentColor}
              selectedSeries={selectedSeries}
              seriesConfig={seriesConfig}
              allSeries={allSeries}
              onSelectSeries={setSelectedSeries}
              onAddToActive={addToActive}
              onRemoveFromActive={removeFromActive}
              onEditColor={editColor}
              onClearActive={clearActive}
              onResetActive={resetActive}
              onSelectColor={selectColor}
            />

            {/* 导出 */}
            <ExportPanel grid={grid} beadSize={settings.beadSize} />
          </div>
        </aside>

        {/* 右侧主画布 - 上传+预览 */}
        <main className="flex-1 overflow-y-auto bg-gray-50/50 p-4 space-y-4">
          {/* 图片上传 */}
          <ImageUploader
            onImageSelect={handleImageSelect}
            onGenerateGrid={handleGenerateGrid}
            isProcessing={isProcessing}
          />

          {/* 预览网格 */}
          <BeadGrid
            grid={grid}
            beadSize={settings.beadSize}
            canUndo={canUndo}
            canRedo={canRedo}
            onUndo={undo}
            onRedo={redo}
          />
        </main>
      </div>
    </div>
  )
}

export default App
