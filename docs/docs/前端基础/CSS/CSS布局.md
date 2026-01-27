# CSS 布局系统（Flexbox + Grid）

## 一、布局方案选择

### Flexbox vs Grid 对比

| 特性           | Flexbox        | Grid            |
| -------------- | -------------- | --------------- |
| **维度**       | 一维（行或列） | 二维（行和列）  |
| **适用场景**   | 组件内部排列   | 页面整体布局    |
| **控制方式**   | 基于轴线       | 基于网格线/区域 |
| **对齐能力**   | 单方向对齐     | 双向对齐        |
| **浏览器支持** | IE10+          | IE10+（旧语法） |

### 选择建议

- **使用 Flexbox**：导航栏、工具栏、表单行、组件内部布局
- **使用 Grid**：页面整体布局、卡片网格、复杂二维布局
- **组合使用**：Grid 作为外层布局，Flexbox 处理内部元素排列

---

## 二、Flexbox 弹性布局

### 2.1 基本概念

#### 主轴与交叉轴
- **主轴（Main Axis）**：Flex 项目沿此轴排列，默认水平方向（从左到右）
- **交叉轴（Cross Axis）**：垂直于主轴的轴，默认垂直方向（从上到下）

**注意**：主轴和交叉轴的方向可以通过 `flex-direction` 改变。

### 2.2 容器属性

#### 2.2.1 方向控制

**`flex-direction`**：定义主轴方向
- `row`（默认）：水平方向，从左到右
- `row-reverse`：水平方向，从右到左
- `column`：垂直方向，从上到下
- `column-reverse`：垂直方向，从下到上

**`flex-wrap`**：定义是否换行
- `nowrap`（默认）：不换行，项目可能溢出
- `wrap`：换行，项目自动换到下一行
- `wrap-reverse`：换行，但行顺序反转

**`flex-flow`**：简写形式
```css
flex-flow: row wrap; /* 等同于 flex-direction: row; flex-wrap: wrap; */
```

#### 2.2.2 对齐方式

**`justify-content`**：主轴对齐（水平方向）
- `flex-start`（默认）：从起点对齐
- `flex-end`：从终点对齐
- `center`：居中对齐
- `space-between`：两端对齐，项目之间间距相等
- `space-around`：项目周围间距相等
- `space-evenly`：项目之间和两端间距都相等

**`align-items`**：交叉轴对齐（垂直方向）
- `stretch`（默认）：拉伸填充交叉轴
- `flex-start`：从起点对齐
- `flex-end`：从终点对齐
- `center`：居中对齐
- `baseline`：基线对齐

**`align-content`**：多行对齐（仅在 `flex-wrap: wrap` 时生效）
- 取值与 `justify-content` 相同

#### 2.2.3 间距控制（gap）

**`gap`**：设置项目间距
```css
.container {
  display: flex;
  gap: 20px;              /* 统一设置行列间距 */
  gap: 20px 15px;         /* 行间距 列间距 */
  row-gap: 20px;          /* 单独设置行间距 */
  column-gap: 15px;       /* 单独设置列间距 */
}
```

**浏览器兼容性**：Chrome 84+、Firefox 63+、Safari 14.1+、Edge 84+

**降级方案**：
```css
.container > * + * {
  margin-left: 20px; /* 为除第一个外的所有项目添加左边距 */
}
```

### 2.3 项目属性

#### 2.3.1 顺序控制

**`order`**：定义排列顺序
- 数值越小，排列越靠前
- 默认值为 `0`
- 可以为负数

```css
.item-1 { order: 3; }  /* 排到最后 */
.item-2 { order: 1; }  /* 排到最前 */
.item-3 { order: 2; }  /* 中间 */
```

#### 2.3.2 伸缩控制

**`flex-grow`**：放大比例
- 默认值：`0`（不放大）
- 数值表示放大比例

**`flex-shrink`**：缩小比例
- 默认值：`1`（会缩小）
- `0` 表示不缩小

