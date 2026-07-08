import { useState, useCallback, useRef } from 'react'
import { Upload, Image as ImageIcon, Play, RotateCcw } from 'lucide-react'

interface ImageUploaderProps {
  onImageSelect: (imageUrl: string) => void
  onGenerateGrid: (imageUrl: string) => void
  isProcessing: boolean
}

/**
 * 图片上传组件
 * 支持拖拽上传、点击上传，上传后直接生成拼豆图纸
 */
export function ImageUploader({ 
  onImageSelect, 
  onGenerateGrid,
  isProcessing, 
}: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [hasUploaded, setHasUploaded] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  /**
   * 处理文件选择
   */
  const handleFileSelect = useCallback((file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      setPreview(result)
      setHasUploaded(true)
      onImageSelect(result)
    }
    reader.readAsDataURL(file)
  }, [onImageSelect])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
      handleFileSelect(file)
    }
  }, [handleFileSelect])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleClick = useCallback(() => {
    if (!hasUploaded) {
      fileInputRef.current?.click()
    }
  }, [hasUploaded])

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }, [handleFileSelect])

  const handleGenerateGrid = useCallback(() => {
    if (preview) {
      onGenerateGrid(preview)
    }
  }, [preview, onGenerateGrid])

  const handleReset = useCallback(() => {
    setPreview(null)
    setHasUploaded(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [])

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <ImageIcon className="w-6 h-6 text-indigo-500" />
        图片上传
      </h2>
      
      <div
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-300
          ${isDragging 
            ? 'border-indigo-500 bg-indigo-50' 
            : 'border-gray-300 hover:border-indigo-400 hover:bg-gray-50'
          }
          ${isProcessing ? 'pointer-events-none opacity-50' : ''}
          ${hasUploaded ? 'cursor-default' : ''}
        `}
      >
        {isProcessing ? (
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-500 rounded-full animate-spin"></div>
            <p className="text-gray-500">生成拼豆图纸中...</p>
          </div>
        ) : preview ? (
          <div className="flex flex-col items-center gap-3">
            <img 
              src={preview} 
              alt="预览" 
              className="max-h-48 max-w-full rounded-lg object-contain"
            />
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center">
              <Upload className="w-8 h-8 text-indigo-500" />
            </div>
            <p className="text-gray-600 font-medium">拖拽图片到此处</p>
            <p className="text-gray-400 text-sm">或点击选择文件</p>
            <p className="text-gray-400 text-xs">支持 JPG、PNG、GIF 格式</p>
          </div>
        )}
      </div>

      {hasUploaded && (
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            onClick={handleGenerateGrid}
            disabled={isProcessing}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Play className="w-4 h-4" />
            生成拼豆图纸
          </button>
          <button
            onClick={handleReset}
            disabled={isProcessing}
            className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RotateCcw className="w-4 h-4" />
            重新上传
          </button>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleInputChange}
        className="hidden"
      />
    </div>
  )
}
