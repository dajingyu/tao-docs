<!--
 * @Date: 2025-03-03 19:38:41
 * @LastEditors: 我家有条大鲸鱼
 * @LastEditTime: 2025-03-09 19:53:27
 * @Description: 文件信息
-->
## 练习1：基础网格布局（电商商品列表）
- 目标：实现响应式商品卡片布局


要求：
- 桌面端：4列等宽，行高固定200px
- 平板端：3列等宽（768px以下）
- 手机端：2列等宽（480px以下）
- 使用属性：grid-template-columns、grid-template-rows、gap、@media
```html
<div class="product-grid">
  <div class="product-card">商品1</div>
  <div class="product-card">商品2</div>
  <!-- 共12个商品 -->
</div>
```
实现方式：
```css
.product-grid {
    display: grid;
    gap: 20px;
    padding: 20px;
    margin: 0 auto;
    max-width: 1200px;
    
    /* 响应式自动调整 */
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
}

/* 添加商品图片自适应 */
.product-card img {
    width: 100%;
    height: 200px;
    object-fit: cover;
    border-radius: 8px;
}

/* 优化响应式断点 */
@media (max-width: 768px) {
    .product-grid {
        grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    }
}
```
##  练习2：不规则导航栏
- 目标：实现混合布局的导航栏
- 要求：
- LOGO固定宽度200px
- 菜单项自动填充剩余空间
- 搜索框固定宽度300px
- 使用属性：grid-template-columns、fr单位、justify-content

```html
<nav class="nav-grid">
  <div class="logo">LOGO</div>
  <ul class="menu">
    <li>首页</li>
    <li>产品</li>
    <li>关于</li>
    <li>联系</li>
  </ul>
  <div class="search">
    <input type="text" placeholder="搜索...">
  </div>
</nav>
```
```css
<nav class="nav-grid">
  <div class="logo">LOGO</div>
  <ul class="menu">
    <li>首页</li>
    <li>产品</li>
    <li>关于</li>
    <li>联系</li>
  </ul>
  <div class="search">
    <input type="text" placeholder="搜索...">
  </div>
</nav>

<style>
.nav-grid {
  display: grid;
  grid-template-columns: 200px 1fr 300px; /* 三列布局 */
  align-items: center;
  gap: 20px;
  padding: 15px 30px;
  background: #fff;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.menu {
  display: grid;
  grid-auto-flow: column; /* 水平排列 */
  justify-content: start;
  gap: 30px;
  list-style: none;
  padding: 0;
  margin: 0;
}

.search input {
  width: 100%;
  padding: 8px 15px;
  border: 1px solid #ddd;
  border-radius: 20px;
}

/* 响应式处理 */
@media (max-width: 768px) {
  .nav-grid {
    grid-template-columns: 100px 1fr; /* 两列布局 */
    grid-template-areas: 
      "logo search"
      "menu menu";
  }

  .logo { grid-area: logo; }
  .menu { grid-area: menu; }
  .search { grid-area: search; }

  .menu {
    grid-auto-flow: row;
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
    text-align: center;
    margin-top: 15px;
  }
}

/* 交互动画 */
.menu li {
  transition: transform 0.3s;
  cursor: pointer;
}

.menu li:hover {
  transform: translateY(-2px);
  color: #007bff;
}

/* 搜索框聚焦效果 */
.search input:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0,123,255,0.25);
}
</style>
```