# CSS 进阶知识

## 一、CSS 加载机制

### 1.1 link 与 @import 的区别

| 特性 | `<link>` | `@import` |
|------|----------|-----------|
| **标签类型** | HTML 标签 | CSS 规则 |
| **加载时机** | 页面加载时同步加载 | 页面加载完成后才加载 |
| **阻塞渲染** | 会阻塞渲染 | 不会阻塞渲染（但可能导致 FOUC） |
| **浏览器兼容性** | 所有浏览器支持 | IE5+ 支持 |
| **优先级** | 较高 | 较低 |
| **使用场景** | 推荐用于主要样式表 | 适用于条件加载或模块化 |

**实际应用**：
```html
<!-- ✅ 推荐：使用 link 引入主要样式 -->
<link rel="stylesheet" href="main.css">

<!-- ❌ 不推荐：使用 @import -->
<style>
  @import url('styles.css');
</style>
```

**性能影响**：
- `@import` 会导致额外的 HTTP 请求
- `@import` 可能造成样式闪烁（FOUC）
- 现代构建工具会在构建时处理 `@import`

---

## 二、浏览器兼容性问题

### 2.1 Chrome 中文界面下 12px 文本限制

**问题**：Chrome 浏览器在中文界面下，默认会将小于 12px 的文本强制按照 12px 显示。

**解决方案**：
```css
/* ❌ 不推荐：影响可访问性 */
.small-text {
  -webkit-text-size-adjust: none;
  font-size: 10px;
}

/* ✅ 推荐：使用 transform */
.small-text {
  font-size: 12px;
  transform: scale(0.83);        /* 12px * 0.83 ≈ 10px */
  transform-origin: left top;
}

/* ✅ 最佳：使用相对单位 */
.small-text {
  font-size: 0.625rem;            /* 10px (假设根字体为16px) */
}
```

### 2.2 超链接伪类顺序问题

**问题**：当超链接被访问后，`:hover` 和 `:active` 样式可能失效。

**解决方案：遵循 LVHA 顺序**
```css
/* ✅ 正确顺序：Link → Visited → Hover → Active */
a:link {
  color: blue;
  text-decoration: none;
}

a:visited {
  color: purple;
}

a:hover {
  color: red;
  text-decoration: underline;
}

a:active {
  color: orange;
}
```

**记忆技巧**：LoVe HAte（爱恨）- Link, Visited, Hover, Active

---

## 三、布局相关问题

### 3.1 外边距合并（Margin Collapse）

**触发条件**：
- 相邻块级元素的垂直外边距
- 父子元素之间（子元素的 margin-top 与父元素的 margin-top 合并）
- 空元素（只有 margin，没有内容）

**解决方案**：
```css
/* 方案1：统一使用 margin-top 或 margin-bottom */
.section {
  margin-bottom: 20px;           /* 统一使用 */
}

/* 方案2：使用 padding 代替 margin */
.container {
  padding-bottom: 20px;          /* padding 不会合并 */
}

/* 方案3：创建 BFC */
.parent {
  overflow: hidden;               /* 或 display: flow-root */
}

/* 方案4：使用 Flexbox 或 Grid 的 gap */
.container {
  display: flex;
  flex-direction: column;
  gap: 20px;                     /* gap 不会合并 */
}
```

---

## 四、浏览器渲染机制

### 4.1 重绘（Repaint）与重排（Reflow）

#### 重绘（Repaint）
**定义**：元素外观改变，但不影响布局时，浏览器重新绘制元素。

**触发条件**：
- 改变颜色：`color`、`background-color`
- 改变边框样式：`border-style`、`border-color`
- 改变可见性：`visibility`
- 改变轮廓：`outline`

**特点**：
- 只影响元素外观，不改变布局
- 性能开销相对较小

#### 重排（Reflow）
**定义**：元素布局属性改变，导致渲染树需要重新计算布局。

**触发条件**：

1. **DOM 结构变化**
   - 添加或删除可见的 DOM 元素
   - 改变元素位置（`position`、`top`、`left` 等）

