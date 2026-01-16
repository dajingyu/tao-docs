# CSS 进阶知识

## 一、CSS 加载机制

### 1.1 link 与 @import 的区别

在 HTML 中引入 CSS 有两种主要方式：`<link>` 标签和 `@import` 规则。它们在使用场景和性能表现上有显著差异。

**主要区别：**

| 特性 | `<link>` | `@import` |
|------|----------|-----------|
| **标签类型** | HTML 标签 | CSS 提供的规则 |
| **加载时机** | 页面加载时同步加载 | 页面加载完成后才加载 |
| **阻塞渲染** | 会阻塞渲染 | 不会阻塞渲染（但可能导致 FOUC） |
| **浏览器兼容性** | 所有浏览器支持 | IE5+ 支持 |
| **优先级** | 较高 | 较低 |
| **使用场景** | 推荐用于主要样式表 | 适用于条件加载或模块化 |

**实际应用建议：**

```html
<!-- 推荐：使用 link 引入主要样式 -->
<link rel="stylesheet" href="main.css">

<!-- 不推荐：使用 @import -->
<style>
  @import url('styles.css');
</style>
```

**性能影响：**
- `@import` 会导致额外的 HTTP 请求，增加页面加载时间
- `@import` 可能造成样式闪烁（FOUC - Flash of Unstyled Content）
- 现代构建工具（如 Webpack、Vite）会将 `@import` 在构建时处理，避免运行时问题

---

## 二、浏览器兼容性问题

### 2.1 Chrome 中文界面下 12px 文本限制

**问题描述：**
Chrome 浏览器在中文界面下，默认会将小于 12px 的文本强制按照 12px 显示，这是为了提升中文可读性。

**解决方案：**

```css
/* 方案1：使用 -webkit-text-size-adjust（不推荐，影响可访问性） */
.small-text {
  -webkit-text-size-adjust: none;
  font-size: 10px;
}

/* 方案2：使用 transform: scale()（推荐） */
.small-text {
  font-size: 12px;
  transform: scale(0.83); /* 12px * 0.83 ≈ 10px */
  transform-origin: left top;
}

/* 方案3：使用相对单位（最佳实践） */
.small-text {
  font-size: 0.625rem; /* 10px (假设根字体为16px) */
}
```

**注意事项：**
- `-webkit-text-size-adjust: none` 会禁用用户的可访问性设置，不推荐使用
- 现代浏览器已改进此行为，建议使用相对单位（rem、em）而非固定像素值

### 2.2 超链接伪类顺序问题

**问题描述：**
当超链接被访问后，`:hover` 和 `:active` 样式可能失效，这是因为 CSS 优先级和层叠规则导致的。

**解决方案：遵循 LVHA 顺序**

```css
/* 正确的顺序：Link → Visited → Hover → Active */
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

**记忆技巧：** LoVe HAte（爱恨）- Link, Visited, Hover, Active

**原理说明：**
- 后定义的样式会覆盖先定义的样式
- `:visited` 的优先级与 `:link` 相同，如果放在 `:hover` 后面会覆盖 hover 效果
- 正确的顺序确保每种状态都能正确显示

---

## 三、布局相关问题

### 3.1 外边距合并（Margin Collapse）

**问题描述：**
相邻元素的垂直外边距（`margin-top` 和 `margin-bottom`）会发生合并，取较大值。水平外边距不会合并。

**触发条件：**
- 相邻的块级元素
- 父子元素之间（子元素的 margin-top 会与父元素的 margin-top 合并）
- 空元素（只有 margin，没有内容）

**解决方案：**

```css
/* 方案1：统一使用 margin-top 或 margin-bottom */
.section {
  margin-bottom: 20px; /* 统一使用 */
}

/* 方案2：使用 padding 代替 margin */
.container {
  padding-bottom: 20px; /* padding 不会合并 */
}

/* 方案3：创建 BFC（块级格式化上下文） */
.parent {
  overflow: hidden; /* 或 display: flow-root */
}

/* 方案4：使用 Flexbox 或 Grid */
.container {
  display: flex;
  flex-direction: column;
  gap: 20px; /* gap 不会合并 */
}
```

**最佳实践：**
- 使用 Flexbox 的 `gap` 属性或 Grid 的 `gap` 属性
- 统一使用 `margin-top` 或 `margin-bottom`，避免混用
- 使用 `display: flow-root` 创建 BFC（现代方案）

---

## 四、浏览器渲染机制

### 4.1 重绘（Repaint）与重排（Reflow）

理解浏览器的渲染机制对于性能优化至关重要。重绘和重排是浏览器渲染过程中的两个关键概念。

#### 重绘（Repaint / Redraw）

**定义：**
重绘是指当元素的外观属性发生改变，但不影响布局时，浏览器重新绘制元素的过程。

**触发条件：**
- 改变颜色：`color`、`background-color`
- 改变边框样式：`border-style`、`border-color`
- 改变可见性：`visibility`（注意：`display: none` 会触发重排）
- 改变轮廓：`outline`

**特点：**
- 只影响元素的外观，不改变布局
- 性能开销相对较小
- 不会影响其他元素

#### 重排（Reflow / Layout）

**定义：**
重排是指当元素的布局属性发生改变，导致渲染树需要重新计算布局时，浏览器重新构建布局的过程。

**触发条件：**

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
   // 这些操作会强制浏览器立即计算布局
   element.offsetLeft
   element.offsetTop
   element.offsetWidth
   element.offsetHeight
   element.clientWidth
   element.clientHeight
   element.scrollWidth
   element.scrollHeight
   element.getComputedStyle()
   ```

