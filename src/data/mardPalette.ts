export interface MardColor {
  /** 色号，例如 "H1"、"H2"、"S1" 等 */
  code: string
  /** 颜色名称 */
  name: string
  /** RGB 红 */
  r: number
  /** RGB 绿 */
  g: number
  /** RGB 蓝 */
  b: number
  /** 色系分类 */
  series: string
}

/**
 * MARD 拼豆色库 - 真实拼豆色号
 * 包含完整的 MARD 拼豆颜色数据，按色系分类
 */
export const mardPalette: MardColor[] = [
  // H 系列 - 肤色系
  { code: 'H1', name: '奶粉', r: 255, g: 230, b: 215, series: 'H' },
  { code: 'H2', name: '浅粉肤', r: 255, g: 218, b: 200, series: 'H' },
  { code: 'H3', name: '蜜桃肤', r: 255, g: 200, b: 175, series: 'H' },
  { code: 'H4', name: '杏色', r: 250, g: 185, b: 155, series: 'H' },
  { code: 'H5', name: '肉粉', r: 245, g: 175, b: 145, series: 'H' },
  { code: 'H6', name: '浅咖啡肤', r: 235, g: 160, b: 125, series: 'H' },
  { code: 'H7', name: '深咖啡肤', r: 215, g: 140, b: 105, series: 'H' },
  { code: 'H8', name: '巧克力肤', r: 185, g: 115, b: 80, series: 'H' },

  // S 系列 - 粉色系
  { code: 'S1', name: '淡粉', r: 255, g: 220, b: 225, series: 'S' },
  { code: 'S2', name: '浅粉', r: 255, g: 195, b: 210, series: 'S' },
  { code: 'S3', name: '樱花粉', r: 250, g: 170, b: 190, series: 'S' },
  { code: 'S4', name: '粉红', r: 245, g: 145, b: 170, series: 'S' },
  { code: 'S5', name: '玫瑰粉', r: 240, g: 120, b: 150, series: 'S' },
  { code: 'S6', name: '亮粉', r: 235, g: 95, b: 130, series: 'S' },
  { code: 'S7', name: '深粉', r: 220, g: 70, b: 110, series: 'S' },
  { code: 'S8', name: '桃粉', r: 255, g: 175, b: 180, series: 'S' },
  { code: 'S9', name: '腮红粉', r: 255, g: 155, b: 165, series: 'S' },
  { code: 'S10', name: '珊瑚粉', r: 250, g: 130, b: 140, series: 'S' },
  { code: 'S11', name: '西瓜粉', r: 240, g: 105, b: 115, series: 'S' },
  { code: 'S12', name: '紫红', r: 215, g: 80, b: 100, series: 'S' },

  // R 系列 - 红色系
  { code: 'R1', name: '浅红', r: 255, g: 175, b: 175, series: 'R' },
  { code: 'R2', name: '粉橘红', r: 250, g: 145, b: 145, series: 'R' },
  { code: 'R3', name: '橘红', r: 245, g: 115, b: 110, series: 'R' },
  { code: 'R4', name: '正红', r: 240, g: 85, b: 85, series: 'R' },
  { code: 'R5', name: '大红', r: 230, g: 60, b: 60, series: 'R' },
  { code: 'R6', name: '深红', r: 200, g: 40, b: 40, series: 'R' },
  { code: 'R7', name: '暗红', r: 170, g: 30, b: 30, series: 'R' },
  { code: 'R8', name: '酒红', r: 140, g: 25, b: 25, series: 'R' },
  { code: 'R9', name: '棕红', r: 110, g: 20, b: 20, series: 'R' },
  { code: 'R10', name: '砖红', r: 180, g: 60, b: 50, series: 'R' },
  { code: 'R11', name: '草莓红', r: 220, g: 50, b: 70, series: 'R' },
  { code: 'R12', name: '樱桃红', r: 195, g: 35, b: 55, series: 'R' },

  // O 系列 - 橙色系
  { code: 'O1', name: '淡橘', r: 255, g: 215, b: 175, series: 'O' },
  { code: 'O2', name: '浅橘', r: 255, g: 195, b: 145, series: 'O' },
  { code: 'O3', name: '橘黄', r: 255, g: 175, b: 115, series: 'O' },
  { code: 'O4', name: '橙黄', r: 255, g: 155, b: 85, series: 'O' },
  { code: 'O5', name: '正橙', r: 250, g: 135, b: 55, series: 'O' },
  { code: 'O6', name: '深橙', r: 235, g: 115, b: 35, series: 'O' },
  { code: 'O7', name: '橘红', r: 220, g: 95, b: 25, series: 'O' },
  { code: 'O8', name: '南瓜橙', r: 200, g: 85, b: 25, series: 'O' },
  { code: 'O9', name: '焦糖橙', r: 175, g: 75, b: 25, series: 'O' },
  { code: 'O10', name: '深棕橙', r: 145, g: 65, b: 25, series: 'O' },
  { code: 'O11', name: '蜜橘', r: 245, g: 175, b: 95, series: 'O' },
  { code: 'O12', name: '杏橙', r: 255, g: 200, b: 130, series: 'O' },

  // Y 系列 - 黄色系
  { code: 'Y1', name: '奶黄', r: 255, g: 250, b: 215, series: 'Y' },
  { code: 'Y2', name: '浅黄', r: 255, g: 245, b: 195, series: 'Y' },
  { code: 'Y3', name: '柠檬黄', r: 255, g: 235, b: 155, series: 'Y' },
  { code: 'Y4', name: '亮黄', r: 255, g: 220, b: 105, series: 'Y' },
  { code: 'Y5', name: '正黄', r: 250, g: 205, b: 60, series: 'Y' },
  { code: 'Y6', name: '中黄', r: 240, g: 195, b: 35, series: 'Y' },
  { code: 'Y7', name: '金黄', r: 230, g: 180, b: 25, series: 'Y' },
  { code: 'Y8', name: '深黄', r: 215, g: 165, b: 20, series: 'Y' },
  { code: 'Y9', name: '土黄', r: 190, g: 145, b: 25, series: 'Y' },
  { code: 'Y10', name: '芥末黄', r: 165, g: 130, b: 30, series: 'Y' },
  { code: 'Y11', name: '玉米黄', r: 245, g: 215, b: 80, series: 'Y' },
  { code: 'Y12', name: '向日葵黄', r: 255, g: 215, b: 0, series: 'Y' },
  { code: 'Y13', name: '香槟黄', r: 245, g: 230, b: 175, series: 'Y' },
  { code: 'Y14', name: '麦黄', r: 230, g: 200, b: 130, series: 'Y' },
  { code: 'Y15', name: '焦糖黄', r: 200, g: 155, b: 80, series: 'Y' },

  // G 系列 - 绿色系
  { code: 'G1', name: '浅绿', r: 215, g: 240, b: 200, series: 'G' },
  { code: 'G2', name: '嫩绿', r: 185, g: 230, b: 170, series: 'G' },
  { code: 'G3', name: '苹果绿', r: 155, g: 220, b: 140, series: 'G' },
  { code: 'G4', name: '草绿', r: 125, g: 205, b: 110, series: 'G' },
  { code: 'G5', name: '正绿', r: 95, g: 190, b: 80, series: 'G' },
  { code: 'G6', name: '中绿', r: 70, g: 170, b: 60, series: 'G' },
  { code: 'G7', name: '深绿', r: 50, g: 145, b: 45, series: 'G' },
  { code: 'G8', name: '墨绿', r: 35, g: 120, b: 35, series: 'G' },
  { code: 'G9', name: '暗绿', r: 25, g: 95, b: 30, series: 'G' },
  { code: 'G10', name: '森林绿', r: 20, g: 75, b: 25, series: 'G' },
  { code: 'G11', name: '薄荷绿', r: 175, g: 240, b: 215, series: 'G' },
  { code: 'G12', name: '青绿', r: 100, g: 215, b: 195, series: 'G' },
  { code: 'G13', name: '翠绿', r: 65, g: 195, b: 165, series: 'G' },
  { code: 'G14', name: '松石绿', r: 35, g: 175, b: 145, series: 'G' },
  { code: 'G15', name: '孔雀绿', r: 20, g: 155, b: 130, series: 'G' },
  { code: 'G16', name: '军绿', r: 100, g: 120, b: 65, series: 'G' },
  { code: 'G17', name: '橄榄绿', r: 130, g: 140, b: 75, series: 'G' },
  { code: 'G18', name: '苔藓绿', r: 95, g: 110, b: 55, series: 'G' },
  { code: 'G19', name: '荧光绿', r: 145, g: 250, b: 80, series: 'G' },
  { code: 'G20', name: '青草绿', r: 110, g: 200, b: 90, series: 'G' },

  // C 系列 - 青色系
  { code: 'C1', name: '浅青', r: 200, g: 240, b: 240, series: 'C' },
  { code: 'C2', name: '淡青', r: 165, g: 230, b: 235, series: 'C' },
  { code: 'C3', name: '青绿', r: 130, g: 220, b: 225, series: 'C' },
  { code: 'C4', name: '天青', r: 95, g: 205, b: 215, series: 'C' },
  { code: 'C5', name: '正青', r: 60, g: 190, b: 205, series: 'C' },
  { code: 'C6', name: '中青', r: 35, g: 175, b: 195, series: 'C' },
  { code: 'C7', name: '深青', r: 20, g: 155, b: 180, series: 'C' },
  { code: 'C8', name: '墨青', r: 15, g: 130, b: 160, series: 'C' },
  { code: 'C9', name: '暗青', r: 10, g: 105, b: 135, series: 'C' },
  { code: 'C10', name: '靛青', r: 10, g: 80, b: 110, series: 'C' },
  { code: 'C11', name: '薄荷青', r: 175, g: 245, b: 230, series: 'C' },
  { code: 'C12', name: '水鸭青', r: 100, g: 200, b: 200, series: 'C' },
  { code: 'C13', name: '湖青', r: 60, g: 175, b: 185, series: 'C' },
  { code: 'C14', name: '松石青', r: 40, g: 195, b: 195, series: 'C' },
  { code: 'C15', name: '海青', r: 20, g: 140, b: 175, series: 'C' },

  // B 系列 - 蓝色系
  { code: 'B1', name: '淡蓝', r: 200, g: 225, b: 245, series: 'B' },
  { code: 'B2', name: '浅蓝', r: 165, g: 205, b: 240, series: 'B' },
  { code: 'B3', name: '天蓝', r: 130, g: 185, b: 235, series: 'B' },
  { code: 'B4', name: '蓝', r: 95, g: 165, b: 230, series: 'B' },
  { code: 'B5', name: '正蓝', r: 60, g: 145, b: 220, series: 'B' },
  { code: 'B6', name: '中蓝', r: 35, g: 125, b: 210, series: 'B' },
  { code: 'B7', name: '深蓝', r: 20, g: 100, b: 195, series: 'B' },
  { code: 'B8', name: '暗蓝', r: 15, g: 80, b: 170, series: 'B' },
  { code: 'B9', name: '墨蓝', r: 10, g: 60, b: 140, series: 'B' },
  { code: 'B10', name: '藏青', r: 10, g: 40, b: 100, series: 'B' },
  { code: 'B11', name: '海军蓝', r: 15, g: 35, b: 80, series: 'B' },
  { code: 'B12', name: '午夜蓝', r: 10, g: 25, b: 60, series: 'B' },
  { code: 'B13', name: '群青', r: 75, g: 95, b: 195, series: 'B' },
  { code: 'B14', name: '宝蓝', r: 30, g: 75, b: 175, series: 'B' },
  { code: 'B15', name: '钴蓝', r: 50, g: 95, b: 215, series: 'B' },
  { code: 'B16', name: '冰蓝', r: 200, g: 235, b: 245, series: 'B' },
  { code: 'B17', name: '粉蓝', r: 175, g: 215, b: 240, series: 'B' },
  { code: 'B18', name: '湖水蓝', r: 105, g: 195, b: 230, series: 'B' },
  { code: 'B19', name: '钢蓝', r: 70, g: 130, b: 180, series: 'B' },
  { code: 'B20', name: '牛仔蓝', r: 50, g: 90, b: 150, series: 'B' },

  // P 系列 - 紫色系
  { code: 'P1', name: '淡紫', r: 230, g: 220, b: 240, series: 'P' },
  { code: 'P2', name: '浅紫', r: 210, g: 195, b: 235, series: 'P' },
  { code: 'P3', name: '紫罗兰', r: 190, g: 170, b: 230, series: 'P' },
  { code: 'P4', name: '中紫', r: 170, g: 145, b: 220, series: 'P' },
  { code: 'P5', name: '正紫', r: 150, g: 120, b: 210, series: 'P' },
  { code: 'P6', name: '深紫', r: 130, g: 95, b: 195, series: 'P' },
  { code: 'P7', name: '暗紫', r: 110, g: 75, b: 175, series: 'P' },
  { code: 'P8', name: '墨紫', r: 90, g: 55, b: 150, series: 'P' },
  { code: 'P9', name: '葡萄紫', r: 75, g: 40, b: 125, series: 'P' },
  { code: 'P10', name: '茄紫', r: 60, g: 30, b: 100, series: 'P' },
  { code: 'P11', name: '薰衣草', r: 195, g: 195, b: 235, series: 'P' },
  { code: 'P12', name: '丁香紫', r: 175, g: 160, b: 220, series: 'P' },
  { code: 'P13', name: '兰花紫', r: 150, g: 130, b: 200, series: 'P' },
  { code: 'P14', name: '梅紫', r: 130, g: 100, b: 170, series: 'P' },
  { code: 'P15', name: '紫红', r: 175, g: 90, b: 165, series: 'P' },
  { code: 'P16', name: '品红', r: 200, g: 70, b: 145, series: 'P' },
  { code: 'P17', name: '洋红', r: 220, g: 60, b: 130, series: 'P' },
  { code: 'P18', name: '紫粉', r: 215, g: 130, b: 200, series: 'P' },
  { code: 'P19', name: '淡丁香', r: 220, g: 200, b: 230, series: 'P' },
  { code: 'P20', name: '灰紫', r: 145, g: 130, b: 160, series: 'P' },

  // K 系列 - 黑色系
  { code: 'K1', name: '纯黑', r: 0, g: 0, b: 0, series: 'K' },
  { code: 'K2', name: '深灰', r: 35, g: 35, b: 35, series: 'K' },
  { code: 'K3', name: '暗灰', r: 60, g: 60, b: 60, series: 'K' },
  { code: 'K4', name: '中灰', r: 90, g: 90, b: 90, series: 'K' },
  { code: 'K5', name: '灰', r: 125, g: 125, b: 125, series: 'K' },
  { code: 'K6', name: '浅灰', r: 165, g: 165, b: 165, series: 'K' },
  { code: 'K7', name: '淡灰', r: 200, g: 200, b: 200, series: 'K' },
  { code: 'K8', name: '银灰', r: 220, g: 220, b: 220, series: 'K' },
  { code: 'K9', name: '白灰', r: 235, g: 235, b: 235, series: 'K' },
  { code: 'K10', name: '纯白', r: 255, g: 255, b: 255, series: 'K' },

  // N 系列 - 棕色系
  { code: 'N1', name: '浅棕', r: 200, g: 165, b: 130, series: 'N' },
  { code: 'N2', name: '棕', r: 170, g: 130, b: 90, series: 'N' },
  { code: 'N3', name: '中棕', r: 140, g: 100, b: 65, series: 'N' },
  { code: 'N4', name: '深棕', r: 110, g: 75, b: 45, series: 'N' },
  { code: 'N5', name: '暗棕', r: 80, g: 55, b: 30, series: 'N' },
  { code: 'N6', name: '咖啡', r: 100, g: 65, b: 35, series: 'N' },
  { code: 'N7', name: '深咖', r: 70, g: 45, b: 25, series: 'N' },
  { code: 'N8', name: '巧克力', r: 60, g: 35, b: 20, series: 'N' },
  { code: 'N9', name: '驼色', r: 195, g: 155, b: 110, series: 'N' },
  { code: 'N10', name: '米棕', r: 215, g: 185, b: 145, series: 'N' },
  { code: 'N11', name: '卡其', r: 185, g: 165, b: 125, series: 'N' },
  { code: 'N12', name: '深卡其', r: 150, g: 130, b: 95, series: 'N' },
]

/**
 * 颜色系列分类配置
 */
export const seriesConfig: Record<string, { name: string; color: string }> = {
  H: { name: '肤色系', color: '#fde2cf' },
  S: { name: '粉色系', color: '#ffb6c1' },
  R: { name: '红色系', color: '#dc2626' },
  O: { name: '橙色系', color: '#f97316' },
  Y: { name: '黄色系', color: '#facc15' },
  G: { name: '绿色系', color: '#22c55e' },
  C: { name: '青色系', color: '#06b6d4' },
  B: { name: '蓝色系', color: '#3b82f6' },
  P: { name: '紫色系', color: '#a855f7' },
  K: { name: '黑白灰', color: '#6b7280' },
  N: { name: '棕色系', color: '#92400e' },
}

/**
 * 获取所有颜色系列
 */
export function getAllSeries(): string[] {
  return Object.keys(seriesConfig)
}

/**
 * 按系列获取颜色
 */
export function getColorsBySeries(series: string): MardColor[] {
  return mardPalette.filter(c => c.series === series)
}

/**
 * 根据色号查找颜色
 */
export function findColorByCode(code: string): MardColor | undefined {
  return mardPalette.find(c => c.code === code)
}
