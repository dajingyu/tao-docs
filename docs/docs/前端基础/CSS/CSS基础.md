<!--
 * @Date: 2025-02-07 17:09:39
 * @LastEditors: 我家有条大鲸鱼
 * @LastEditTime: 2025-02-28 18:43:32
 * @Description: 文件信息
-->
# CSS核心知识体系

## 第一章 CSS3新特性全景

### 1.1 布局革命

#### Flexbox 弹性布局

Flexbox（Flexible Box Layout）是一种一维布局模型，用于在容器内灵活地排列和对齐项目。它特别适合处理组件内部元素的排列、对齐和空间分配。

**核心属性体系：**
```css
.container {
  display: flex;
  flex-direction: row | row-reverse | column | column-reverse;
  flex-wrap: nowrap | wrap | wrap-reverse;
  justify-content: flex-start | flex-end | center | space-between | space-around | space-evenly;
  align-items: stretch | flex-start | flex-end | center | baseline;
  align-content: flex-start | flex-end | center | space-between | space-around | stretch;
}

.item {
  order: <integer>;
  flex-grow: <number>; /* 默认0 */
  flex-shrink: <number>; /* 默认1 */
  flex-basis: <length> | auto; /* 默认auto */
  align-self: auto | flex-start | flex-end | center | baseline | stretch;
}
```

**典型布局案例：**
1. 导航栏布局
```css
/* 容器设置 */
.nav {
  display: flex; /* 启用弹性布局 */
  justify-content: space-between; /* 主轴空间分布 */
  align-items: center; /* 交叉轴居中对齐 */
}

/* 子项设置 */
.logo { 
  order: 1; /* 显示顺序调整 */
}
.menu { 
  order: 2; 
  flex: 1; /* 简写属性：flex-grow:1 | flex-shrink:1 | flex-basis:0% */
}
.user { 
  order: 3; 
}
```

2. 圣杯布局（三栏自适应）
```css
/* 外层容器 */
.container {
  display: flex;
  min-height: 100vh; /* 视口高度填充 */
  flex-direction: column; /* 垂直方向排列 */
}

/* 主内容区 */
.main {
  flex: 1; /* 占据剩余空间 */
  display: flex; /* 嵌套弹性布局 */
}

.content { 
  flex: 1; /* 主内容区自适应 */
}
.aside { 
  width: 200px; /* 侧边栏固定宽度 */
}
```

#### Grid 网格布局

Grid（CSS Grid Layout）是一种二维布局系统，能够同时处理行和列，非常适合创建复杂的网页布局。与 Flexbox 的一维布局不同，Grid 提供了更强大的布局控制能力。

**核心属性体系：**
```css
.container {
  display: grid;
  /* 定义列：自动适应容器，最小200px，最大1fr */
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  /* 定义行：自动行高，最小150px */
  grid-auto-rows: minmax(150px, auto);
  /* 网格间距：行间距和列间距 */
  gap: 20px;
  /* 命名区域：定义布局结构 */
  grid-template-areas:
    "header header"
    "sidebar content";
}

.item {
  /* 列定位：从第1列开始，跨越2列 */
  grid-column: 1 / span 2;
  /* 行定位：从第2行到第4行 */
  grid-row: 2 / 4;
  /* 区域定位：使用命名区域 */
  grid-area: header;
  /* 自身对齐：水平和垂直居中 */
  place-self: center;
}
```

**注意**：`grid-template-rows: masonry` 是实验性特性，目前浏览器支持有限，不建议在生产环境使用。

**典型布局案例：**
1. 响应式卡片网格
```css
.gallery {
  display: grid;
  /* 自动填充列，最小300px，最大1fr */
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  /* 自动行高，最小200px */
  grid-auto-rows: minmax(200px, auto);
  gap: 1rem; /* 网格间隙 */
}

/* 首张卡片跨列显示 */
.card:nth-child(1) {
  grid-column: 1 / -1; /* 从第一列到最后一列 */
}
```

2. 杂志式复杂布局
```css
.layout {
  display: grid;
  /* 列定义：侧边栏240px + 主内容区自适应 */
  grid-template-columns: 240px 1fr;
  /* 行定义：头部80px + 主内容区自适应 + 底部60px */
  grid-template-rows: 80px 1fr 60px;
  /* 区域命名 */
  grid-template-areas:
    "header header"
    "sidebar main"
    "footer footer";
}

/* 区域分配 */
.header { grid-area: header; }
.sidebar { grid-area: sidebar; }
.main { grid-area: main; }
.footer { grid-area: footer; }
```

#### 布局方案选择指南

选择合适的布局方案能够提高开发效率和代码可维护性。以下是 Flexbox 和 Grid 的选择建议：

