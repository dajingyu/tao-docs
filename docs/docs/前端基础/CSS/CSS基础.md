# CSS 基础核心知识

## 一、选择器系统

### 1.1 基础选择器

| 选择器         | 语法      | 示例             | 说明               |
| -------------- | --------- | ---------------- | ------------------ |
| **元素选择器** | `element` | `div { }`        | 选择所有该元素     |
| **类选择器**   | `.class`  | `.container { }` | 选择class属性      |
| **ID选择器**   | `#id`     | `#header { }`    | 选择id属性         |
| **属性选择器** | `[attr]`  | `[type] { }`     | 选择有该属性的元素 |
| **通配符**     | `*`       | `* { }`          | 选择所有元素       |

### 1.2 组合选择器

| 选择器         | 语法    | 示例          | 说明                 |
| -------------- | ------- | ------------- | -------------------- |
| **后代选择器** | `A B`   | `div p { }`   | 选择div内的所有p     |
| **子选择器**   | `A > B` | `div > p { }` | 选择div的直接子元素p |
| **相邻兄弟**   | `A + B` | `h2 + p { }`  | 选择紧跟在h2后面的p  |
| **通用兄弟**   | `A ~ B` | `h2 ~ p { }`  | 选择h2后面的所有p    |
| **并集选择器** | `A, B`  | `div, p { }`  | 选择div或p           |

### 1.3 属性选择器

```css
/* 精确匹配 */
input[type="text"] { }

/* 包含指定值 */
a[href*="example"] { }

/* 以指定值开头 */
a[href^="https"] { }

/* 以指定值结尾 */
a[href$=".pdf"] { }

/* 空格分隔的值 */
div[class~="active"] { }

/* 连字符分隔的值 */
div[lang|="zh"] { }
```

### 1.4 伪类选择器

#### 结构伪类
```css
/* 第一个子元素 */
li:first-child { }

/* 最后一个子元素 */
li:last-child { }

/* 第n个子元素 */
li:nth-child(2) { }
li:nth-child(2n) { }      /* 偶数 */
li:nth-child(2n+1) { }    /* 奇数 */
li:nth-child(-n+3) { }    /* 前3个 */

/* 同类型第n个 */
p:nth-of-type(2) { }

/* 唯一子元素 */
p:only-child { }
```

#### 状态伪类
```css
/* 链接状态 */
a:link { }          /* 未访问 */
a:visited { }       /* 已访问 */
a:hover { }         /* 悬停 */
a:active { }        /* 激活 */

/* 表单状态 */
input:focus { }     /* 获得焦点 */
input:disabled { }  /* 禁用 */
input:checked { }   /* 选中 */
input:required { }  /* 必填 */
input:invalid { }   /* 无效 */
input:placeholder-shown { } /* 显示占位符 */
```

#### 现代伪类
```css
/* :is() - 匹配任意一个 */
:is(h1, h2, h3) { margin-top: 1em; }

/* :where() - 优先级为0 */
:where(.card, .panel) { padding: 1rem; }

/* :has() - 父选择器 */
.card:has(img) { border: 2px solid blue; }

/* :not() - 否定选择器 */
input:not([type="submit"]) { width: 100%; }

/* :focus-visible - 键盘导航焦点 */
button:focus-visible { outline: 2px solid blue; }
```

### 1.5 伪元素

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

/* 选中文本样式 */
::selection {
  background: yellow;
  color: black;
}
```

**注意**：`::before` 和 `::after` 必须设置 `content` 属性才会显示。

---

## 二、盒模型（Box Model）

### 2.1 标准盒模型

```
┌─────────────────────────┐
│      margin (外边距)      │
│  ┌───────────────────┐   │
│  │   border (边框)    │   │
│  │  ┌─────────────┐  │   │
│  │  │ padding(内边距)│  │   │
│  │  │ ┌─────────┐ │  │   │
│  │  │ │ content │ │  │   │
│  │  │ │ (内容)  │ │  │   │
│  │  │ └─────────┘ │  │   │
│  │  └─────────────┘  │   │
│  └───────────────────┘   │
└─────────────────────────┘
```

**元素总宽度** = `width` + `padding-left` + `padding-right` + `border-left` + `border-right` + `margin-left` + `margin-right`

### 2.2 IE盒模型（border-box）

```css
.box {
  box-sizing: border-box;
}
```

**元素总宽度** = `width`（包含 padding 和 border）

### 2.3 盒模型对比

| 属性       | 标准盒模型               | border-box          |
| ---------- | ------------------------ | ------------------- |
| `width`    | 仅内容宽度               | 内容+padding+border |
| 总宽度计算 | width + padding + border | width               |
| 应用场景   | 传统布局                 | 现代布局（推荐）    |

### 2.4 外边距合并（Margin Collapse）

**触发条件**：
- 相邻块级元素的垂直外边距
- 父子元素之间（子元素的 margin-top 与父元素的 margin-top 合并）
- 空元素（只有 margin，没有内容）

**解决方案**：
```css
/* 方案1：使用 padding 代替 */
.container {
  padding-top: 20px;
}

