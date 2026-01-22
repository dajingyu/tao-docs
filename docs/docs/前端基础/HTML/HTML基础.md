# HTML 核心知识点

## 一、HTML基础概念
- 超文本标记语言（HyperText Markup Language）
- 最新标准为HTML5（2014年W3C正式发布）

## 二、HTML5核心特性

### 1. 语义化标签详解

#### 1.1 文档结构标签
- **`<header>`**：页面或区块的头部，通常包含标题、logo、导航等
- **`<nav>`**：导航链接区域，用于主要导航菜单
- **`<main>`**：文档主要内容区域，每个页面只应有一个
- **`<article>`**：独立的内容区块，如博客文章、新闻条目
- **`<section>`**：文档的通用区块，用于主题分组
- **`<aside>`**：侧边栏内容，如广告、相关链接
- **`<footer>`**：页面或区块的页脚，通常包含版权、联系方式

#### 1.2 内容语义标签
- **`<figure>`** 和 **`<figcaption>`**：图片、图表等媒体及其说明
- **`<time>`**：时间日期，支持 `datetime` 属性
- **`<mark>`**：高亮文本，用于标记重要内容
- **`<details>`** 和 **`<summary>`**：可折叠的详情区域
- **`<dialog>`**：对话框元素（HTML5.2+）
- **`<template>`**：HTML模板，用于存储可复用的HTML片段

#### 1.3 语义化优势
- **增强文档可读性**：无样式时仍保持清晰结构
- **提升SEO效果**：帮助爬虫理解内容权重和上下文关系
- **改善可访问性**：屏幕阅读器等辅助设备能更准确解析内容
- **便于团队协作**：符合W3C标准，降低代码维护成本
- **响应式设计**：语义化结构更易于适配不同设备

### 2. 多媒体支持

#### 2.1 音频和视频标签
```html
<!-- 音频 -->
<audio controls autoplay loop preload="auto">
  <source src="audio.mp3" type="audio/mpeg">
  <source src="audio.ogg" type="audio/ogg">
  您的浏览器不支持音频播放
</audio>

<!-- 视频 -->
<video controls width="640" height="360" poster="poster.jpg">
  <source src="video.mp4" type="video/mp4">
  <source src="video.webm" type="video/webm">
  您的浏览器不支持视频播放
</video>
```

#### 2.2 媒体属性
- **`controls`**：显示播放控件
- **`autoplay`**：自动播放（注意浏览器策略限制）
- **`loop`**：循环播放
- **`muted`**：静音播放
- **`preload`**：预加载策略（none/metadata/auto）
- **`poster`**：视频封面图（仅video）

#### 2.3 媒体API
- **MediaDevices API**：访问摄像头、麦克风等设备
- **MediaRecorder API**：录制音频和视频
- **Media Source Extensions (MSE)**：流媒体播放
- **Web Audio API**：音频处理和合成

### 3. 表单增强

#### 3.1 新增输入类型
```html
<!-- 日期时间 -->
<input type="date" />
<input type="time" />
<input type="datetime-local" />
<input type="month" />
<input type="week" />

<!-- 其他类型 -->
<input type="email" placeholder="邮箱" />
<input type="url" placeholder="网址" />
<input type="tel" placeholder="电话" />
<input type="search" placeholder="搜索" />
<input type="color" />
<input type="range" min="0" max="100" step="1" />
<input type="number" min="0" max="100" step="1" />
```

#### 3.2 验证属性
- **`required`**：必填字段
- **`pattern`**：正则表达式验证
- **`min/max`**：数值范围限制
- **`minlength/maxlength`**：字符串长度限制
- **`step`**：数值步进
- **`multiple`**：允许多选（文件上传、email等）

#### 3.3 新增表单元素
- **`<datalist>`**：输入建议列表
```html
<input list="browsers" />
<datalist id="browsers">
  <option value="Chrome">
  <option value="Firefox">
  <option value="Safari">
</datalist>
```
- **`<output>`**：计算结果输出
- **`<progress>`**：进度条
- **`<meter>`**：标量值显示（如磁盘使用量）

