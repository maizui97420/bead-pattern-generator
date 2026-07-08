import { useMemo, useState, useRef, useEffect } from 'react'
import { Grid3x3, ZoomIn, ZoomOut, Maximize2, X, Eye, EyeOff, Undo2, Redo2 } from 'lucide-react'
import { ColorInfo } from '../types'
import { rgbToHex } from '../utils/colorUtils'
import { BeadStats } from './BeadStats'

interface BeadGridProps {
  grid: ColorInfo[][]
  beadSize: number
  canUndo: boolean
  canRedo: boolean
  onUndo: () => void
  onRedo: () => void
}

const MIN_ZOOM = 0.5
const MAX_ZOOM = 8

/**
 * 拼豆网格组件
 * 支持缩放控制、全屏查看、显示颜色名称、撤销/重做
 */
export function BeadGrid({ grid, beadSize, canUndo, canRedo, onUndo, onRedo }: BeadGridProps) {
  const [showLabels, setShowLabels] = useState(false)
  const [zoom, setZoom] = useState(1)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const dragStart = useRef({ x: 0, y: 0 })
  const positionStart = useRef({ x: 0, y: 0 })

  // 计算调整后的网格样式
  const gridStyle = useMemo(() => {
    if (grid.length === 0 || grid[0]?.length === 0) return {}
    return {
      gridTemplateColumns: `repeat(${grid[0].length}, ${beadSize}px)`,
      gridTemplateRows: `repeat(${grid.length}, ${beadSize + (showLabels ? 14 : 0)}px)`,
    }
  }, [grid, beadSize, showLabels])

  // 缩放控制
  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.5, MAX_ZOOM))
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.5, MIN_ZOOM))
  const handleResetZoom = () => {
    setZoom(1)
    setPosition({ x: 0, y: 0 })
  }

  // 全屏控制
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
    setZoom(1)
    setPosition({ x: 0, y: 0 })
  }

  // 拖拽
  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom <= 1) return
    setIsDragging(true)
    dragStart.current = { x: e.clientX, y: e.clientY }
    positionStart.current = { ...position }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    setPosition({
      x: positionStart.current.x + (e.clientX - dragStart.current.x),
      y: positionStart.current.y + (e.clientY - dragStart.current.y),
    })
  }

  const handleMouseUp = () => setIsDragging(false)

  // 滚轮缩放
  const handleWheel = (e: React.WheelEvent) => {
    if (!e.ctrlKey && !e.metaKey) return
    e.preventDefault()
    const delta = e.deltaY > 0 ? -0.2 : 0.2
    setZoom(prev => Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, prev + delta)))
  }

  // ESC 退出全屏
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false)
      }
    }
    if (isFullscreen) {
      document.addEventListener('keydown', handleEsc)
      return () => document.removeEventListener('keydown', handleEsc)
    }
  }, [isFullscreen])

  const gridContent = (
    <div
      className={`overflow-hidden ${isFullscreen ? 'h-full' : 'max-h-[600px]'} ${isDragging ? 'cursor-grabbing' : zoom > 1 ? 'cursor-grab' : ''}`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
    >
      <div
        className="inline-block transition-transform duration-100"
        style={{
          transform: `scale(${zoom}) translate(${position.x / zoom}px, ${position.y / zoom}px)`,
          transformOrigin: '0 0',
        }}
      >
        <div className="bead-grid" style={gridStyle}>
          {grid.map((row, y) =>
            row.map((cell, x) => (
              <div
                key={`${x}-${y}`}
                className="flex flex-col items-center group"
              >
                <div
                  className="bead-cell"
                  style={{
                    width: `${beadSize}px`,
                    height: `${beadSize}px`,
                    backgroundColor: rgbToHex(cell.r, cell.g, cell.b),
                  }}
                  title={`${cell.name} (${rgbToHex(cell.r, cell.g, cell.b)})`}
                />
                {showLabels && (
                  <span className="text-xs text-gray-600 mt-0.5 whitespace-nowrap font-medium">
                    {cell.name}
                  </span>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )

  if (grid.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Grid3x3 className="w-6 h-6 text-indigo-500" />
          预览
        </h2>
        <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-lg">
          <Grid3x3 className="w-12 h-12 text-gray-300 mb-3" />
          <p className="text-gray-400">请上传图片并点击生成按钮</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        {/* 顶部工具栏 */}
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Grid3x3 className="w-6 h-6 text-indigo-500" />
            预览
            <span className="text-sm font-normal text-gray-500">
              ({grid[0]?.length || 0} x {grid.length})
            </span>
          </h2>

          <div className="flex items-center gap-1.5 flex-wrap">
            {/* 撤销/重做 */}
            <div className="flex items-center gap-1 mr-2 pr-2 border-r border-gray-200">
              <button
                onClick={onUndo}
                disabled={!canUndo}
                className="p-1.5 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed"
                title="撤销 (Ctrl+Z)"
              >
                <Undo2 className="w-4 h-4" />
              </button>
              <button
                onClick={onRedo}
                disabled={!canRedo}
                className="p-1.5 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed"
                title="重做 (Ctrl+Y)"
              >
                <Redo2 className="w-4 h-4" />
              </button>
            </div>

            {/* 缩放控制 */}
            <div className="flex items-center gap-1 mr-2 pr-2 border-r border-gray-200">
              <button
                onClick={handleZoomOut}
                className="p-1.5 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200"
                title="缩小"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button
                onClick={handleResetZoom}
                className="px-2 py-1 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 text-xs font-medium min-w-[3rem]"
                title="重置"
              >
                {zoom.toFixed(1)}x
              </button>
              <button
                onClick={handleZoomIn}
                className="p-1.5 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200"
                title="放大"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>

            {/* 显示/隐藏标签 */}
            <button
              onClick={() => setShowLabels(!showLabels)}
              className={`flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                showLabels
                  ? 'bg-indigo-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {showLabels ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              名称
            </button>

            {/* 全屏查看 */}
            <button
              onClick={toggleFullscreen}
              className="flex items-center gap-1 px-2 py-1.5 rounded-lg bg-indigo-500 text-white text-xs font-medium hover:bg-indigo-600"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              全屏
            </button>
          </div>
        </div>

        {gridContent}

        {/* 拼豆数量统计表格 */}
        <BeadStats grid={grid} />
      </div>

      {/* 全屏查看模态框 */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="relative bg-white rounded-xl w-full h-full max-w-7xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-bold text-gray-800">全屏查看 - {grid[0]?.length}x{grid.length}</h3>
              <button
                onClick={toggleFullscreen}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex items-center justify-center gap-2 p-3 border-b">
              <button
                onClick={handleZoomOut}
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="text-sm font-medium min-w-[3rem] text-center">{zoom.toFixed(1)}x</span>
              <button
                onClick={handleZoomIn}
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={handleResetZoom}
                className="px-3 py-2 rounded-lg bg-gray-100 text-sm hover:bg-gray-200"
              >
                重置
              </button>
            </div>
            <div className="flex-1 overflow-auto p-4 bg-gray-50">
              {gridContent}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