/* 方案2：创建 BFC */
.parent {
  overflow: hidden;        /* 或 display: flow-root */
}

/* 方案3：使用 Flexbox/Grid 的 gap */
.container {
  display: flex;
  flex-direction: column;
  gap: 20px;               /* gap 不会合并 */
}
```

---

## 三、定位（Position）

### 3.1 定位属性值

| 值         | 说明     | 特点                 | 脱离文档流 |
| ---------- | -------- | -------------------- | ---------- |
| `static`   | 默认值   | 正常文档流           | 否         |
| `relative` | 相对定位 | 相对于自身原位置     | 否         |
| `absolute` | 绝对定位 | 相对于最近定位父元素 | 是         |
| `fixed`    | 固定定位 | 相对于视口           | 是         |
| `sticky`   | 粘性定位 | 滚动时"粘住"         | 否         |

### 3.2 定位详解

#### relative（相对定位）
```css
.box {
  position: relative;
  top: 10px;      /* 向下移动10px */
  left: 20px;     /* 向右移动20px */
}
```
- 元素仍在文档流中
- 相对于自身原位置偏移
- 不影响其他元素布局

#### absolute（绝对定位）
```css
.box {
  position: absolute;
  top: 0;
  right: 0;
}
```
- 脱离文档流
- 相对于最近的非 `static` 定位父元素
- 如果没有定位父元素，相对于 `<html>`

#### fixed（固定定位）
```css
.header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 100;
}
```
- 脱离文档流
- 相对于视口定位
- 滚动时位置不变

#### sticky（粘性定位）
```css
.sticky-header {
  position: sticky;
  top: 0;
  z-index: 100;
}
```
- 在正常文档流中表现为 `relative`
- 滚动到指定位置时变为 `fixed`
- 父容器滚动出视口时，元素随之滚动

**应用案例**：固定导航栏
```html
<nav class="sticky-nav">
  <a href="#">首页</a>
  <a href="#">产品</a>
  <a href="#">关于</a>
</nav>
```

```css
.sticky-nav {
  position: sticky;
  top: 0;
  background: white;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  z-index: 100;
}
```

### 3.3 z-index 层级

```css
.box1 { z-index: 1; }
.box2 { z-index: 2; }  /* 显示在上层 */
.box3 { z-index: 10; } /* 显示在最上层 */
```

**注意**：
- 只对定位元素（非 `static`）生效
- 值越大，层级越高
- 同一层叠上下文内比较

---

## 四、显示与可见性

### 4.1 display 属性

| 值             | 说明     | 特点                     |
| -------------- | -------- | ------------------------ |
| `block`        | 块级元素 | 独占一行，可设置宽高     |
| `inline`       | 行内元素 | 不独占一行，不可设置宽高 |
| `inline-block` | 行内块   | 不独占一行，可设置宽高   |
| `none`         | 隐藏     | 不占据空间，不渲染       |
| `flex`         | 弹性布局 | 见 Flexbox 章节          |
| `grid`         | 网格布局 | 见 Grid 章节             |

### 4.2 visibility 属性

```css
.hidden {
  visibility: hidden;  /* 隐藏但占据空间 */
}