**`flex-basis`**：初始尺寸
- 默认值：`auto`（项目本来大小）
- 可设置为固定值（如 `200px`）或百分比

**`flex`**：简写属性
```css
flex: 1;        /* 等同于 1 1 0% */
flex: auto;     /* 等同于 1 1 auto */
flex: none;     /* 等同于 0 0 auto */
flex: 1 1 200px; /* flex-grow flex-shrink flex-basis */
```

#### 2.3.3 对齐控制

**`align-self`**：单个项目对齐
- 可覆盖容器的 `align-items` 属性
- 取值与 `align-items` 相同

### 2.4 典型应用案例

#### 案例1：导航栏布局
```html
<nav class="nav">
  <div class="logo">Logo</div>
  <ul class="menu">
    <li>首页</li>
    <li>产品</li>
    <li>关于</li>
  </ul>
  <div class="user">用户</div>
</nav>
```

```css
.nav {
  display: flex;
  justify-content: space-between; /* 两端对齐 */
  align-items: center;            /* 垂直居中 */
  padding: 1rem;
  background: #f8f9fa;
}

.menu {
  display: flex;
  gap: 2rem;                      /* 菜单项间距 */
  list-style: none;
}
```

#### 案例2：表单元素布局
```html
<div class="form-group">
  <label>用户名：</label>
  <input type="text">
  <button>提交</button>
</div>
```

```css
.form-group {
  display: flex;
  gap: 1rem;
  align-items: center;
}

label {
  flex: 0 0 80px;  /* 固定标签宽度 */
}

input {
  flex: 1;         /* 输入框自适应 */
  padding: 0.5rem;
}
```

#### 案例3：卡片等高等宽
```html
<div class="card-container">
  <div class="card">
    <h3>标题</h3>
    <p>内容...</p>
    <button>按钮</button>
  </div>
  <div class="card">
    <h3>标题</h3>
    <p>内容...</p>
    <button>按钮</button>
  </div>
</div>
```

```css
.card-container {
  display: flex;
  gap: 2rem;
}

.card {
  flex: 1;                      /* 等宽 */
  display: flex;
  flex-direction: column;        /* 内部垂直排列 */
}

.card-content {
  flex: 1;                       /* 内容区域等高 */
}

.card-button {
  margin-top: auto;              /* 按钮自动顶到底部 */
}
```

#### 案例4：移动端底部工具栏
```css
.bottom-bar {
  display: flex;
  position: fixed;
  bottom: 0;
  width: 100%;
  background: white;
}

.bottom-bar button {
  flex: 1;                       /* 平均分配宽度 */
  padding: 1rem;
  border: none;
}
```

### 2.5 常见问题解决

#### 问题1：内容溢出
```css
.item {
  min-width: 0;                 /* 允许内容收缩 */
}

.text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
```

#### 问题2：底部对齐
```css
.card {
  display: flex;
  flex-direction: column;
}

.card-footer {
  margin-top: auto;              /* 自动顶到底部 */
}
```

---

## 三、Grid 网格布局

### 3.1 基本概念

#### 容器和项目
- **容器（Container）**：采用网格布局的区域
- **项目（Item）**：容器内部采用网格定位的子元素

#### 行和列
- **行（Row）**：容器里面的水平区域
- **列（Column）**：容器里面的垂直区域
- **单元格（Cell）**：行和列的交叉区域
- **网格线（Grid Line）**：划分网格的线

### 3.2 容器属性

#### 3.2.1 显式网格定义

**`grid-template-columns`**：定义列
```css
.container {
  display: grid;
  grid-template-columns: 100px 100px 100px;        /* 三列，每列100px */
  grid-template-columns: 1fr 1fr 1fr;              /* 三列等宽 */
  grid-template-columns: repeat(3, 1fr);           /* 重复3次 */
  grid-template-columns: 200px 1fr 2fr;            /* 第一列200px，后两列1:2 */
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); /* 响应式 */
}
```