2. **元素尺寸变化**
   - 改变元素大小：`width`、`height`
   - 改变内外边距：`margin`、`padding`
   - 改变边框：`border-width`

3. **内容变化**
   - 文本内容改变导致尺寸变化
   - 图片加载完成改变尺寸
   - 表单输入导致内容变化

4. **浏览器窗口变化**
   - 窗口大小改变（`resize` 事件）
   - 滚动条出现/消失

5. **读取布局属性**（强制同步布局）
   ```javascript
   // ❌ 这些操作会强制浏览器立即计算布局
   element.offsetLeft
   element.offsetTop
   element.offsetWidth
   element.offsetHeight
   element.clientWidth
   element.clientHeight
   element.getComputedStyle()
   ```

**重排与重绘的关系**：
- **重排必定会引发重绘**：布局改变后需要重新绘制
- **重绘不一定会引发重排**：只改变外观时不需要重新布局

**性能影响**：
- 重排的性能开销远大于重绘
- 频繁的重排会导致页面卡顿

### 4.2 性能优化策略

#### 1. 减少重排和重绘
```css
/* ✅ 使用 transform 和 opacity（不会触发重排） */
.animate {
  transform: translateX(100px);   /* 使用 transform 而非 left */
  opacity: 0.5;                   /* 使用 opacity 而非 visibility */
}

/* ✅ 使用 will-change 提示浏览器 */
.will-animate {
  will-change: transform;
}
```

```javascript
// ❌ 不好：多次重排
element.style.width = '100px';
element.style.height = '100px';
element.style.margin = '10px';

// ✅ 好：使用 class 或 cssText
element.className = 'new-style';
// 或
element.style.cssText = 'width: 100px; height: 100px; margin: 10px;';
```

#### 2. 避免强制同步布局
```javascript
// ❌ 不好：强制同步布局（布局抖动）
for (let i = 0; i < items.length; i++) {
  items[i].style.width = items[i].offsetWidth + 10 + 'px';
}

// ✅ 好：先读取，后写入
const widths = items.map(item => item.offsetWidth);
items.forEach((item, i) => {
  item.style.width = widths[i] + 10 + 'px';
});
```

#### 3. 使用文档片段
```javascript
// ❌ 不好：多次 DOM 操作
for (let i = 0; i < 1000; i++) {
  container.appendChild(createElement());
}

// ✅ 好：使用文档片段
const fragment = document.createDocumentFragment();
for (let i = 0; i < 1000; i++) {
  fragment.appendChild(createElement());
}
container.appendChild(fragment);
```

---

## 五、现代 CSS 特性

### 5.1 CSS 变量（自定义属性）

#### 基础用法
```css
/* 定义全局变量 */
:root {
  --primary-color: #2196F3;
  --spacing-unit: 8px;
  --border-radius: 4px;
  
  /* 变量可以引用其他变量 */
  --card-padding: calc(var(--spacing-unit) * 2);
}

/* 使用变量 */
.button {
  background: var(--primary-color);
  padding: calc(var(--spacing-unit) * 2);
  border-radius: var(--border-radius);
}
```

#### 作用域和继承
```css
/* 作用域变量 */
.card {
  --card-bg: #ffffff;
  background: var(--card-bg);
}

.card.dark {
  --card-bg: #1a1a1a;           /* 覆盖父级变量 */
}
```

#### 变量默认值
```css
.text {
  color: var(--text-color, #333333);  /* 如果变量不存在，使用默认值 */
}
```

#### JavaScript 动态修改
```javascript
// 修改 CSS 变量
document.documentElement.style.setProperty('--primary-color', '#ff0000');

// 读取 CSS 变量
const primaryColor = getComputedStyle(document.documentElement)
  .getPropertyValue('--primary-color');
```

**案例**：主题切换
```html
<button onclick="toggleTheme()">切换主题</button>
<div class="card">卡片内容</div>
```

```css
:root {
  --bg-color: #ffffff;
  --text-color: #333333;
}

[data-theme="dark"] {
  --bg-color: #1a1a1a;
  --text-color: #ffffff;
}

.card {
  background: var(--bg-color);
  color: var(--text-color);
  padding: 1rem;
  border-radius: 8px;
}
```

