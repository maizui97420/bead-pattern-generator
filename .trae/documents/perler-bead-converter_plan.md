# 拼豆图纸转换器 - 实现计划

## 项目概述

创建一个图片转拼豆图纸的应用，支持网页和桌面两种形式，用户可以上传图片，将其转换为拼豆网格图纸，并自定义调色板和拼豆尺寸。

## 技术栈

| 分类 | 技术 | 说明 |
|------|------|------|
| 前端框架 | React 18 + TypeScript | 构建用户界面 |
| 构建工具 | Vite | 快速开发和构建 |
| 样式 | TailwindCSS 3 | 现代化样式 |
| 桌面应用 | Electron | 封装网页应用为桌面端 |
| 图标 | Lucide React | 美观的图标库 |
| 颜色处理 | Canvas API + Colorthief | 颜色提取和处理 |

## 目录结构

```
perler-bead-converter/
├── src/                    # 前端源代码
│   ├── components/         # React 组件
│   │   ├── ImageUploader/   # 图片上传组件
│   │   ├── ColorPalette/    # 调色板组件
│   │   ├── BeadGrid/        # 拼豆网格组件
│   │   ├── Settings/        # 设置面板组件
│   │   └── ExportPanel/     # 导出面板组件
│   ├── hooks/              # 自定义 Hooks
│   │   ├── useImageProcessor.ts  # 图片处理逻辑
│   │   └── useColorPalette.ts    # 调色板管理
│   ├── utils/              # 工具函数
│   │   ├── colorUtils.ts    # 颜色处理工具
│   │   └── exportUtils.ts   # 导出工具
│   ├── types/              # 类型定义
│   │   └── index.ts        # 全局类型
│   ├── data/               # 数据
│   │   └── defaultPalettes.ts  # 默认调色板数据
│   ├── App.tsx             # 主应用组件
│   └── main.tsx            # 入口文件
├── electron/               # Electron 相关代码
│   ├── main.ts             # 主进程
│   └── preload.ts          # 预加载脚本
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
└── tailwind.config.js
```

## 核心功能模块

### 1. 图片上传与预览
- 支持拖拽上传和点击选择文件
- 支持 JPG、PNG、GIF 等常见格式
- 实时预览上传的图片

### 2. 图片转拼豆网格
- 根据设定的网格大小将图片像素化
- 使用最近色算法将图片颜色匹配到调色板
- 实时显示转换进度

### 3. 自定义调色板
- 提供多种预设调色板（标准拼豆色、复古色等）
- 支持添加、删除、修改颜色
- 支持从图片提取颜色生成调色板

### 4. 拼豆尺寸设置
- 支持自定义网格大小（宽 x 高）
- 支持设置拼豆实际尺寸（5mm、2.6mm 等）
- 显示实际图纸尺寸计算

### 5. 导出功能
- 导出为 PNG 图片
- 导出为 SVG 矢量图
- 导出包含颜色统计信息的图纸

## 实现步骤

### 阶段一：项目初始化
1. 使用 Vite 创建 React + TypeScript 项目
2. 安装 TailwindCSS 3 和相关依赖
3. 配置项目结构和基础配置

### 阶段二：核心组件开发
1. 开发图片上传组件（ImageUploader）
2. 开发拼豆网格组件（BeadGrid）
3. 开发调色板组件（ColorPalette）
4. 开发设置面板组件（Settings）
5. 开发导出面板组件（ExportPanel）

### 阶段三：业务逻辑实现
1. 实现图片处理逻辑（像素化、颜色匹配）
2. 实现调色板管理逻辑
3. 实现导出功能（PNG、SVG）
4. 整合所有组件和逻辑

### 阶段四：Electron 桌面应用
1. 初始化 Electron 项目
2. 配置主进程和预加载脚本
3. 构建和打包桌面应用

## 关键技术点

### 颜色匹配算法
- 使用欧几里得距离计算颜色相似度
- 将 RGB 颜色转换为 LAB 色彩空间进行更准确的匹配
- 支持不同的颜色匹配策略

### Canvas 像素处理
- 使用 Canvas API 获取图片像素数据
- 根据网格大小对像素进行采样
- 将采样后的颜色映射到调色板

### 导出实现
- 使用 html2canvas 或 Canvas API 导出 PNG
- 使用 SVG 字符串拼接导出矢量图
- 支持不同分辨率的导出

## 依赖清单

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "lucide-react": "^0.294.0",
    "colorthief": "^2.4.0"
  },
  "devDependencies": {
    "@types/node": "^20.10.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@vitejs/plugin-react": "^4.2.0",
    "electron": "^28.0.0",
    "electron-builder": "^24.9.0",
    "tailwindcss": "^3.4.0",
    "typescript": "^5.3.0",
    "vite": "^5.0.0",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0"
  }
}
```

## 风险与注意事项

1. **图片处理性能**：大尺寸图片可能导致处理缓慢，需要限制图片大小或实现异步处理
2. **颜色匹配精度**：不同颜色空间的转换可能影响匹配结果，需要选择合适的算法
3. **导出兼容性**：不同浏览器对 Canvas 导出的支持可能有差异
4. **Electron 打包**：需要配置正确的构建脚本和打包参数

## 预期成果

- ✅ 网页版应用：可在浏览器中直接使用
- ✅ 桌面版应用：支持 Windows、macOS、Linux
- ✅ 基础转换功能：图片转拼豆网格
- ✅ 自定义调色板：支持多种预设和自定义颜色
- ✅ 导出功能：PNG、SVG 格式导出
- ✅ 响应式设计：适配不同屏幕尺寸

---

计划完成，等待用户确认后开始实施！🎉