### 4. 存储方案

#### 4.1 Web Storage
- **localStorage**：持久化存储（5-10MB），除非主动删除否则永久保存
- **sessionStorage**：会话级存储，标签页关闭后清除
- **存储限制**：通常为5-10MB，不同浏览器有差异

#### 4.2 IndexedDB
- 结构化数据存储，支持索引和事务
- 存储容量更大（通常为可用磁盘空间的50%）
- 适合存储大量结构化数据

#### 4.3 Cache API
- Service Worker 的缓存机制
- 支持离线缓存和网络请求拦截
- 更灵活的缓存策略控制

### 5. 图形和动画

#### 5.1 Canvas
- 2D图形绘制API
- 适合游戏、图表、图像处理
- 像素级操作

#### 5.2 SVG
- 矢量图形，基于XML
- 可缩放不失真
- 支持CSS动画和JavaScript交互

#### 5.3 WebGL
- 3D图形渲染
- 基于OpenGL ES
- 适合3D游戏、数据可视化

#### 5.4 Web Animations API
```javascript
element.animate([
  { transform: 'translateX(0px)' },
  { transform: 'translateX(300px)' }
], {
  duration: 2000,
  iterations: Infinity,
  easing: 'ease-in-out'
});
```

### 6. 通信API

#### 6.1 WebSocket
- 全双工通信
- 实时数据传输
- 适合聊天、游戏、实时协作

#### 6.2 Server-Sent Events (SSE)
- 服务器向客户端推送数据
- 单向通信
- 适合实时通知、日志流

#### 6.3 Broadcast Channel API
- 同源页面间通信
- 跨标签页、跨窗口通信
```javascript
const channel = new BroadcastChannel('my-channel');
channel.postMessage('Hello from tab 1');
channel.onmessage = (e) => {
  console.log('Received:', e.data);
};
```

#### 6.4 MessageChannel API
- 双向通信通道
- 用于 Web Workers 和 iframe 通信

### 7. 观察者API（Observer APIs）

#### 7.1 Intersection Observer
- 监听元素进入/离开视口
- 用于懒加载、无限滚动、动画触发
```javascript
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, {
  root: null,
  rootMargin: '0px',
  threshold: 0.1
});
observer.observe(element);
```

#### 7.2 Resize Observer
- 监听元素尺寸变化
- 用于响应式布局、图表重绘
```javascript
const resizeObserver = new ResizeObserver(entries => {
  for (let entry of entries) {
    console.log('Size changed:', entry.contentRect);
  }
});
resizeObserver.observe(element);
```

#### 7.3 Mutation Observer
- 监听DOM变化
- 用于监控DOM结构、属性变化
```javascript
const observer = new MutationObserver(mutations => {
  mutations.forEach(mutation => {
    console.log('DOM changed:', mutation);
  });
});
observer.observe(target, {
  childList: true,
  attributes: true,
  subtree: true
});
```

### 8. Web Components

#### 8.1 Custom Elements
- 自定义HTML元素
- 封装可复用组件
```javascript
class MyButton extends HTMLElement {
  connectedCallback() {
    this.innerHTML = '<button>Click me</button>';
  }
}
customElements.define('my-button', MyButton);
```

#### 8.2 Shadow DOM
- 封装组件内部样式和结构
- 样式隔离
```javascript
const shadow = element.attachShadow({ mode: 'closed' });
shadow.innerHTML = `
  <style>button { color: red; }</style>
  <button>Shadow Button</button>
`;
```
### 9. 性能优化特性

#### 9.1 Resource Hints
```html
<!-- DNS预解析 -->
<link rel="dns-prefetch" href="//example.com">

<!-- 预连接 -->
<link rel="preconnect" href="https://api.example.com">

<!-- 预加载 -->
<link rel="preload" href="font.woff2" as="font" type="font/woff2" crossorigin>

<!-- 预获取 -->
<link rel="prefetch" href="next-page.html">

<!-- 预渲染 -->
<link rel="prerender" href="next-page.html">
```