.visible {
  visibility: visible; /* 显示（默认） */
}
```

**与 `display: none` 的区别**：
- `display: none`：不占据空间，不渲染
- `visibility: hidden`：占据空间，不显示

### 4.3 opacity 透明度

```css
.transparent {
  opacity: 0.5;        /* 0-1之间，0完全透明，1完全不透明 */
}
```

**特点**：
- 影响元素及其所有子元素
- 元素仍占据空间
- 仍可响应事件（可点击）

---

## 五、字体与文本

### 5.1 字体属性

```css
.text {
  font-family: "Microsoft YaHei", Arial, sans-serif;  /* 字体族 */
  font-size: 16px;                                     /* 字体大小 */
  font-weight: 400;                                    /* 字重：100-900 */
  font-style: normal;                                  /* 样式：normal/italic/oblique */
  font-variant: normal;                                /* 变体 */
  line-height: 1.5;                                    /* 行高 */
}
```

**font-weight 取值**：
- `100-900`：数字值（400=normal，700=bold）
- `normal`：400
- `bold`：700
- `lighter`：比父元素更细
- `bolder`：比父元素更粗

**line-height 取值**：
- 数字：`1.5`（推荐，相对于字体大小）
- 长度：`20px`、`1.5em`
- 百分比：`150%`

### 5.2 文本属性

```css
.text {
  color: #333;                    /* 文字颜色 */
  text-align: left;               /* 对齐：left/center/right/justify */
  text-decoration: none;           /* 装饰：none/underline/line-through */
  text-transform: none;            /* 转换：none/uppercase/lowercase/capitalize */
  text-indent: 2em;               /* 首行缩进 */
  letter-spacing: 1px;            /* 字符间距 */
  word-spacing: 2px;              /* 单词间距 */
  white-space: normal;            /* 空白处理 */
  word-wrap: break-word;          /* 单词换行 */
  text-overflow: ellipsis;        /* 文本溢出：ellipsis/clip */
}
```

### 5.3 文本溢出处理

```css
/* 单行文本溢出 */
.single-line {
  white-space: nowrap;           /* 不换行 */
  overflow: hidden;               /* 隐藏溢出 */
  text-overflow: ellipsis;        /* 显示省略号 */
}

/* 多行文本溢出（-webkit-前缀） */
.multi-line {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;         /* 显示3行 */
  overflow: hidden;
}
```

**案例**：卡片标题截断
```html
<div class="card">
  <h3 class="card-title">这是一个很长的标题文本，超出部分会被截断显示省略号</h3>
  <p class="card-desc">这是描述文本，可以显示多行，超出部分也会被截断</p>