**重排与重绘的关系：**
- **重排必定会引发重绘**：布局改变后需要重新绘制
- **重绘不一定会引发重排**：只改变外观时不需要重新布局

**性能影响：**
- 重排的性能开销远大于重绘
- 频繁的重排会导致页面卡顿
- 现代浏览器会批量处理重排，但仍需注意优化

### 4.2 性能优化策略

#### 1. 减少重排和重绘

```css
/* 使用 transform 和 opacity（不会触发重排） */
.animate {
  transform: translateX(100px); /* 使用 transform 而非 left */
  opacity: 0.5; /* 使用 opacity 而非 visibility */
}

/* 使用 will-change 提示浏览器 */
.will-animate {
  will-change: transform;
}
```

```javascript
// 批量 DOM 操作
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

#### 4. 使用虚拟滚动

对于长列表，使用虚拟滚动技术只渲染可见区域的内容。

---

## 五、现代 CSS 特性

### 5.1 CSS 变量（自定义属性）高级用法

```css
/* 定义变量 */
:root {
  --primary-color: #2196F3;
  --spacing-unit: 8px;
  --border-radius: 4px;
  
  /* 变量可以引用其他变量 */
  --card-padding: calc(var(--spacing-unit) * 2);
  
  /* 支持媒体查询 */
  --font-size: 16px;
}

@media (max-width: 768px) {
  :root {
    --font-size: 14px;
  }
}

/* 作用域变量 */
.card {
  --card-bg: #ffffff;
  background: var(--card-bg);
}

.card.dark {
  --card-bg: #1a1a1a; /* 覆盖父级变量 */
}

/* 变量默认值 */
.text {
  color: var(--text-color, #333333);
}

/* JavaScript 动态修改 */
/* document.documentElement.style.setProperty('--primary-color', '#ff0000'); */
```

### 5.2 新的视口单位

现代浏览器引入了新的视口单位，更好地处理移动端浏览器 UI 的影响。

```css
/* 传统视口单位 */
.fullscreen {
  width: 100vw;  /* 视口宽度 */
  height: 100vh; /* 视口高度 */
}

/* 动态视口单位（考虑浏览器 UI） */
.modal {
  height: 100dvh; /* 动态视口高度 */
  width: 100dvw;  /* 动态视口宽度 */
}

/* 小视口单位（不考虑浏览器 UI） */
.mobile-header {
  height: 100svh; /* 小视口高度 */
}

/* 大视口单位（不考虑浏览器 UI） */
.desktop-layout {
  height: 100lvh; /* 大视口高度 */
}
```

**单位说明：**
- `vw` / `vh`：传统视口单位，可能包含浏览器 UI
- `dvw` / `dvh`：动态视口单位，自动适应浏览器 UI 变化
- `svw` / `svh`：小视口单位，不考虑浏览器 UI
- `lvw` / `lvh`：大视口单位，不考虑浏览器 UI

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
  margin-block-start: 10px;  /* 块级开始（上/右，取决于方向） */
  margin-inline-end: 20px;    /* 行内结束（右/左） */
  margin-block-end: 10px;     /* 块级结束（下/左） */
  margin-inline-start: 20px;  /* 行内开始（左/右） */
  padding-inline-start: 15px;
  border-inline-end: 1px solid #000;
}

/* 简写形式 */
.box {
  margin-block: 10px;      /* 块级方向（上下） */
  margin-inline: 20px;     /* 行内方向（左右） */
}
```

**应用场景：**
- 多语言网站（支持 RTL 语言）
- 响应式设计
- 国际化应用

---

## 六、性能优化最佳实践

### 6.1 选择器性能

```css
/* ❌ 性能较差：深层嵌套选择器 */
div > div > div > div > .item { }

/* ✅ 性能较好：直接选择器 */
.item { }

/* ✅ 使用属性选择器时指定元素 */
input[type="text"] { }
```

### 6.2 避免昂贵的属性

```css
/* 昂贵的属性（会触发重排） */
.element {
  /* box-shadow: 0 0 10px rgba(0,0,0,0.5); */
  /* filter: blur(5px); */
  /* border-radius: 50%; */
}

/* 使用 transform 和 opacity（GPU 加速） */
.animate {
  transform: translateX(100px);
  opacity: 0.5;
}
```

### 6.3 使用 contain 属性

```css
.widget {
  /* 布局隔离 */
  contain: layout;
  /* 样式隔离 */
  contain: style;
  /* 绘制隔离 */
  contain: paint;
  /* 组合使用 */
  contain: layout style paint;
}
```

---

## 总结

理解 CSS 的加载机制、浏览器兼容性问题、布局特性和渲染机制，能够帮助我们编写更高效、更兼容的样式代码。现代 CSS 特性如变量、逻辑属性等，为开发提供了更多可能性。在实际开发中，应该：

1. **优先使用现代布局方案**（Flexbox、Grid）
2. **注意性能优化**（减少重排重绘）
3. **合理使用 CSS 变量**（主题系统、动态样式）
4. **考虑浏览器兼容性**（使用工具如 Autoprefixer）
5. **遵循最佳实践**（选择器性能、属性选择）