#### 9.2 延迟加载
```html
<!-- 图片懒加载 -->
<img src="image.jpg" loading="lazy" alt="描述">

<!-- iframe懒加载 -->
<iframe src="video.html" loading="lazy"></iframe>
```

### 10. 安全特性

#### 10.1 Content Security Policy (CSP)
```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; script-src 'self' 'unsafe-inline';">
```

#### 10.2 Subresource Integrity (SRI)
```html
<script src="https://cdn.example.com/library.js"
        integrity="sha384-oqVuAfXRKap7fdgcCY5uykM6+R9GqQ8K/uxy9rx7HNQlGYl1kPzQho1wx4JwY8wC"
        crossorigin="anonymous"></script>
```

#### 10.3 Referrer Policy
```html
<meta name="referrer" content="no-referrer">
```

#### 10.4 Permissions Policy（原Feature Policy）
```html
<iframe src="https://example.com" 
        allow="camera; microphone; geolocation"></iframe>
```

### 11. 其他新特性

#### 11.1 地理定位API
```javascript
navigator.geolocation.getCurrentPosition(
  (position) => {
    console.log('Latitude:', position.coords.latitude);
    console.log('Longitude:', position.coords.longitude);
  },
  (error) => {
    console.error('Error:', error);
  }
);
```

#### 11.2 拖放API
```javascript
element.addEventListener('dragstart', (e) => {
  e.dataTransfer.setData('text/plain', 'data');
});

dropZone.addEventListener('drop', (e) => {
  e.preventDefault();
  const data = e.dataTransfer.getData('text/plain');
});
```

#### 11.3 History API
```javascript
// 添加历史记录
history.pushState({ page: 1 }, 'Title', '/page1');

// 替换当前历史记录
history.replaceState({ page: 2 }, 'Title', '/page2');

// 监听popstate事件
window.addEventListener('popstate', (e) => {
  console.log('State:', e.state);
});
```

#### 11.4 Fullscreen API
```javascript
// 进入全屏
element.requestFullscreen();

// 退出全屏
document.exitFullscreen();

// 监听全屏变化
document.addEventListener('fullscreenchange', () => {
  console.log('Fullscreen changed');
});
```

#### 11.5 Clipboard API
```javascript
// 写入剪贴板
navigator.clipboard.writeText('Text to copy');

// 读取剪贴板
navigator.clipboard.readText().then(text => {
  console.log('Clipboard:', text);
});
```

#### 11.6 File API
```javascript
const input = document.querySelector('input[type="file"]');
input.addEventListener('change', (e) => {
  const file = e.target.files[0];
  const reader = new FileReader();
  reader.onload = (e) => {
    console.log('File content:', e.target.result);
  };
  reader.readAsText(file);
});
```

#### 11.7 Web Share API
```javascript
if (navigator.share) {
  navigator.share({
    title: '分享标题',
    text: '分享内容',
    url: 'https://example.com'
  });
}
```

#### 11.8 Page Visibility API
```javascript
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    console.log('页面隐藏');
  } else {
    console.log('页面可见');
  }
});
```

#### 11.9 Network Information API（实验性）
```javascript
const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
console.log('Network type:', connection.effectiveType);
console.log('Downlink:', connection.downlink);
```

#### 11.10 Battery API（已废弃，但仍有参考价值）
```javascript
navigator.getBattery().then(battery => {
  console.log('Battery level:', battery.level);
  console.log('Charging:', battery.charging);
});
```

## 三、核心面试题

### 1. HTML5新特性有哪些？（完整版）

#### 1.1 语义化标签
- 文档结构：`<header>`, `<nav>`, `<main>`, `<article>`, `<section>`, `<aside>`, `<footer>`
- 内容语义：`<figure>`, `<figcaption>`, `<time>`, `<mark>`, `<details>`, `<summary>`, `<dialog>`, `<template>`

#### 1.2 多媒体支持
- `<audio>` 和 `<video>` 标签
- MediaDevices API（摄像头、麦克风）
- MediaRecorder API（录制）
- Web Audio API（音频处理）

