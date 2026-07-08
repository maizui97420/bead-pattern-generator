
<h1 align="center">
  🎨 拼豆图案生成器
</h1>

<p align="center">
  <strong>上传图片，一键生成拼豆图纸</strong>
</p>

<p align="center">
  <a href="#功能特性">功能特性</a> •
  <a href="#快速开始">快速开始</a> •
  <a href="#使用说明">使用说明</a> •
  <a href="#技术栈">技术栈</a> •
  <a href="#打包发布">打包发布</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18-61dafb?style=flat-square" alt="React">
  <img src="https://img.shields.io/badge/TypeScript-5-3178c6?style=flat-square" alt="TypeScript">
  <img src="https://img.shields.io/badge/Vite-5-646cff?style=flat-square" alt="Vite">
  <img src="https://img.shields.io/badge/Tailwind%20CSS-3-38bdf8?style=flat-square" alt="Tailwind CSS">
  <img src="https://img.shields.io/badge/Electron-28-47848F?style=flat-square" alt="Electron">
</p>

---

## ✨ 功能特性

### 🖼️ 三种工作模式
- **生成拼豆模式**：上传普通图片，自动匹配拼豆色生成图纸
- **直接编辑模式**：上传已有拼豆图纸，保留原始颜色
- **像素图模式**：1:1 像素映射，使用 K-Means 聚类算法，适合超大图

### 💎 完整 MARD 拼豆色库
- 200+ 真实拼豆色号
- 按色系分类：肤色、粉色、红色、橙色、黄色、绿色、青色、蓝色、紫色、黑白灰、棕色
- 支持按色系快速筛选浏览

### 🎨 高级颜色管理
- 从色库中添加颜色到活动调色板
- 编辑调色板中的颜色（名称 + 色值）
- 删除不需要的颜色
- 一键恢复默认调色板

### 📐 参数调整
- 网格大小：8×8 到 80×80 自由调节
- 拼豆尺寸：2.6mm / 5mm / 7mm / 10mm
- 颜色数量限制：4 到 80 种
- 图像美化：对比度、饱和度、亮度调节

### 📊 详细统计
- 表格形式展示每种颜色的使用数量和占比
- 可视化进度条直观展示颜色分布
- 支持导出 CSV / TXT 格式统计报告

### 🖱️ 预览交互
- 缩放控制（0.5x - 8x）
- 鼠标拖拽平移
- 全屏查看模式
- 显示 / 隐藏颜色名称

### ↩️ 撤销重做
- 30 步历史记录
- Ctrl+Z / Ctrl+Y 快捷键

### 📤 多种导出格式
- **PNG**：高清位图，底部附带颜色统计
- **SVG**：矢量图，无损缩放
- **TXT**：文本格式统计报告

---

## 🚀 快速开始

### 环境要求
- Node.js >= 16
- npm 或 yarn

### 安装依赖
```bash
npm install
```

### 开发模式
```bash
# 网页版开发
npm run dev

# 桌面应用开发
npm run electron:dev
```

### 构建生产版本
```bash
# 构建网页版
npm run build

# 构建桌面应用（Windows）
npm run electron:build
```

---

## 📖 使用说明

1. **上传图片**：拖拽或点击上传区域，选择一张图片
2. **设置参数**：在左侧面板调整网格大小、拼豆尺寸、颜色数量等
3. **选择颜色**：从 MARD 色库中选择需要的拼豆颜色
4. **生成图纸**：点击「生成拼豆图纸」按钮
5. **查看统计**：在预览区域下方查看详细的颜色统计
6. **导出结果**：选择导出格式（PNG / SVG / TXT）

---

## 🛠️ 技术栈

| 类别 | 技术 |
|---|---|
| 框架 | [React 18](https://react.dev/) |
| 语言 | [TypeScript 5](https://www.typescriptlang.org/) |
| 构建工具 | [Vite 5](https://vitejs.dev/) |
| 样式 | [Tailwind CSS 3](https://tailwindcss.com/) |
| 图标 | [Lucide React](https://lucide.dev/) |
| 桌面应用 | [Electron 28](https://www.electronjs.org/) |
| 打包工具 | [electron-builder](https://www.electron.build/) |

---

## 📦 打包发布

### 网页部署

构建后，`dist` 目录即为完整静态网站，可部署到任意静态托管平台：

- **Vercel** / **Netlify**：拖拽 dist 文件夹一键部署
- **GitHub Pages**：推送到 gh-pages 分支
- **腾讯云 COS** / **阿里云 OSS**：上传到对象存储

### 桌面应用

```bash
npm run electron:build
```

打包产物输出到 `release` 目录：
- `*.exe` - NSIS 安装包（推荐）
- `*-portable.exe` - 绿色便携版
- `.dmg` - macOS 安装包（需在 Mac 上构建）
- `.deb` - Linux 安装包（需在 Linux 上构建）

---

## 📁 项目结构

```
.
├── electron/            # Electron 主进程
│   ├── main.ts         # 主入口
│   ├── preload.ts      # 预加载脚本
│   └── tsconfig.json   # 主进程 tsconfig
├── public/             # 静态资源
├── src/
│   ├── components/     # React 组件
│   │   ├── BeadGrid.tsx       # 拼豆网格预览
│   │   ├── BeadStats.tsx      # 数量统计表格
│   │   ├── ColorPalette.tsx   # 颜色调色板
│   │   ├── ExportPanel.tsx    # 导出面板
│   │   ├── ImageUploader.tsx  # 图片上传
│   │   └── Settings.tsx       # 参数设置
│   ├── data/           # 数据
│   │   ├── mardPalette.ts    # MARD 拼豆色库
│   │   └── defaultPalettes.ts # 默认调色板
│   ├── hooks/          # 自定义 Hooks
│   ├── types/          # TypeScript 类型定义
│   ├── utils/          # 工具函数
│   ├── App.tsx         # 主应用组件
│   ├── main.tsx        # 入口文件
│   └── index.css       # 全局样式
├── index.html
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── tsconfig.json
```

---

## 📄 License

MIT License

---

<p align="center">
  Made with ❤️ for 拼豆爱好者
</p>