**取值说明**：
- 长度值：`px`、`rem`、`%` 等
- `fr`：剩余空间分配比例
- `auto`：根据内容自动调整
- `minmax(min, max)`：长度范围
- `repeat(n, size)`：重复模式
- `auto-fit` / `auto-fill`：自动填充

**`grid-template-rows`**：定义行
```css
.container {
  grid-template-rows: 80px auto 120px;             /* 三行 */
  grid-template-rows: repeat(3, minmax(100px, auto)); /* 最小100px，自动增长 */
}
```

**`grid-template-areas`**：命名区域
```css
.container {
  display: grid;
  grid-template-columns: 200px 1fr;
  grid-template-rows: 80px 1fr 60px;
  grid-template-areas:
    "header header"
    "sidebar main"
    "footer footer";
}

.header { grid-area: header; }
.sidebar { grid-area: sidebar; }
.main { grid-area: main; }
.footer { grid-area: footer; }
```

#### 3.2.2 隐式网格控制

**`grid-auto-columns`**：自动生成列的尺寸
```css
grid-auto-columns: minmax(100px, 1fr);
```

**`grid-auto-rows`**：自动生成行的尺寸
```css
grid-auto-rows: minmax(80px, auto);
```

**`grid-auto-flow`**：自动放置算法
- `row`（默认）：先行后列
- `column`：先列后行
- `row dense`：先行后列，紧凑填充
- `column dense`：先列后行，紧凑填充

#### 3.2.3 间距与对齐

**`gap`**：网格间距
```css
gap: 20px;              /* 统一设置 */
gap: 20px 15px;         /* 行间距 列间距 */
row-gap: 20px;          /* 单独设置行间距 */
column-gap: 15px;       /* 单独设置列间距 */
```

**对齐属性**：

| 属性              | 作用             | 取值                                                                                |
| ----------------- | ---------------- | ----------------------------------------------------------------------------------- |
| `justify-items`   | 项目水平对齐     | `start` \| `end` \| `center` \| `stretch`                                           |
| `align-items`     | 项目垂直对齐     | `start` \| `end` \| `center` \| `stretch`                                           |
| `place-items`     | 简写             | `align-items justify-items`                                                         |
| `justify-content` | 内容区域水平对齐 | `start` \| `end` \| `center` \| `space-between` \| `space-around` \| `space-evenly` |
| `align-content`   | 内容区域垂直对齐 | 同上                                                                                |
| `place-content`   | 简写             | `align-content justify-content`                                                     |

### 3.3 项目属性

#### 3.3.1 定位控制

**`grid-column`** / **`grid-row`**：基于网格线定位
```css
.item {
  grid-column: 1 / 3;           /* 从第1列线到第3列线 */
  grid-row: 2 / 4;              /* 从第2行线到第4行线 */
  grid-column: span 2;          /* 跨越2列 */
  grid-row: 1 / -1;             /* 从第1行到最后一行 */
}
```

**`grid-area`**：区域定位
```css
.item {
  grid-area: header;                    /* 使用命名区域 */
  grid-area: 1 / 1 / 3 / 3;            /* row-start / column-start / row-end / column-end */
}
```

#### 3.3.2 对齐控制

**`justify-self`** / **`align-self`**：单个项目对齐
```css
.item {
  justify-self: center;         /* 水平居中 */
  align-self: end;              /* 垂直底部对齐 */
  place-self: center;           /* 简写：水平和垂直居中 */
}
```

### 3.4 典型应用案例

#### 案例1：响应式卡片网格
```html
<div class="gallery">
  <div class="card">...</div>
  <div class="card">...</div>
  <div class="card">...</div>
</div>
```

```css
.gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  grid-auto-rows: minmax(200px, auto);
  gap: 1rem;
}

.card:first-child {
  grid-column: 1 / -1;          /* 首张卡片跨列显示 */
}
```