#### 1.3 表单增强
- 新输入类型：date, time, email, url, tel, search, color, range, number
- 验证属性：required, pattern, min, max, minlength, maxlength
- 新元素：datalist, output, progress, meter
- 表单验证API

#### 1.4 存储方案
- localStorage / sessionStorage
- IndexedDB
- Cache API（Service Worker）

#### 1.5 图形和动画
- Canvas 2D API
- SVG
- WebGL（3D图形）
- Web Animations API

#### 1.6 通信API
- WebSocket（全双工）
- Server-Sent Events（SSE）
- Broadcast Channel API
- MessageChannel API

#### 1.7 观察者API
- Intersection Observer（视口观察）
- Resize Observer（尺寸观察）
- Mutation Observer（DOM变化）

#### 1.8 Web Components
- Custom Elements（自定义元素）
- Shadow DOM（样式隔离）

#### 1.9 性能优化
- Resource Hints（preload, prefetch, preconnect, dns-prefetch）
- 图片懒加载（loading="lazy"）

#### 1.10 其他API
- 地理定位API
- 拖放API
- History API（前端路由基础）
- Fullscreen API
- Clipboard API
- File API
- Web Share API
- Page Visibility API

### 2. DOCTYPE声明的作用？
- 声明文档类型
- 触发标准模式（Standards Mode）
- 避免浏览器进入怪异模式（Quirks Mode）

### 3. 语义化标签的优势？
- 提升代码可维护性
- 增强SEO友好性
- 改善可访问性
- 便于设备适配（响应式设计）

### 4. Web Workers的作用？
- 创建后台线程
- 避免JS主线程阻塞
- 适合复杂计算场景
- 通过postMessage通信

## 四、进阶面试题

### 1. 如何实现HTML5离线应用？
- 使用manifest文件声明缓存资源
- 通过Application Cache API管理
- 配合Service Worker实现动态缓存

### 2. 如何优化HTML可访问性？
- 使用ARIA角色属性
- 保证语义化标签结构
- 添加alt文本描述
- 键盘导航支持
- 颜色对比度达标

### 3. HTML5地理定位实现原理？
- 通过Geolocation API获取
- 数据源包括GPS/WiFi/IP定位
- 需要用户授权
- 精度分级处理

### 4. 实现拖放功能的步骤？
1. 设置元素draggable属性
2. 监听dragstart/dragover/drop事件
3. 使用dataTransfer对象传输数据
4. 阻止默认事件行为

### 5. HTML与XHTML的区别？
- **语法严格性**：XHTML要求标签闭合、属性引号
- **MIME类型**：XHTML需用application/xhtml+xml
- **错误处理**：XHTML遇到错误会停止解析
- **兼容性**：HTML5兼容传统写法

### 6. 如何选择合适的存储方案？
| 存储方案       | 容量    | 持久性     | 使用场景                     |
| -------------- | ------- | ---------- | ---------------------------- |
| localStorage   | 5-10MB  | 永久       | 用户偏好设置、缓存数据       |
| sessionStorage | 5-10MB  | 会话       | 临时数据、表单状态           |
| IndexedDB      | 50%磁盘 | 永久       | 大量结构化数据、离线应用     |
| Cache API      | 动态    | 永久       | Service Worker缓存、离线资源 |
| Cookie         | 4KB     | 可设置过期 | 服务器端需要的认证信息       |

### 7. Intersection Observer的使用场景？
- **图片懒加载**：当图片进入视口时加载
- **无限滚动**：检测底部元素，加载更多内容
- **动画触发**：元素进入视口时触发动画
- **广告曝光统计**：统计广告是否被用户看到
- **性能优化**：替代scroll事件，减少性能开销

### 8. Web Components的优势？
- **封装性**：样式和逻辑完全隔离
- **可复用性**：跨框架使用
- **标准化**：W3C标准，浏览器原生支持
- **无依赖**：不需要任何框架或库
- **可维护性**：组件化开发，易于维护

### 9. Resource Hints的作用和区别？

