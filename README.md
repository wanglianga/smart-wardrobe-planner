# 智能衣橱穿搭规划

一个优雅的私人衣橱管理与穿搭规划 React 应用，帮助用户系统化管理衣物、智能搭配、日历规划和行李打包。

## 原始需求

> 请制作智能衣橱穿搭规划页面，React 页面围绕衣物照片、颜色、材质、季节、天气、场合、洗护状态、日历安排、行李清单和穿搭收藏设计。用户在手机上把上衣、裤装、外套、鞋包和配饰拖到搭配画布，选择通勤、约会、旅行、运动或面试后，页面提示温差、雨天、颜色冲突、正在晾晒、尺码不合和近期重复穿着。整体感觉应像一个有秩序的私人衣橱，而不是商品商城，衣物卡片、试搭区域、日期计划和替换建议要分区明确。

## 项目简介

本应用围绕用户的私人衣橱场景设计，提供以下核心功能：

- **衣橱管理**：按上衣、下装、外套、鞋包、配饰分类浏览衣物，支持颜色、材质、季节、洗护状态多维度筛选
- **智能搭配画布**：支持拖拽或点击添加衣物到搭配区域，实时预览穿搭组合
- **场合选择**：通勤、约会、旅行、运动、面试五大场景适配
- **穿搭智能提示**：温差提醒、雨天提示、颜色冲突检测、洗护状态预警、场合尺码适配、近期重复穿着提醒
- **替换建议**：针对有问题的衣物自动推荐同类替换选项
- **日历规划**：将穿搭方案安排到具体日期，提前规划每日穿着
- **行李清单**：为旅行打包创建衣物清单，跟踪打包进度
- **穿搭收藏**：保存喜欢的搭配组合，随时复用

## 技术栈

- **前端框架**：React 18 + TypeScript
- **构建工具**：Vite 6
- **样式方案**：Tailwind CSS 3
- **状态管理**：Zustand 5（带本地持久化）
- **拖拽交互**：@dnd-kit
- **路由**：React Router 7
- **图标**：Lucide React
- **日期处理**：date-fns
- **字体**：Playfair Display（标题）+ DM Sans（正文）

## 启动方式

### 前置要求

- Node.js >= 20
- npm >= 9 或 pnpm >= 8

### 启动步骤

#### 1. 安装依赖

```bash
npm install
```

#### 2. 启动开发服务

```bash
npm run dev
```

访问地址：http://localhost:5173

#### 3. 生产构建

```bash
npm run build
```

构建产物位于 `dist/` 目录。

#### 4. 预览生产构建

```bash
npm run preview
```

## Docker 一键启动（推荐）

### 前置要求

- Docker >= 20
- Docker Compose >= 2

### 启动步骤

#### 1. 构建并启动服务

```bash
docker compose up --build
```

后台运行：

```bash
docker compose up --build -d
```

访问地址：http://localhost:3000

#### 2. 停止和清理服务

```bash
docker compose down
```

## 项目结构

```
src/
├── assets/          # 静态资源
├── components/      # 可复用组件
│   ├── CalendarView.tsx          # 日历视图
│   ├── CategoryNav.tsx           # 衣物分类导航
│   ├── ClothingCard.tsx          # 衣物卡片（支持拖拽）
│   ├── FilterBar.tsx             # 筛选栏
│   ├── OccasionSelector.tsx      # 场合选择器
│   ├── OutfitCanvas.tsx          # 搭配画布（拖放区域）
│   ├── OutfitHistory.tsx         # 穿搭历史时间线
│   ├── PackingListPanel.tsx      # 行李清单面板
│   ├── ReplacementSuggestions.tsx # 替换建议
│   ├── SavedOutfitCard.tsx       # 收藏搭配卡片
│   ├── SmartTips.tsx             # 智能提示
│   └── WeatherPanel.tsx          # 天气面板
├── data/            # 模拟数据
├── hooks/           # 自定义 Hooks
├── lib/             # 工具函数
├── pages/           # 页面
│   ├── CalendarPage.tsx   # 日历与计划页
│   ├── CollectionPage.tsx # 穿搭收藏页
│   ├── Home.tsx           # 首页（衣橱）
│   ├── OutfitPage.tsx     # 搭配规划页
│   └── WardrobePage.tsx   # 衣橱浏览页
├── store/           # Zustand 状态管理
├── types/           # TypeScript 类型定义
├── utils/           # 业务工具（智能提示生成）
├── App.tsx          # 应用入口
└── main.tsx         # 渲染入口
```

## 功能详解

### 智能提示规则

应用会根据当前搭配组合、所选场合和天气状况，自动生成以下类型的提示：

| 类型 | 触发条件 | 级别 |
|------|----------|------|
| 温差提醒 | 日温差 > 12°C 或气温偏高/偏低 | info / warning |
| 雨天提示 | 当日下雨且鞋包材质易受损，或未携带雨具 | info / warning |
| 颜色冲突 | 红绿、橙粉等传统冲突配色组合，或荧光色搭配 | warning |
| 洗护状态 | 衣物正在清洗或晾干中 | error |
| 尺码适配 | 面试场合穿宽松款、运动场合穿修身款 | info / warning |
| 重复穿着 | 近 3 天内穿过同一件衣物 | warning |

### 颜色主题

采用温暖的大地色系配色，营造私人衣橱的舒适感：

- 主背景：象牙白 `#FAF8F5`
- 强调色：赤陶色 `#C4735B`
- 文字色：炭灰色 `#2C2C2C`
- 辅助色：沙色 `#E8E2DA`、暖灰 `#8B8580`

## 注意事项

- 应用使用浏览器 LocalStorage 持久化数据（Zustand persist），清除浏览器数据会导致衣橱和搭配记录丢失
- 衣物照片使用 AI 图片生成服务，首次加载可能需要一定时间
- 目前为前端 Demo，数据为模拟数据，未接入后端服务
