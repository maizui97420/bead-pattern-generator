/** RGB 颜色结构 */
export interface RGBColor {
  r: number
  g: number
  b: number
}

/** 拼豆颜色信息 */
export interface ColorInfo extends RGBColor {
  /** 颜色 ID */
  id: string
  /** 颜色名称 */
  name: string
  /** 色号（可选，例如 MARD 库的色号） */
  code?: string
}

/** 调色板 */
export interface Palette {
  id: string
  name: string
  colors: ColorInfo[]
}

/** 工作模式 */
export type WorkMode = 'generate' | 'edit' | 'pixel'

/** 网格设置 */
export interface GridSettings {
  width: number
  height: number
  beadSize: number
}

/** 图像美化参数 */
export interface ImageAdjustments {
  /** 对比度，1.0 为原始 */
  contrast: number
  /** 饱和度，1.0 为原始 */
  saturation: number
  /** 亮度，1.0 为原始 */
  brightness: number
}

/** 拼豆网格数据 */
export interface BeadGridData {
  grid: ColorInfo[][]
  originalImage: string | null
}

/** 导出选项 */
export interface ExportOptions {
  format: 'png' | 'svg' | 'pdf'
  includeLegend: boolean
  resolution: number
}

/** 预览缩放信息 */
export interface PreviewZoom {
  scale: number
  offsetX: number
  offsetY: number
}

/** 撤销/重做历史 */
export interface HistoryState<T> {
  past: T[]
  present: T
  future: T[]
}