</div>
```

```css
.card-title {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-desc {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}
```

---

## 六、颜色与背景

### 6.1 颜色表示

```css
.element {
  color: #ff0000;                 /* 十六进制 */
  color: rgb(255, 0, 0);          /* RGB */
  color: rgba(255, 0, 0, 0.5);    /* RGBA（带透明度） */
  color: hsl(0, 100%, 50%);      /* HSL */
  color: hsla(0, 100%, 50%, 0.5); /* HSLA */
  color: red;                     /* 颜色名称 */
}
```

### 6.2 背景属性

```css
.box {
  background-color: #fff;         /* 背景颜色 */
  background-image: url('bg.jpg'); /* 背景图片 */
  background-repeat: no-repeat;   /* 重复：repeat/no-repeat/repeat-x/repeat-y */
  background-position: center;    /* 位置：center/top/left/50% 50% */
  background-size: cover;         /* 尺寸：cover/contain/100% 100% */
  background-attachment: fixed;   /* 固定：scroll/fixed */
}
```

**background-size 取值**：
- `cover`：覆盖整个容器，可能裁剪
- `contain`：完整显示，可能留白
- `100% 100%`：指定宽高
- `50px 50px`：固定尺寸

**案例**：全屏背景
```css
.hero {
  background-image: url('hero.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  height: 100vh;
}
```

### 6.3 渐变背景

```css
/* 线性渐变 */
.gradient {
  background: linear-gradient(to right, #ff0000, #0000ff);
  background: linear-gradient(45deg, #ff0000, #0000ff);
  background: linear-gradient(to bottom, #ff0000, #00ff00, #0000ff);
}

/* 径向渐变 */
.radial {
  background: radial-gradient(circle, #ff0000, #0000ff);
  background: radial-gradient(ellipse at center, #ff0000, #0000ff);
}
```

### 6.4 CSS 变量（自定义属性）

**核心理解**：CSS 变量就是写在 CSS 里的“变量”，语法是 `--变量名`，通过 `var(--变量名)` 使用，**有作用域、有继承、可在运行时用 JS 修改**。

#### 6.4.1 定义与使用

```css
/* 全局变量：推荐写在 :root，等价于 html */
:root {
  --primary-color: #409eff;
  --danger-color: #f56c6c;
  --border-radius-base: 4px;
}

button {
  color: #fff;
  background-color: var(--primary-color);     /* 使用变量 */
  border-radius: var(--border-radius-base);
}

.danger-btn {
  background-color: var(--danger-color);
}
```

#### 6.4.2 作用域与覆盖

```css
:root {
  --theme-color: #409eff;
}

.card {
  border: 1px solid var(--theme-color); /* 默认主题色 */
}

/* 局部覆盖变量：只影响 .dark-theme 下的元素 */
.dark-theme {
  --theme-color: #67c23a;   /* 在该作用域内覆盖 :root 的定义 */
}
```

**要点**：
- 写在 `:root` 的变量：全局默认值
- 写在某个选择器上的变量：只在该元素及其子元素生效（会继承）
- 就近原则：离元素最近的同名变量优先级更高

#### 6.4.3 Fallback 默认值

  ```css
.btn {
  /* 当 --btn-color 未定义时，使用第二个参数作为默认值 */
  color: var(--btn-color, #333);
}
```

#### 6.4.4 JS 动态修改主题（常见业务用法）

```html
<button id="switch-theme">切换主题色</button>
```

  ```css
:root {
  --primary-color: #409eff;
}

.btn {
  color: #fff;
  background-color: var(--primary-color);
}
```

```javascript
const button = document.getElementById('switch-theme');

button.addEventListener('click', () => {
  const root = document.documentElement;
  const current = getComputedStyle(root).getPropertyValue('--primary-color').trim();

  // 简单示例：在两种主题色之间切换
  if (current === '#409eff') {
    root.style.setProperty('--primary-color', '#67c23a'); // 绿色
  } else {
    root.style.setProperty('--primary-color', '#409eff'); // 蓝色
  }
});
```

**总结**：
- **语法**：定义 `--name: value;`，使用 `var(--name[, fallback])`
- **优势**：支持运行时修改、继承、受媒体查询/类名控制，适合做**主题切换、按设计规范统一配色与间距**

---

## 七、层叠与优先级

### 7.1 优先级计算

| 选择器类型   | 示例                          | 权重值 |
| ------------ | ----------------------------- | ------ |
| `!important` | `color: red !important;`      | ∞      |
| 内联样式     | `style="color: red;"`         | 1000   |
| ID选择器     | `#header`                     | 100    |
| 类/属性/伪类 | `.active`、`[type]`、`:hover` | 10     |
| 元素/伪元素  | `div`、`::before`             | 1      |

**计算规则**：
- 权重值相加，值越大优先级越高
- 相同权重，后定义的覆盖先定义的
- `!important` 优先级最高

**示例**：
  ```css
/* 权重：100 + 10 = 110 */
#header .active { color: red; }

/* 权重：10 + 1 = 11 */
.container div { color: blue; }

/* 权重：1 + 1 = 2 */
div p { color: green; }
```

### 7.2 继承控制

  ```css
  /* 强制继承 */
.child {
  color: inherit;
}
  
  /* 阻止继承 */
.parent {
  all: unset;        /* 重置所有属性 */
  color: initial;    /* 重置为初始值 */
}
```

**可继承属性**：
- 文本相关：`color`、`font-*`、`text-*`、`line-height`
- 列表相关：`list-style-*`
- 其他：`visibility`、`cursor`

**不可继承属性**：
- 盒模型：`width`、`height`、`margin`、`padding`、`border`
- 定位：`position`、`top`、`left`
- 显示：`display`、`float`

---

## 八、CSS 命名规范（BEM）

### 8.1 BEM 基本概念

**BEM** 是一种 CSS 命名规范，全称是 **Block-Element-Modifier**（块-元素-修饰符）。

**核心思想**：
- **Block（块）**：独立的功能块，可以独立使用，例如 `header`、`card`、`menu`
- **Element（元素）**：块的组成部分，不能独立使用，用**双下划线**连接，例如 `card__title`、`header__logo`
- **Modifier（修饰符）**：块或元素的状态/变体，用**双连字符**连接，例如 `card--large`、`button--disabled`

### 8.2 命名规则

#### Block（块）
```css
/* 块名：独立的功能组件 */
.header { }
.card { }
.menu { }
```

#### Element（元素）
```css
/* 元素名：块名__元素名 */
.card__title { }
.card__content { }
.card__footer { }
.header__logo { }
.header__nav { }
```

#### Modifier（修饰符）
```css
/* 修饰符：块名--修饰符 或 块名__元素名--修饰符 */
.card--large { }              /* 块的修饰符 */
.card--highlighted { }
.button--disabled { }
.card__title--bold { }         /* 元素的修饰符 */
.header__logo--small { }
```

### 8.3 完整示例

```html
<!-- HTML 结构 -->
<article class="card card--large">
  <h2 class="card__title card__title--bold">卡片标题</h2>
  <div class="card__content">卡片内容</div>
  <button class="card__button card__button--primary">确认</button>
</article>
```

```css
/* CSS 样式 */
.card {
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.card--large {
  padding: 30px;  /* 大尺寸卡片 */
}

.card__title {
  font-size: 18px;
  margin-bottom: 10px;
}

.card__title--bold {
  font-weight: bold;  /* 标题加粗变体 */
}

.card__content {
  color: #666;
  line-height: 1.6;
}

.card__button {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.card__button--primary {
  background-color: #007bff;
  color: white;
}
```

### 8.4 BEM 的优势

1. **结构清晰**：从类名就能看出 HTML 结构和层级关系
2. **避免样式冲突**：每个类名都是唯一的，不会与其他组件冲突
3. **可维护性强**：修改某个块时，不会影响其他块
4. **语义明确**：类名自解释，不需要查看 HTML 就能理解结构
5. **便于协作**：团队成员都能快速理解代码结构

### 8.5 注意事项

- **不要嵌套过深**：避免 `block__element__subelement`，如果元素层级深，考虑拆分成新的块
- **修饰符不能单独使用**：`card--large` 必须和 `card` 一起使用
- **保持一致性**：整个项目统一使用 BEM 规范

---

## 九、BFC（块级格式化上下文）

### 9.1 BFC 触发条件

  ```css
/* 触发 BFC 的方式 */
.element {
  overflow: hidden;        /* 或 auto、scroll */
  display: flow-root;       /* 推荐，语义明确 */
  display: inline-block;
  display: table-cell;
  position: absolute;
  position: fixed;
  float: left;              /* 或 right */
}
```

### 9.2 BFC 作用

1. **清除浮动**
```html
<div class="container">
  <div class="float-left">浮动元素</div>
</div>
```

  ```css
.float-left {
  float: left;
}

.container {
  overflow: hidden;        /* 触发 BFC，清除浮动 */
}
```

2. **防止外边距合并**
  ```css
.parent {
  overflow: hidden;          /* 触发 BFC */
  }

.child {
  margin-top: 20px;         /* 不会与父元素合并 */
  }
  ```

3. **隔离布局**
  ```css
.sidebar {
  display: flow-root;       /* 触发 BFC */
  /* 内部布局不影响外部 */
}
```

---

## 十、核心面试题

### 1. 盒模型的两种模式？
- **标准盒模型**：`width` 仅包含内容
- **IE盒模型**：`box-sizing: border-box`，`width` 包含 padding 和 border

### 2. 定位属性的区别？
- `static`：默认，正常文档流
- `relative`：相对定位，相对于自身
- `absolute`：绝对定位，相对于定位父元素
- `fixed`：固定定位，相对于视口
- `sticky`：粘性定位，滚动时"粘住"

### 3. `display: none` 和 `visibility: hidden` 的区别？
- `display: none`：不占据空间，不渲染
- `visibility: hidden`：占据空间，不显示

### 4. CSS 优先级如何计算？
- `!important` > 内联样式 > ID选择器 > 类选择器 > 元素选择器
- 权重值相加，值越大优先级越高

### 5. BFC 的作用？
- 清除浮动
- 防止外边距合并
- 隔离布局

### 6. 如何实现文本溢出显示省略号？
  ```css
.single-line {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
```

### 7. 外边距合并的解决方案？
- 使用 `padding` 代替 `margin`
- 创建 BFC（`overflow: hidden` 或 `display: flow-root`）
- 使用 Flexbox/Grid 的 `gap` 属性