#### 案例2：杂志式布局
```html
<div class="layout">
  <header class="header">头部</header>
  <aside class="sidebar">侧边栏</aside>
  <main class="main">主内容</main>
  <footer class="footer">页脚</footer>
</div>
```

```css
.layout {
  display: grid;
  grid-template-columns: 240px 1fr;
  grid-template-rows: 80px 1fr 60px;
  grid-template-areas:
    "header header"
    "sidebar main"
    "footer footer";
  gap: 20px;
  min-height: 100vh;
}

.header { grid-area: header; }
.sidebar { grid-area: sidebar; }
.main { grid-area: main; }
.footer { grid-area: footer; }
```

#### 案例3：12列网格系统
```css
.twelve-column {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 20px;
}

.col-1 { grid-column: span 1; }
.col-2 { grid-column: span 2; }
.col-3 { grid-column: span 3; }
.col-4 { grid-column: span 4; }
.col-6 { grid-column: span 6; }
.col-12 { grid-column: span 12; }
```

#### 案例4：移动端适配
```css
.responsive-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

/* 移动端单列 */
@media (max-width: 768px) {
  .responsive-grid {
    grid-template-columns: 1fr;
  }
}
```

### 3.5 现代特性

#### 子网格（Subgrid）
```css
.parent-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.child-item {
  display: grid;
  grid-template-columns: subgrid;  /* 继承父网格列定义 */
  grid-column: span 2;
}
```

**浏览器支持**：Firefox 71+、Safari 16+（实验性）

#### 瀑布流布局（Masonry）
```css
.container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: masonry;     /* 瀑布流布局 */
  gap: 20px;
}
```

**注意**：目前只有 Firefox 支持（实验性），不建议生产使用。

---

## 四、布局方案对比总结

### 4.1 选择指南

| 场景           | 推荐方案 | 理由                  |
| -------------- | -------- | --------------------- |
| 导航栏、工具栏 | Flexbox  | 一维排列，API简单     |
| 表单行布局     | Flexbox  | 灵活对齐，自适应      |
| 页面整体布局   | Grid     | 二维控制，精确布局    |
| 卡片网格       | Grid     | 响应式友好            |
| 组件内部       | Flexbox  | 内容驱动              |
| 复杂嵌套       | 组合使用 | Grid外层，Flexbox内层 |

### 4.2 浏览器兼容性

**Flexbox**：
- Chrome 21+、Firefox 18+、Safari 6.1+、Edge 12+、IE 10+

**Grid**：
- Chrome 57+、Firefox 52+、Safari 10.1+、Edge 16+、IE 10-11（旧语法）

**最佳实践**：
1. 使用 Autoprefixer 自动添加前缀
2. 使用 `@supports` 进行特性检测
3. 提供降级方案

```css
@supports (display: grid) {
  .container {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
  }
}

@supports not (display: grid) {
  .container {
    display: flex;
    flex-wrap: wrap;
  }
}
```

---

## 五、核心面试题

### 1. Flexbox 和 Grid 的区别？
- **维度**：Flexbox 一维，Grid 二维
- **适用场景**：Flexbox 组件内部，Grid 页面整体
- **控制方式**：Flexbox 基于轴线，Grid 基于网格线

### 2. `flex: 1` 的含义？
等同于 `flex: 1 1 0%`，表示：
- `flex-grow: 1`：可以放大
- `flex-shrink: 1`：可以缩小
- `flex-basis: 0%`：初始尺寸为0，按比例分配空间

### 3. Grid 的 `fr` 单位是什么？
- **含义**：剩余空间分配比例
- **计算**：`1fr` 表示剩余空间的 1 份
- **示例**：`1fr 2fr` 表示 1:2 的比例分配

### 4. 如何实现响应式网格？
```css
grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
```
- `auto-fit`：自动调整列数
- `minmax(250px, 1fr)`：最小250px，最大1fr

### 5. 如何实现垂直居中？
```css
/* Flexbox */
.center {
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Grid */
.center {
  display: grid;
  place-items: center;
}
```