```javascript
function toggleTheme() {
  const root = document.documentElement;
  const currentTheme = root.getAttribute('data-theme');
  root.setAttribute('data-theme', currentTheme === 'dark' ? 'light' : 'dark');
}
```

### 5.2 新的视口单位

| 单位 | 说明 | 特点 |
|------|------|------|
| `vw` / `vh` | 传统视口单位 | 可能包含浏览器 UI |
| `dvw` / `dvh` | 动态视口单位 | 自动适应浏览器 UI 变化 |
| `svw` / `svh` | 小视口单位 | 不考虑浏览器 UI |
| `lvw` / `lvh` | 大视口单位 | 不考虑浏览器 UI |

```css
/* 传统视口单位 */
.fullscreen {
  width: 100vw;                 /* 视口宽度 */
  height: 100vh;                /* 视口高度 */
}

/* 动态视口单位（推荐移动端） */
.modal {
  height: 100dvh;               /* 动态视口高度 */
  width: 100dvw;                /* 动态视口宽度 */
}

/* 小视口单位 */
.mobile-header {
  height: 100svh;               /* 小视口高度 */
}
```

**应用场景**：
- `dvh`：移动端全屏弹窗（考虑地址栏）
- `svh`：固定头部高度
- `vh`：桌面端全屏布局

### 5.3 逻辑属性（Logical Properties）

逻辑属性提供了与书写方向无关的布局方式，支持国际化。

```css
/* 传统物理属性 */
.box {
  margin-top: 10px;
  margin-right: 20px;
  margin-bottom: 10px;
  margin-left: 20px;
  padding-left: 15px;
  border-right: 1px solid #000;
}

/* 逻辑属性（自动适应书写方向） */
.box {
  margin-block-start: 10px;     /* 块级开始（上/右，取决于方向） */
  margin-inline-end: 20px;      /* 行内结束（右/左） */
  margin-block-end: 10px;        /* 块级结束（下/左） */
  margin-inline-start: 20px;     /* 行内开始（左/右） */
  padding-inline-start: 15px;
  border-inline-end: 1px solid #000;
}

/* 简写形式 */
.box {
  margin-block: 10px;            /* 块级方向（上下） */
  margin-inline: 20px;           /* 行内方向（左右） */
}
```

**应用场景**：
- 多语言网站（支持 RTL 语言）
- 响应式设计
- 国际化应用

---

## 六、动画与变换

### 6.1 Transform（变换）

#### 变换函数
```css
.element {
  /* 平移 */
  transform: translateX(100px);      /* 水平移动 */
  transform: translateY(50px);       /* 垂直移动 */
  transform: translate(100px, 50px); /* 同时移动 */
  
  /* 旋转 */
  transform: rotate(45deg);          /* 旋转45度 */
  
  /* 缩放 */
  transform: scale(1.5);             /* 放大1.5倍 */
  transform: scaleX(1.5);            /* 水平放大 */
  transform: scaleY(1.5);            /* 垂直放大 */
  transform: scale(1.5, 0.8);       /* 水平1.5倍，垂直0.8倍 */
  
  /* 倾斜 */
  transform: skewX(15deg);           /* 水平倾斜 */
  transform: skewY(15deg);           /* 垂直倾斜 */
  transform: skew(15deg, 10deg);     /* 同时倾斜 */
  
  /* 组合变换 */
  transform: translate(50px, 50px) rotate(45deg) scale(1.2);
}
```

**注意**：变换不会触发重排，只触发重绘，性能好。

#### 变换原点
```css
.element {
  transform-origin: center;          /* 中心（默认） */
  transform-origin: top left;       /* 左上角 */
  transform-origin: 50% 50%;        /* 中心（百分比） */
  transform-origin: 20px 30px;     /* 固定位置 */
}
```

**案例**：卡片悬停效果
```html
<div class="card">
  <h3>标题</h3>
  <p>内容...</p>
</div>
```