#### preload
- **用途**：预加载当前页面需要的资源
- **时机**：立即加载
- **示例**：关键字体、关键CSS

#### prefetch
- **用途**：预加载下一个页面可能需要的资源
- **时机**：浏览器空闲时
- **示例**：下一页面的资源

#### preconnect
- **用途**：提前建立连接（DNS解析、TCP握手、TLS协商）
- **时机**：立即执行
- **示例**：CDN资源、API服务器

#### dns-prefetch
- **用途**：仅DNS预解析
- **时机**：立即执行
- **示例**：第三方域名

### 10. 如何实现图片懒加载？

#### 方法1：使用loading属性（现代浏览器）
```html
<img src="image.jpg" loading="lazy" alt="描述">
```

#### 方法2：使用Intersection Observer
```javascript
const images = document.querySelectorAll('img[data-src]');
const imageObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target;
      img.src = img.dataset.src;
      img.removeAttribute('data-src');
      imageObserver.unobserve(img);
    }
  });
});
images.forEach(img => imageObserver.observe(img));
```

### 11. 表单验证的最佳实践？
- **使用原生验证**：优先使用HTML5验证属性
- **提供即时反馈**：使用`:invalid`伪类样式
- **自定义错误消息**：使用`setCustomValidity()`
- **服务端验证**：客户端验证不能替代服务端验证
- **无障碍性**：使用`aria-invalid`和`aria-describedby`

### 12. 如何优化HTML性能？
- **减少DOM节点**：简化HTML结构
- **使用语义化标签**：提升解析效率
- **延迟加载**：非关键资源使用懒加载
- **Resource Hints**：合理使用预加载策略
- **压缩HTML**：生产环境压缩空白字符
- **避免内联样式和脚本**：外部文件可缓存
- **使用CDN**：加速资源加载
- **启用Gzip/Brotli压缩**：减少传输大小

### 13. HTML5安全特性有哪些？
- **Content Security Policy (CSP)**：防止XSS攻击
- **Subresource Integrity (SRI)**：确保资源完整性
- **Referrer Policy**：控制referrer信息
- **Permissions Policy**：控制功能权限
- **SameSite Cookie**：防止CSRF攻击
- **Sandbox属性**：iframe沙箱隔离

### 14. 如何实现响应式图片？
- **srcset + sizes**：根据屏幕宽度选择图片
- **picture元素**：更灵活的图片选择
- **WebP格式**：现代浏览器支持，体积更小
- **AVIF格式**：下一代图片格式，压缩率更高

### 15. Web Workers的使用场景和限制？

#### 使用场景
- 复杂计算（图像处理、数据分析）
- 大数据处理
- 后台任务处理
- 避免阻塞UI线程

#### 限制
- 不能访问DOM
- 不能访问window对象
- 通过postMessage通信
- 不能使用某些API（localStorage等）

## 五、现代HTML最佳实践

### 1. 文档结构
```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="页面描述">
  <title>页面标题</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <header>
    <nav><!-- 导航 --></nav>
  </header>
  <main>
    <article>
      <section><!-- 内容 --></section>
    </article>
  </main>
  <footer><!-- 页脚 --></footer>
</body>
</html>
```

### 2. 可访问性
- 使用语义化标签
- 添加alt属性描述图片
- 使用ARIA属性增强语义
- 保证键盘导航
- 保证颜色对比度
- 使用label关联表单元素

### 3. SEO优化
- 使用语义化标签
- 添加meta描述
- 使用合适的标题层级（h1-h6）
- 添加结构化数据（JSON-LD）
- 优化图片alt文本
- 使用规范的URL结构

### 4. 性能优化
- 减少DOM层级
- 使用懒加载
- 合理使用Resource Hints
- 压缩HTML
- 使用CDN
- 启用HTTP/2或HTTP/3

### 5. 代码规范
- 使用小写标签名
- 属性值使用引号
- 自闭合标签正确闭合
- 保持代码缩进一致
- 添加必要的注释
- 使用有意义的类名和ID
     