## 容器属性详解

### 1. 显式网格定义
#### grid-template-columns
```css
/* 定义列的数量和尺寸 */
grid-template-columns: 120px 1fr 2fr;
```
- **作用**：定义显式网格的列轨道数量和尺寸
- **取值**：
  - 长度值：`px`, `rem`, `%` 等
  - 弹性单位：`fr` (剩余空间分配比例)
  - 函数：`minmax(min, max)`, `repeat(n, size)`, `fit-content(max)`
  - 命名线：`[line-name] size`
- **示例场景**：
  - 三列布局：`repeat(3, 1fr)`
  - 侧边栏固定：`300px 1fr`
  - 响应式列：`repeat(auto-fit, minmax(250px, 1fr))`

#### grid-template-rows
```css
/* 定义行的数量和尺寸 */
grid-template-rows: 80px auto 120px;
```
- **作用**：定义显式网格的行轨道高度
- **特殊值**：
  - `auto`：根据内容自动调整
  - `min-content`：最小内容高度
  - `max-content`：最大内容高度
- **最佳实践**：
  - 固定页眉/页脚：`grid-template-rows: 60px 1fr 80px`
  - 等高行：`repeat(3, minmax(100px, auto))`

#### grid-template-areas
```css
/* 通过命名区域定义布局结构 */
grid-template-areas:
  "header header"
  "sidebar main"
  "footer footer";
```
- **命名规则**：
  - 相同名称定义连续区域
  - `.` 表示空单元格
  - 每行用引号包裹
- **使用流程**：
  1. 定义区域名称
  2. 项目使用 `grid-area` 指定区域
  3. 自动生成对应网格线（如 `header-start`）

### 2. 隐式网格控制
#### grid-auto-columns
```css
/* 控制超出显式列定义的列尺寸 */
grid-auto-columns: minmax(100px, 1fr);
```
- **应用场景**：
  - 动态添加项目时自动生成列
  - 未明确列数的自适应布局
- **典型值**：
  - `fit-content(300px)`：限制最大宽度
  - `0.5fr`：按比例分配空间

#### grid-auto-rows
```css
/* 控制超出显式行定义的行尺寸 */
grid-auto-rows: 60px;
```
- **默认值**：`auto`
- **响应式技巧**：
  ```css
  grid-auto-rows: minmax(80px, auto);
  ```

#### grid-auto-flow
```css
/* 控制自动放置算法 */
grid-auto-flow: row dense;
```
- **模式组合**：
  | 值            | 排列方向 | 填充方式 | 适用场景               |
  |---------------|----------|----------|----------------------|
  | `row`         | 水平      | 顺序     | 常规列表             |
  | `column`      | 垂直      | 顺序     | 纵向布局            |
  | `row dense`   | 水平      | 紧凑     | 不规则尺寸项目      |
  | `column dense`| 垂直      | 紧凑     | 纵向紧凑布局        |

### 3. 间距与对齐
#### gap
```css
/* 统一设置行列间距 */
gap: 20px 15px; /* 行间距 列间距 */
```
- **替代属性**：
  - `row-gap`: 单独设置行间距
  - `column-gap`: 单独设置列间距
- **注意事项**：
  - 间距不计算在 `fr` 单位中
  - 百分比值相对于容器尺寸

#### 对齐属性
```css
/* 容器整体对齐 */
justify-content: space-between;
align-content: center;

/* 项目内部对齐 */
justify-items: stretch;
align-items: start;
```
- **值说明**：
  | 值            | 水平对齐       | 垂直对齐       |
  |---------------|---------------|---------------|
  | `start`       | 左对齐         | 顶部对齐       |
  | `end`         | 右对齐         | 底部对齐       |
  | `center`      | 居中           | 居中          |
  | `stretch`     | 拉伸填充(默认) | 拉伸填充(默认) |
  | `space-between` | 两端对齐     | 两端对齐       |

## 项目属性详解

### 1. 定位控制
#### grid-column / grid-row
```css
/* 基于网格线定位 */
.item {
  grid-column: 2 / 4;       /* 从第2列线到第4列线 */
  grid-row: span 2;         /* 跨越两行 */
}
```
- **定位方式**：
  - 数字索引：`1` 起始
  - 命名线：`[sidebar-start]`
  - `span` 关键字：跨越轨道数
  - 负值：从结束边计数（`-1` 表示最后一条线）

#### grid-area
```css
/* 区域定位简写 */
.item {
  grid-area: 1 / 1 / 3 / 3; /* row-start / column-start / row-end / column-end */
}
```
- **多方式定位**：
  - 区域名称：`grid-area: header;`
  - 混合定位：`grid-area: 2 / sidebar / 4 / -1;`

### 2. 层级控制
#### z-index
```css
.item {
  z-index: 5; /* 控制重叠顺序 */
}
```
- **网格上下文特性**：
  - 项目默认按 DOM 顺序层叠
  - 高 `z-index` 值项目显示在上层
  - 不影响网格轨道的尺寸计算

### 3. 个别对齐
#### justify-self / align-self
```css
.item {
  justify-self: end;    /* 水平末端对齐 */
  place-self: center;   /* 简写：align-self justify-self */
}
```
- **覆盖行为**：
  - 优先级高于容器的 `justify-items`/`align-items`
  - 不影响其他项目的对齐方式 

 