```css
.card {
  transition: transform 0.3s ease;
}

.card:hover {
  transform: translateY(-10px) scale(1.05);
  box-shadow: 0 10px 20px rgba(0,0,0,0.2);
}
```

### 6.2 Transition（过渡）

```css
.element {
  /* 简写：属性 时长 缓动函数 延迟 */
  transition: all 0.3s ease 0s;
  
  /* 分别设置 */
  transition-property: transform, opacity;  /* 要过渡的属性 */
  transition-duration: 0.3s;                /* 过渡时长 */
  transition-timing-function: ease;        /* 缓动函数 */
  transition-delay: 0s;                     /* 延迟时间 */
}
```

**transition-property 取值**：
- `all`：所有属性
- 具体属性：`transform`、`opacity`、`color` 等

**transition-timing-function 取值**：
- `ease`（默认）：慢-快-慢
- `linear`：匀速
- `ease-in`：慢-快
- `ease-out`：快-慢
- `ease-in-out`：慢-快-慢
- `cubic-bezier(0.4, 0, 0.2, 1)`：自定义贝塞尔曲线

**案例**：按钮交互
```css
.button {
  background: #2196F3;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  transition: background 0.3s ease, transform 0.2s ease;
  cursor: pointer;
}

.button:hover {
  background: #1976D2;
  transform: translateY(-2px);
}

.button:active {
  transform: translateY(0);
}
```

### 6.3 Animation（动画）

#### 定义关键帧
```css
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

/* 多关键帧 */
@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}
```

#### 应用动画
```css
.element {
  /* 简写：名称 时长 缓动函数 延迟 次数 方向 填充模式 */
  animation: slideIn 0.5s ease 0s 1 normal forwards;
  
  /* 分别设置 */
  animation-name: slideIn;              /* 动画名称 */
  animation-duration: 0.5s;             /* 动画时长 */
  animation-timing-function: ease;     /* 缓动函数 */
  animation-delay: 0s;                  /* 延迟时间 */
  animation-iteration-count: 1;         /* 重复次数：数字/infinite */
  animation-direction: normal;          /* 方向：normal/reverse/alternate */
  animation-fill-mode: forwards;        /* 填充模式 */
  animation-play-state: running;        /* 播放状态：running/paused */
}
```

**animation-fill-mode 取值**：
- `none`（默认）：动画前后不应用样式
- `forwards`：动画结束后保持最后一帧
- `backwards`：动画开始前应用第一帧
- `both`：同时应用 forwards 和 backwards

**案例**：加载动画
```html
<div class="loading">
  <div class="spinner"></div>
</div>
```

```css
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #2196F3;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}
```

---

## 七、响应式设计

### 7.1 媒体查询

#### 基础语法
```css
/* 视口宽度 */
@media (min-width: 768px) {
  .container {
    max-width: 1200px;
  }
}

/* 视口高度 */
@media (min-height: 600px) {
  .sidebar {
    position: sticky;
    top: 0;
  }
}

/* 设备方向 */
@media (orientation: landscape) {
  .header {
    height: 60px;
  }
}
```

#### 现代媒体特性
```css
/* 检测设备是否支持悬停 */
@media (hover: hover) {
  .button:hover {
    background: #1976D2;
  }
}

/* 暗黑模式 */
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

#### 组合查询
```css
@media (min-width: 768px) and (max-width: 1024px) {
  .container {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) and (hover: hover) {
  .card:hover {
    transform: scale(1.05);
  }
}
```

**案例**：响应式导航栏
```html
<nav class="navbar">
  <div class="logo">Logo</div>
  <ul class="menu">
    <li>首页</li>
    <li>产品</li>
    <li>关于</li>
  </ul>
  <button class="menu-toggle">菜单</button>
</nav>
```

```css
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
}

.menu {
  display: flex;
  gap: 2rem;
  list-style: none;
}

.menu-toggle {
  display: none;
}