| 场景特征                | 推荐方案 | 理由说明                  |
|-------------------------|----------|-------------------------|
| 一维布局（单行或单列）  | Flexbox  | 单项排列控制更灵活，API 更简单 |
| 二维复杂布局            | Grid     | 行列定义更直观，支持复杂布局结构 |
| 未知项动态布局          | Flexbox  | 内容驱动布局更合适，自动适应内容 |
| 严格对齐需求            | Grid     | 网格线系统更精确，支持多维度对齐 |
| 旧浏览器兼容（IE10+）   | Flexbox  | 支持度更广泛，兼容性更好 |
| 嵌套布局                | 混合使用 | 外层用 Grid，内层用 Flexbox |

**实际应用建议**：
- 导航栏、工具栏、表单行：使用 Flexbox
- 卡片网格、仪表盘、复杂页面布局：使用 Grid
- 可以组合使用：Grid 作为外层布局，Flexbox 处理内部元素排列

### 1.2 视觉增强

#### 变形与过渡

CSS Transform 和 Transition 提供了丰富的视觉效果，能够创建流畅的用户交互体验。

**Transform（变形）**：
```css
.card:hover {
  /* 组合变换：旋转5度并放大1.05倍 */
  transform: rotate(5deg) scale(1.05);
  /* 过渡效果：所有属性，0.3秒，缓动函数 */
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
```

**常用变换函数**：
- `translate(x, y)`：平移
- `rotate(angle)`：旋转
- `scale(x, y)`：缩放
- `skew(x, y)`：倾斜

**应用场景**：卡片悬停效果、按钮交互、加载动画

#### 动画系统

CSS Animation 提供了比 Transition 更强大的动画控制能力，支持关键帧动画。

```css
/* 定义关键帧动画 */
@keyframes slideIn {
  from { 
    transform: translateX(-100%); 
    opacity: 0;
  }
  to { 
    transform: translateX(0); 
    opacity: 1;
  }
}

.modal {
  /* 应用动画：名称、时长、填充模式 */
  animation: slideIn 0.5s forwards;
}
```

**动画属性**：
- `animation-name`：动画名称
- `animation-duration`：动画时长
- `animation-timing-function`：缓动函数
- `animation-delay`：延迟时间
- `animation-iteration-count`：重复次数
- `animation-direction`：播放方向
- `animation-fill-mode`：填充模式（forwards/backwards/both）

**应用场景**：页面入场动画、状态提示、加载指示器、微交互效果

### 1.3 响应式设计

#### 媒体查询增强

现代 CSS 媒体查询支持更多特性检测，能够精确适配不同设备和用户偏好。

```css
/* 检测设备是否支持悬停操作 */
@media (hover: hover) and (min-width: 1024px) {
  .menu { display: block; }
}

/* 暗黑模式适配 */
@media (prefers-color-scheme: dark) {
  body {
    background-color: #1a1a1a;
    color: #ffffff;
  }
}

/* 减少动画偏好 */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

**常用媒体特性**：
- `min-width` / `max-width`：视口宽度
- `hover`：是否支持悬停
- `prefers-color-scheme`：颜色方案偏好（dark/light）
- `prefers-reduced-motion`：减少动画偏好
- `orientation`：设备方向（portrait/landscape）

**应用场景**：设备适配、暗黑模式、无障碍支持、打印样式

#### 视口单位

视口单位（Viewport Units）基于浏览器视口尺寸，非常适合创建响应式布局。

```css
/* 基本视口单位 */
.fullscreen {
  width: 100vw;   /* 视口宽度 */
  height: 100vh;  /* 视口高度 */
}

/* 动态视口单位（现代浏览器） */
.header {
  height: 100dvh; /* 动态视口高度，考虑移动端地址栏 */
}

/* 小视口单位 */
.small-text {
  font-size: 2vmin; /* 视口较小尺寸的2% */
}
```

**视口单位说明**：
- `vw` / `vh`：视口宽度/高度的百分比
- `vmin` / `vmax`：视口较小/较大尺寸的百分比
- `dvw` / `dvh`：动态视口单位（考虑浏览器 UI）
- `svw` / `svh`：小视口单位（不考虑浏览器 UI）
- `lvw` / `lvh`：大视口单位

**应用场景**：全屏布局、字体响应式、移动端适配、弹窗居中

## 第二章 核心概念解析
### 2.1 盒子模型（Box Model）
- **标准 vs IE模型**
  ```css
  /* 切换盒模型 */
  .box { box-sizing: border-box; }
  ```
  - 应用场景：精确尺寸控制、第三方组件集成
- **BFC机制**
  - 触发条件：overflow: hidden/display: flow-root
  - 作用：清除浮动、防止外边距合并

### 2.2 选择器系统

#### 组合选择器进阶

CSS 提供了丰富的选择器组合方式，能够精确选择目标元素。

```css
/* 相邻兄弟选择器：紧跟在 h2 后面的 p */
h2 + p { margin-top: 0; }