/* 移动端：隐藏菜单，显示切换按钮 */
@media (max-width: 768px) {
  .menu {
    display: none;
  }
  
  .menu-toggle {
    display: block;
  }
}
```

### 7.2 容器查询（Container Queries）

容器查询允许基于父容器的尺寸而非视口尺寸来应用样式。

```css
/* 定义容器上下文 */
.card-container {
  container-type: inline-size;        /* 基于宽度 */
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

**container-type 取值**：
- `inline-size`：基于宽度
- `size`：基于宽高
- `normal`：不创建容器上下文

**浏览器支持**：Chrome 105+、Firefox 110+、Safari 16+

---

## 八、性能优化

### 8.1 GPU 加速

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

### 8.2 内容可见性（Content Visibility）

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

**content-visibility 取值**：
- `visible`（默认）：正常渲染
- `hidden`：跳过渲染
- `auto`：自动跳过不可见内容

**应用场景**：长列表、折叠内容、标签页内容

### 8.3 容器类型（Contain）

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

---

## 九、CSS 层叠层（@layer）

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

**浏览器支持**：Chrome 99+、Firefox 97+、Safari 15.4+

---

## 十、CSS Modules（CSS 模块化）

### 10.1 CSS Modules 原理

#### 核心概念
CSS Modules 是一种 CSS 模块化解决方案，通过**构建时处理**将类名转换为**唯一的哈希值**，实现样式隔离，避免全局污染。

#### 工作原理
1. **构建时处理**：在构建阶段（Webpack、Vite等），CSS Modules 会：
   - 解析 CSS 文件中的类名
   - 生成唯一的哈希类名（如 `.button_abc123`）
   - 将映射关系导出为 JavaScript 对象

2. **样式隔离**：每个模块的类名都是唯一的，不会与其他模块冲突

3. **局部作用域**：默认所有类名都是局部的，需要使用 `:global()` 声明全局类名

#### 与普通 CSS 的区别

| 特性 | 普通 CSS | CSS Modules |
|------|---------|-------------|
| **作用域** | 全局 | 局部（模块化） |
| **类名冲突** | 容易冲突 | 自动避免冲突 |
| **类名引用** | 字符串 | JavaScript 对象 |
| **构建处理** | 无 | 需要构建工具支持 |

### 10.2 基本使用

#### 文件命名
CSS Modules 文件通常以 `.module.css` 结尾：
```
Button.module.css
Card.module.css
```

#### CSS 文件编写
```css
/* Button.module.css */
.button {
  background: #2196F3;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.button:hover {
  background: #1976D2;
}

.primary {
  background: #4CAF50;
}

/* 全局类名（不会被转换） */
:global(.global-class) {
  color: red;
}
```

#### JavaScript/TypeScript 中使用

**React 示例**：
```jsx
import React from 'react';
import styles from './Button.module.css';

function Button({ children, variant }) {
  return (
    <button className={`${styles.button} ${styles[variant]}`}>
      {children}
    </button>
  );
}

// 使用
<Button variant="primary">点击</Button>
```

**Vue 示例**：
```vue
<template>
  <button :class="[styles.button, styles[variant]]">
    <slot></slot>
  </button>
</template>

<script setup>
import styles from './Button.module.css';

defineProps({
  variant: {
    type: String,
    default: 'default'
  }
});
</script>
```

**原生 JavaScript 示例**：
```javascript
import styles from './Button.module.css';

const button = document.createElement('button');
button.className = styles.button;
button.textContent = '点击';
document.body.appendChild(button);
```

### 10.3 高级用法

#### 组合类名
```css
/* Button.module.css */
.button {
  padding: 10px 20px;
}

.primary {
  background: #2196F3;
}

.large {
  padding: 15px 30px;
  font-size: 18px;
}
```

```jsx
// React
import styles from './Button.module.css';
import classNames from 'classnames';  // 或使用 clsx

function Button({ primary, large, children }) {
  return (
    <button className={classNames(styles.button, {
      [styles.primary]: primary,
      [styles.large]: large
    })}>
      {children}
    </button>
  );
}
```

#### 组合选择器
```css
/* Card.module.css */
.card {
  border: 1px solid #ddd;
}

.title {
  font-size: 18px;
}

/* 组合选择器 */
.card .title {
  color: #333;
}

/* 或使用组合类名 */
.cardTitle {
  composes: title from './Typography.module.css';
  font-weight: bold;
}
```

#### 变量和计算
```css
/* variables.module.css */
:root {
  --primary-color: #2196F3;
  --spacing: 8px;
}

/* Button.module.css */
.button {
  background: var(--primary-color);
  padding: calc(var(--spacing) * 2);
}
```

### 10.4 配置说明

#### Webpack 配置
```javascript
// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /\.module\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: '[name]__[local]--[hash:base64:5]',  // 类名生成规则
                exportLocalsConvention: 'camelCase',                // 导出格式
              }
            }
          }
        ]
      }
    ]
  }
};
```

#### Vite 配置
```javascript
// vite.config.js
export default {
  css: {
    modules: {
      localsConvention: 'camelCase',           // 导出格式
      generateScopedName: '[name]__[local]___[hash:base64:5]'  // 类名生成规则
    }
  }
};
```

#### 类名生成规则
- `[name]`：文件名
- `[local]`：原始类名
- `[hash]`：哈希值
- `[hash:base64:5]`：base64 编码的哈希值（5位）

**示例输出**：
```css
/* 原始 */
.button { }

/* 转换后 */
.Button_button__abc123 { }
```

### 10.5 实际应用案例

#### 案例1：React 组件样式
```jsx
// Button.jsx
import React from 'react';
import styles from './Button.module.css';

function Button({ children, type = 'default', onClick }) {
  const buttonClass = `${styles.button} ${styles[type]}`;
  
  return (
    <button className={buttonClass} onClick={onClick}>
      {children}
    </button>
  );
}

export default Button;
```

```css
/* Button.module.css */
.button {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.3s ease;
}

.default {
  background: #f5f5f5;
  color: #333;
}

.primary {
  background: #2196F3;
  color: white;
}

.primary:hover {
  background: #1976D2;
}

.danger {
  background: #f44336;
  color: white;
}

.danger:hover {
  background: #d32f2f;
}
```

#### 案例2：Vue 组件样式
```vue
<!-- Card.vue -->
<template>
  <div :class="styles.card">
    <h3 :class="styles.title">{{ title }}</h3>
    <p :class="styles.content">{{ content }}</p>
    <button :class="styles.button" @click="handleClick">查看</button>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';
import styles from './Card.module.css';

const props = defineProps({
  title: String,
  content: String
});

const emit = defineEmits(['click']);

function handleClick() {
  emit('click');
}
</script>
```

```css
/* Card.module.css */
.card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 20px;
  background: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: box-shadow 0.3s ease;
}

.card:hover {
  box-shadow: 0 4px 8px rgba(0,0,0,0.15);
}

.title {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 10px;
  color: #333;
}

.content {
  color: #666;
  line-height: 1.6;
  margin-bottom: 15px;
}

.button {
  background: #2196F3;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}
```

#### 案例3：组合多个模块
```jsx
// Card.jsx
import React from 'react';
import cardStyles from './Card.module.css';
import buttonStyles from './Button.module.css';

function Card({ title, content }) {
  return (
    <div className={cardStyles.card}>
      <h3 className={cardStyles.title}>{title}</h3>
      <p className={cardStyles.content}>{content}</p>
      <button className={buttonStyles.button}>查看详情</button>
    </div>
  );
}
```

### 10.6 优势与适用场景

#### 优势
1. **样式隔离**：避免全局样式污染
2. **类名唯一**：自动生成唯一类名，避免冲突
3. **类型安全**：TypeScript 支持，提供类型提示
4. **易于维护**：样式与组件紧密关联
5. **Tree Shaking**：未使用的样式会被自动移除

#### 适用场景
- ✅ **组件库开发**：每个组件样式独立
- ✅ **大型项目**：多人协作，避免样式冲突
- ✅ **React/Vue 项目**：与现代框架配合良好
- ✅ **需要类型安全**：TypeScript 项目

#### 不适用场景
- ❌ **全局样式**：需要全局共享的样式
- ❌ **第三方样式**：无法控制的样式文件
- ❌ **简单项目**：小型项目可能过度设计

### 10.7 常见问题

#### 问题1：如何覆盖子组件样式？
```css
/* Parent.module.css */
.parent :global(.child-component) {
  color: red;
}
```

#### 问题2：如何使用全局样式？
```css
/* 方式1：使用 :global() */
:global(.global-class) {
  color: blue;
}

/* 方式2：单独创建全局样式文件 */
/* global.css */
.global-class {
  color: blue;
}
```

#### 问题3：如何动态应用类名？
```jsx
// React
import styles from './Button.module.css';

function Button({ variant }) {
  const className = styles[`button-${variant}`] || styles.button;
  return <button className={className}>点击</button>;
}
```

#### 问题4：TypeScript 类型定义
```typescript
// Button.module.css.d.ts（自动生成或手动创建）
declare const styles: {
  readonly button: string;
  readonly primary: string;
  readonly danger: string;
};

export default styles;
```

### 10.8 与其他方案对比

| 方案 | 作用域 | 构建时处理 | 类型支持 | 学习成本 |
|------|--------|-----------|---------|---------|
| **CSS Modules** | 局部 | 是 | 是 | 低 |
| **Styled Components** | 局部 | 是 | 是 | 中 |
| **CSS-in-JS** | 局部 | 是 | 是 | 中 |
| **Scoped CSS** | 局部 | 是 | 是 | 低 |
| **普通 CSS** | 全局 | 否 | 否 | 低 |

---

## 十一、核心面试题

### 1. link 和 @import 的区别？
- `link`：HTML 标签，同步加载，阻塞渲染
- `@import`：CSS 规则，异步加载，可能导致 FOUC

### 2. 重绘和重排的区别？
- **重绘**：外观改变，不影响布局，性能开销小
- **重排**：布局改变，影响布局，性能开销大
- **关系**：重排必定引发重绘，重绘不一定引发重排

### 3. 如何优化 CSS 性能？
- 使用 `transform` 和 `opacity` 做动画
- 使用 `will-change` 提示浏览器
- 使用 `content-visibility` 跳过不可见内容
- 使用 `contain` 隔离布局
- 避免强制同步布局

### 4. CSS 变量的优势？
- 支持作用域和继承
- 可以通过 JavaScript 动态修改
- 支持 `calc()` 计算
- 实现主题切换更方便

### 5. 如何实现主题切换？
```css
:root {
  --bg-color: #ffffff;
  --text-color: #333333;
}

[data-theme="dark"] {
  --bg-color: #1a1a1a;
  --text-color: #ffffff;
}
```

### 6. 容器查询的作用？
- 基于父容器尺寸而非视口尺寸应用样式
- 实现组件级响应式设计
- 更灵活的适配方案

### 7. `will-change` 的使用注意？
- 仅在需要时使用
- 使用后及时移除
- 避免频繁修改
- 不要过度使用

### 8. CSS Modules 的原理？
- **构建时处理**：在构建阶段将类名转换为唯一的哈希值
- **样式隔离**：每个模块的类名都是唯一的，避免全局污染
- **局部作用域**：默认所有类名都是局部的
- **映射导出**：将类名映射关系导出为 JavaScript 对象

### 9. CSS Modules 与普通 CSS 的区别？
- **作用域**：CSS Modules 是局部作用域，普通 CSS 是全局作用域
- **类名冲突**：CSS Modules 自动避免冲突，普通 CSS 容易冲突
- **类名引用**：CSS Modules 通过 JavaScript 对象引用，普通 CSS 使用字符串
- **构建处理**：CSS Modules 需要构建工具支持，普通 CSS 无需处理

### 10. CSS Modules 的优势？
- **样式隔离**：避免全局样式污染
- **类名唯一**：自动生成唯一类名
- **类型安全**：TypeScript 支持
- **易于维护**：样式与组件紧密关联
- **Tree Shaking**：未使用的样式会被自动移除