/* 通用兄弟选择器：h2 后面的所有 p */
h2 ~ p { color: #666; }

/* 属性选择器：根据属性值选择 */
input[type="text"]:invalid { 
  border-color: red; 
}

/* 属性包含选择器 */
a[href*="example"] { color: blue; }
```

#### 现代伪类选择器

CSS3 引入了强大的新伪类选择器，大大增强了选择能力。

```css
/* :is() - 匹配任意一个选择器 */
:is(h1, h2, h3) { 
  margin-top: 1em; 
}

/* :where() - 与 :is() 类似，但优先级为0 */
:where(.card, .panel) { 
  padding: 1rem; 
}

/* :has() - 父选择器（匹配包含特定子元素的父元素） */
.card:has(img) { 
  border: 2px solid blue; 
}

/* :not() - 否定选择器 */
input:not([type="submit"]) { 
  width: 100%; 
}

/* 结构伪类 */
li:nth-child(2n+1) { 
  background: #f5f5f5; 
}

/* 表单状态伪类 */
input:placeholder-shown { 
  border-color: #ccc; 
}

input:focus-visible { 
  outline: 2px solid blue; 
}
```

**新伪类选择器说明**：
- `:is()`：匹配列表中任意一个选择器，优先级取最高值
- `:where()`：与 `:is()` 功能相同，但优先级始终为 0
- `:has()`：父选择器，匹配包含特定子元素的元素（现代浏览器支持）
- `:focus-visible`：仅在键盘导航时显示焦点样式

#### 伪元素应用

伪元素用于创建不在 DOM 中的虚拟元素，常用于装饰性内容。

```css
/* 内容前插入 */
.price::before { 
  content: "¥"; 
}

/* 内容后插入 */
.link::after { 
  content: " →"; 
}

/* 首行样式 */
p::first-line { 
  font-weight: bold; 
}

/* 首字母样式 */
p::first-letter { 
  font-size: 2em; 
  float: left; 
}
```

### 2.3 层叠与继承
- **优先级计算表**
  | 选择器类型         | 示例            | 权重值 |
  |--------------------|-----------------|--------|
  | !important         | color: red!important | ∞    |
  | 内联样式           | style="..."     | 1000   |
  | ID选择器           | #header         | 100    |
  | 类/属性/伪类选择器 | .active         | 10     |
  | 元素/伪元素选择器  | div::after      | 1      |
  
- **继承控制**
  ```css
  /* 强制继承 */
  .child { color: inherit; }
  
  /* 阻止继承 */
  .parent { all: unset; }
  ```

## 第三章 工程化实践

### 3.1 现代布局方案

#### 多列布局

CSS Multi-column Layout 可以将内容自动分成多列，类似报纸排版。

```css
.article {
  /* 列数：自动分成3列 */
  column-count: 3;
  /* 列间距 */
  column-gap: 2em;
  /* 列分隔线 */
  column-rule: 1px solid #ddd;
  /* 列宽度（与 column-count 二选一） */
  column-width: 200px;
}
```

**应用场景**：新闻排版、文章阅读、瀑布流布局

#### 粘性定位

`position: sticky` 结合了相对定位和固定定位的特点，元素在滚动到指定位置时"粘住"。

```css
.sticky-header {
  position: sticky;
  top: 0;
  /* 背景模糊效果 */
  backdrop-filter: blur(5px);
  background-color: rgba(255, 255, 255, 0.9);
  z-index: 100;
}
```

**工作原理**：
- 在正常文档流中表现为 `relative`
- 滚动到指定位置（如 `top: 0`）时变为 `fixed`
- 父容器滚动出视口时，元素随之滚动

**应用场景**：固定导航栏、表格标题行、侧边栏目录

#### 容器查询（Container Queries）

容器查询允许基于父容器的尺寸而非视口尺寸来应用样式，这是响应式设计的重大突破。

```css
/* 定义容器上下文 */
.card-container {
  container-type: inline-size;
  container-name: card-container;
}

/* 基于容器宽度应用样式 */
@container card-container (min-width: 400px) {
  .card {
    display: grid;
    grid-template-columns: 200px 1fr;
  }
}

/* 使用容器名称 */
@container sidebar (min-width: 300px) {
  .widget {
    font-size: 1.2em;
  }
}
```

**容器查询属性**：
- `container-type`：`inline-size`（基于宽度）或 `size`（基于宽高）
- `container-name`：为容器命名，便于精确查询

**应用场景**：组件级响应式设计、卡片布局适配、侧边栏自适应

#### 子网格（Subgrid）

Subgrid 允许网格项目继承父网格的轨道定义，创建嵌套网格布局。

```css
.parent-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.child-item {
  display: grid;
  /* 继承父网格的列定义 */
  grid-template-columns: subgrid;
  grid-column: span 2; /* 跨越2列 */
}
```

**注意**：Subgrid 目前浏览器支持有限，建议谨慎使用。

**应用场景**：复杂嵌套布局、对齐多个网格项目

### 3.2 性能优化

#### GPU 加速

通过触发 GPU 硬件加速，可以显著提升动画和变换的性能。

```css
.animate {
  /* 提示浏览器该元素将发生变化 */
  will-change: transform;
  /* 触发硬件加速（创建新的层叠上下文） */
  transform: translateZ(0);
  /* 或者使用 */
  transform: translate3d(0, 0, 0);
}
```

**最佳实践**：
- 仅在需要时使用 `will-change`，使用后及时移除
- 优先使用 `transform` 和 `opacity` 做动画（不会触发重排）
- 避免频繁修改 `will-change`

#### CSS 变量（自定义属性）

CSS 自定义属性提供了强大的主题系统和动态样式能力。

```css
/* 定义全局变量 */
:root {
  --primary-color: #2196F3;
  --spacing-unit: 8px;
  --border-radius: 4px;
}

/* 使用变量 */
.button {
  background: var(--primary-color);
  padding: calc(var(--spacing-unit) * 2);
  border-radius: var(--border-radius);
}

/* 变量作用域和继承 */
.card {
  --card-bg: #ffffff;
  background: var(--card-bg);
}

/* 变量默认值 */
.text {
  color: var(--text-color, #333333);
}

/* 在 JavaScript 中动态修改 */
/* document.documentElement.style.setProperty('--primary-color', '#ff0000'); */
```

**高级用法**：
- 变量可以嵌套使用
- 支持 `calc()` 计算
- 可以通过 JavaScript 动态修改
- 支持作用域和继承

#### 内容可见性（Content Visibility）

`content-visibility` 可以跳过不可见内容的渲染，大幅提升初始加载性能。

```css
.long-list {
  /* 跳过不在视口内的内容渲染 */
  content-visibility: auto;
  /* 保持元素尺寸，避免布局抖动 */
  contain-intrinsic-size: 200px;
}

/* 完全跳过渲染（需要手动控制显示） */
.hidden-section {
  content-visibility: hidden;
}
```

**应用场景**：长列表、折叠内容、标签页内容

#### 容器类型（Contain）

`contain` 属性告诉浏览器元素及其子元素与文档树的其余部分隔离，优化渲染性能。

```css
.widget {
  /* 布局隔离：子元素不影响外部布局 */
  contain: layout;
  /* 样式隔离：子元素样式不影响外部 */
  contain: style;
  /* 绘制隔离：子元素绘制不影响外部 */
  contain: paint;
  /* 尺寸隔离：子元素尺寸变化不影响外部 */
  contain: size;
  /* 组合使用 */
  contain: layout style paint;
  /* 严格隔离（所有类型） */
  contain: strict;
}
```

**性能收益**：
- 减少重排和重绘范围
- 优化浏览器渲染计算
- 提升滚动性能

**应用场景**：独立组件、复杂嵌套结构、频繁更新的元素

### 3.3 常见问题解决方案

#### 垂直居中终极方案

现代 CSS 提供了多种简洁的居中方案。

```css
/* 方案1：Grid（推荐） */
.center {
  display: grid;
  place-items: center; /* 水平和垂直居中 */
}

/* 方案2：Flexbox */
.center-flex {
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 方案3：绝对定位 + Transform */
.center-absolute {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
```

#### 1px 边框问题

在高 DPI 屏幕上，1px 可能显示过粗，需要使用缩放技巧。

```css
.thin-border {
  position: relative;
}

.thin-border::after {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  /* 缩放0.5倍，实现0.5px效果 */
  transform: scale(0.5);
  transform-origin: 0 0;
  border: 1px solid #000;
  box-sizing: border-box;
}

/* 现代方案：使用设备像素比 */
@media (-webkit-min-device-pixel-ratio: 2) {
  .thin-border {
    border-width: 0.5px;
  }
}
```

#### CSS 层叠层（@layer）

CSS 层叠层提供了更精确的样式优先级控制，解决样式冲突问题。

```css
/* 定义层叠层顺序 */
@layer reset, base, components, utilities;

/* 重置层 */
@layer reset {
  * {
    margin: 0;
    padding: 0;
  }
}

/* 基础层 */
@layer base {
  body {
    font-family: system-ui;
  }
}

/* 组件层 */
@layer components {
  .button {
    padding: 0.5em 1em;
  }
}

/* 工具层（优先级最高） */
@layer utilities {
  .text-center {
    text-align: center;
  }
}
```

**层叠层优势**：
- 明确的优先级顺序
- 避免 `!important` 滥用
- 更好的样式组织和管理

**应用场景**：大型项目样式管理、第三方样式集成、主题系统