# Canvas 核心技术（应试精炼版）

## 一、核心概念

### Canvas 是什么？
Canvas 是 HTML5 提供的**画布元素**，通过 JavaScript API 进行**像素级绘制**，可以绘制图形、图像、动画等。

### 核心特点
- **位图渲染**：绘制的是像素点，放大后会模糊
- **高性能**：适合高频重绘场景（游戏、动画）
- **像素级控制**：可以操作每个像素点
- **单元素**：整个 Canvas 是一个 DOM 元素

### Canvas vs SVG 对比
| 特性         | Canvas               | SVG                    |
| ------------ | -------------------- | ---------------------- |
| **渲染方式** | 位图（像素）         | 矢量图（数学公式）     |
| **缩放效果** | 放大后模糊           | 无损缩放               |
| **DOM结构**  | 单元素               | 多节点（可操作）       |
| **事件处理** | 需手动计算坐标       | 原生支持事件           |
| **性能**     | 适合高频重绘         | 适合静态图形           |
| **适用场景** | 游戏、动画、图像处理 | 图标、图表、可交互图形 |

## 二、基本使用

### 1. 获取 Canvas 上下文
```javascript
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d'); // 2D 上下文

// 设置画布尺寸（必须在获取上下文后设置）
canvas.width = 800;
canvas.height = 600;
```

### 2. 绘制矩形
```javascript
// 填充矩形
ctx.fillStyle = 'red'; // 设置填充颜色
ctx.fillRect(10, 10, 100, 50); // (x, y, width, height)

// 描边矩形
ctx.strokeStyle = 'blue'; // 设置描边颜色
ctx.lineWidth = 2; // 设置线宽
ctx.strokeRect(10, 70, 100, 50);

// 清除矩形区域
ctx.clearRect(20, 20, 80, 30); // 清除指定区域
```

### 3. 绘制圆形和弧形
```javascript
ctx.beginPath(); // 开始新路径
ctx.arc(100, 100, 50, 0, Math.PI * 2); // (x, y, radius, startAngle, endAngle)
ctx.fill(); // 填充

// 半圆
ctx.beginPath();
ctx.arc(200, 100, 50, 0, Math.PI); // 0 到 π 是半圆
ctx.stroke(); // 描边

// 扇形（需要先移动到圆心）
ctx.beginPath();
ctx.moveTo(300, 100); // 移动到圆心
ctx.arc(300, 100, 50, 0, Math.PI / 2); // 0 到 π/2 是 90 度
ctx.closePath(); // 闭合路径（回到起点）
ctx.fill();
```

### 4. 绘制路径（直线、曲线）
```javascript
// 直线路径
ctx.beginPath();
ctx.moveTo(10, 10); // 移动到起点
ctx.lineTo(100, 10); // 画线到 (100, 10)
ctx.lineTo(100, 100); // 继续画线
ctx.lineTo(10, 100);
ctx.closePath(); // 闭合路径
ctx.stroke(); // 描边

// 二次贝塞尔曲线
ctx.beginPath();
ctx.moveTo(10, 200);
ctx.quadraticCurveTo(100, 100, 200, 200); // (cpX, cpY, x, y)
ctx.stroke();

// 三次贝塞尔曲线
ctx.beginPath();
ctx.moveTo(10, 300);
ctx.bezierCurveTo(50, 200, 150, 400, 200, 300); // (cp1X, cp1Y, cp2X, cp2Y, x, y)
ctx.stroke();
```

### 5. 绘制文本
```javascript
// 设置文本样式
ctx.font = '30px Arial'; // 字体大小和字体
ctx.fillStyle = 'black';
ctx.textAlign = 'center'; // left | center | right | start | end
ctx.textBaseline = 'middle'; // top | middle | bottom | alphabetic | hanging

// 填充文本
ctx.fillText('Hello Canvas', 200, 100);

// 描边文本
ctx.strokeText('Hello Canvas', 200, 150);
```

## 三、样式设置 API

### 填充和描边
```javascript
// 填充颜色
ctx.fillStyle = 'red'; // 颜色字符串
ctx.fillStyle = '#ff0000'; // 十六进制
ctx.fillStyle = 'rgba(255, 0, 0, 0.5)'; // 带透明度
ctx.fillStyle = gradient; // 渐变对象
ctx.fillStyle = pattern; // 图案对象

// 描边颜色
ctx.strokeStyle = 'blue';
ctx.lineWidth = 5; // 线宽（像素）
ctx.lineCap = 'round'; // 线帽：butt | round | square
ctx.lineJoin = 'round'; // 线连接：miter | round | bevel
ctx.miterLimit = 10; // 斜接限制
```

### 渐变
```javascript
// 线性渐变
const linearGradient = ctx.createLinearGradient(0, 0, 200, 0);
linearGradient.addColorStop(0, 'red'); // 0 位置是红色
linearGradient.addColorStop(0.5, 'yellow'); // 0.5 位置是黄色
linearGradient.addColorStop(1, 'green'); // 1 位置是绿色
ctx.fillStyle = linearGradient;
ctx.fillRect(0, 0, 200, 100);

// 径向渐变
const radialGradient = ctx.createRadialGradient(100, 100, 0, 100, 100, 50);
radialGradient.addColorStop(0, 'white');
radialGradient.addColorStop(1, 'black');
ctx.fillStyle = radialGradient;
ctx.fillRect(50, 50, 100, 100);
```

### 图案
```javascript
const img = new Image();
img.onload = () => {
  const pattern = ctx.createPattern(img, 'repeat'); // repeat | repeat-x | repeat-y | no-repeat
  ctx.fillStyle = pattern;
  ctx.fillRect(0, 0, 400, 400);
};
img.src = 'pattern.png';
```

### 阴影
```javascript
ctx.shadowColor = 'rgba(0, 0, 0, 0.5)'; // 阴影颜色
ctx.shadowBlur = 10; // 模糊程度
ctx.shadowOffsetX = 5; // X 偏移
ctx.shadowOffsetY = 5; // Y 偏移
ctx.fillRect(10, 10, 100, 100);
```

### 透明度
```javascript
ctx.globalAlpha = 0.5; // 全局透明度（0-1）
ctx.fillRect(10, 10, 100, 100);
```

## 四、变换操作 API

### 平移、旋转、缩放
```javascript
// 保存当前状态
ctx.save();

// 平移（移动坐标系原点）
ctx.translate(100, 100); // 将原点移动到 (100, 100)

// 旋转（围绕原点旋转）
ctx.rotate(Math.PI / 4); // 旋转 45 度（弧度制）

// 缩放
ctx.scale(2, 2); // X 和 Y 方向各放大 2 倍

// 绘制（变换后的坐标系）
ctx.fillRect(0, 0, 50, 50); // 实际绘制在 (100, 100)，放大 2 倍

// 恢复状态
ctx.restore();
```

### 变换矩阵
```javascript
// 使用变换矩阵（更灵活）
// transform(a, b, c, d, e, f)
// a: 水平缩放, b: 水平倾斜
// c: 垂直倾斜, d: 垂直缩放
// e: 水平移动, f: 垂直移动
ctx.transform(1, 0, 0, 1, 100, 100); // 等同于 translate(100, 100)

// 重置变换矩阵
ctx.setTransform(1, 0, 0, 1, 0, 0);
```

### 围绕中心点旋转/缩放
```javascript
function drawRotatedRect(x, y, width, height, angle) {
  ctx.save();
  
  // 1. 移动到中心点
  ctx.translate(x + width / 2, y + height / 2);
  
  // 2. 旋转
  ctx.rotate(angle);
  
  // 3. 移回（负方向）
  ctx.translate(-width / 2, -height / 2);
  
  // 4. 绘制
  ctx.fillRect(0, 0, width, height);
  
  ctx.restore();
}

drawRotatedRect(100, 100, 100, 50, Math.PI / 4);
```

## 五、图像处理 API

### 绘制图像
```javascript
const img = new Image();
img.onload = () => {
  // 基础绘制：在 (dx, dy) 位置绘制完整图像
  ctx.drawImage(img, 50, 50);
  
  // 缩放绘制：在 (dx, dy) 位置绘制，缩放到 (dw, dh)
  ctx.drawImage(img, 50, 50, 200, 200);
  
  // 裁剪绘制：从图像的 (sx, sy) 位置裁剪 (sw, sh) 大小，绘制到 (dx, dy) 位置，缩放到 (dw, dh)
  ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh);
};
img.src = 'image.png';
```

### 像素操作（图像处理核心）
```javascript
// 获取像素数据
const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
// imageData.data 是 Uint8ClampedArray，每 4 个元素代表一个像素的 RGBA

// 操作像素（例如：反色滤镜）
for (let i = 0; i < imageData.data.length; i += 4) {
  imageData.data[i] = 255 - imageData.data[i]; // R
  imageData.data[i + 1] = 255 - imageData.data[i + 1]; // G
  imageData.data[i + 2] = 255 - imageData.data[i + 2]; // B
  // imageData.data[i + 3] 是 Alpha，保持不变
}

// 将像素数据绘制回画布
ctx.putImageData(imageData, 0, 0);
```

### 图像滤镜示例
```javascript
// 灰度滤镜
function grayscale(imageData) {
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    const gray = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
    data[i] = gray; // R
    data[i + 1] = gray; // G
    data[i + 2] = gray; // B
  }
  return imageData;
}

// 亮度调整
function adjustBrightness(imageData, factor) {
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    data[i] = Math.min(255, data[i] * factor); // R
    data[i + 1] = Math.min(255, data[i + 1] * factor); // G
    data[i + 2] = Math.min(255, data[i + 2] * factor); // B
  }
  return imageData;
}
```

## 六、动画实现

### 基本动画循环
```javascript
let x = 0;
let y = 0;
let vx = 2; // 速度
let vy = 2;

function animate() {
  // 1. 清除画布
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // 2. 更新状态
  x += vx;
  y += vy;
  
  // 边界检测
  if (x > canvas.width || x < 0) vx = -vx;
  if (y > canvas.height || y < 0) vy = -vy;
  
  // 3. 绘制
  ctx.fillRect(x, y, 50, 50);
  
  // 4. 下一帧
  requestAnimationFrame(animate);
}

animate();
```

### 性能优化：离屏 Canvas
```javascript
// 创建离屏 Canvas（缓存静态内容）
const offscreenCanvas = document.createElement('canvas');
const offscreenCtx = offscreenCanvas.getContext('2d');
offscreenCanvas.width = 200;
offscreenCanvas.height = 200;

// 在离屏 Canvas 上绘制复杂图形
offscreenCtx.fillStyle = 'red';
offscreenCtx.fillRect(0, 0, 200, 200);
// ... 更多绘制操作

// 在主 Canvas 上使用（避免重复绘制）
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(offscreenCanvas, x, y); // 直接绘制离屏 Canvas
  requestAnimationFrame(animate);
}
```

## 七、事件处理

### 获取鼠标坐标
```javascript
canvas.addEventListener('click', (e) => {
  // 方法1：offsetX/Y（相对于 Canvas）
  const x = e.offsetX;
  const y = e.offsetY;
  
  // 方法2：计算（考虑 Canvas 缩放）
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  const x = (e.clientX - rect.left) * scaleX;
  const y = (e.clientY - rect.top) * scaleY;
  
  // 检测点击位置
  checkClick(x, y);
});
```

### 碰撞检测
```javascript
// 检测点是否在路径内
function isPointInPath(x, y) {
  ctx.beginPath();
  ctx.arc(100, 100, 50, 0, Math.PI * 2);
  return ctx.isPointInPath(x, y);
}

// 检测点是否在矩形内
function isPointInRect(x, y, rectX, rectY, rectW, rectH) {
  return x >= rectX && x <= rectX + rectW && y >= rectY && y <= rectY + rectH;
}

// 检测点是否在圆形内
function isPointInCircle(x, y, circleX, circleY, radius) {
  const dx = x - circleX;
  const dy = y - circleY;
  return dx * dx + dy * dy <= radius * radius;
}
```

## 八、清除画布

### 三种清除方式
```javascript
// 方法1：clearRect（推荐，性能好）
ctx.clearRect(0, 0, canvas.width, canvas.height);

// 方法2：重置宽高（会重置上下文状态，包括样式、变换等）
canvas.width = canvas.width;

// 方法3：覆盖绘制（适合需要背景色的情况）
ctx.fillStyle = 'white';
ctx.fillRect(0, 0, canvas.width, canvas.height);
```

## 九、保存 Canvas 内容

### 转换为图片
```javascript
// 转 DataURL（Base64）
const dataURL = canvas.toDataURL('image/png'); // 默认 PNG
const dataURL = canvas.toDataURL('image/jpeg', 0.8); // JPEG，质量 0-1

// 转 Blob（二进制）
canvas.toBlob((blob) => {
  const file = new File([blob], 'canvas.png', { type: 'image/png' });
  // 可以上传到服务器
}, 'image/png', 0.8);

// 下载图片
const link = document.createElement('a');
link.download = 'canvas.png';
link.href = dataURL;
link.click();
```

## 十、跨域图片处理

### CORS 配置
```javascript
const img = new Image();
img.crossOrigin = 'anonymous'; // 必须设置，否则无法操作像素
img.onload = () => {
  ctx.drawImage(img, 0, 0);
  // 现在可以安全地使用 getImageData
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
};
img.src = 'https://example.com/image.png';

// 服务端需要设置 CORS 头：
// Access-Control-Allow-Origin: *
```

### 错误处理
```javascript
img.onerror = () => {
  console.error('图片加载失败');
};

try {
  const imageData = ctx.getImageData(0, 0, 100, 100);
} catch (e) {
  console.error('跨域限制，无法获取像素数据');
}
```

## 十一、性能优化技巧

### 1. 分层渲染
```javascript
// 背景层（静态，不频繁更新）
const bgCanvas = document.createElement('canvas');
const bgCtx = bgCanvas.getContext('2d');
// 绘制背景...

// 动态层（频繁更新）
const mainCanvas = document.getElementById('mainCanvas');
const mainCtx = mainCanvas.getContext('2d');

function animate() {
  mainCtx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
  mainCtx.drawImage(bgCanvas, 0, 0); // 绘制背景
  // 绘制动态内容...
}
```

### 2. 避免浮点坐标
```javascript
// ❌ 不好：浮点坐标导致亚像素渲染
ctx.fillRect(10.5, 20.3, 100, 100);

// ✅ 好：整数坐标
ctx.fillRect(10, 20, 100, 100);
```

### 3. 减少绘制调用
```javascript
// ❌ 不好：多次绘制调用
ctx.fillRect(10, 10, 50, 50);
ctx.fillRect(70, 10, 50, 50);
ctx.fillRect(130, 10, 50, 50);

// ✅ 好：合并路径
ctx.beginPath();
ctx.rect(10, 10, 50, 50);
ctx.rect(70, 10, 50, 50);
ctx.rect(130, 10, 50, 50);
ctx.fill(); // 一次填充
```

### 4. 使用离屏 Canvas 缓存
```javascript
// 缓存复杂图形
const cacheCanvas = document.createElement('canvas');
const cacheCtx = cacheCanvas.getContext('2d');
// 绘制一次...
// 后续直接使用 cacheCanvas
```

### 5. 合理使用 CSS 变换
```javascript
// 使用 CSS transform 代替 Canvas 变换（GPU 加速）
canvas.style.transform = `translate(${x}px, ${y}px) rotate(${angle}deg)`;
canvas.style.willChange = 'transform'; // 提示浏览器优化
```

## 十二、实际应用场景

### 1. 电子签名
```javascript
let isDrawing = false;
let lastX = 0;
let lastY = 0;

canvas.addEventListener('mousedown', (e) => {
  isDrawing = true;
  lastX = e.offsetX;
  lastY = e.offsetY;
});

canvas.addEventListener('mousemove', (e) => {
  if (!isDrawing) return;
  
  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
  ctx.lineTo(e.offsetX, e.offsetY);
  ctx.stroke();
  
  lastX = e.offsetX;
  lastY = e.offsetY;
});

canvas.addEventListener('mouseup', () => {
  isDrawing = false;
});
```

### 2. 图片压缩
```javascript
function compressImage(file, quality = 0.8) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const dataURL = canvas.toDataURL('image/jpeg', quality);
      resolve(dataURL);
    };
    img.src = URL.createObjectURL(file);
  });
}
```

### 3. 动态海报生成
```javascript
async function generatePoster(userInfo, qrCode) {
  // 1. 绘制背景
  const bgImg = new Image();
  await new Promise((resolve) => {
    bgImg.onload = resolve;
    bgImg.src = 'bg.png';
  });
  ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
  
  // 2. 绘制用户信息
  ctx.fillStyle = 'white';
  ctx.font = '24px Arial';
  ctx.fillText(userInfo.name, 50, 50);
  
  // 3. 绘制二维码
  const qrImg = new Image();
  await new Promise((resolve) => {
    qrImg.onload = resolve;
    qrImg.src = qrCode;
  });
  ctx.drawImage(qrImg, 50, 100, 200, 200);
  
  // 4. 导出
  return canvas.toDataURL('image/png');
}
```

## 十三、核心面试题

### 1. Canvas 与 SVG 的核心区别？
- **渲染方式**：Canvas 是位图（像素），SVG 是矢量图（数学公式）
- **缩放效果**：Canvas 放大后模糊，SVG 无损缩放
- **DOM 结构**：Canvas 是单元素，SVG 是多节点
- **事件处理**：Canvas 需手动计算坐标，SVG 原生支持
- **性能**：Canvas 适合高频重绘，SVG 适合静态图形

### 2. 如何绘制基本图形？
- **矩形**：`fillRect()`, `strokeRect()`, `clearRect()`
- **圆形**：`arc()` + `fill()` 或 `stroke()`
- **路径**：`beginPath()` → `moveTo()` → `lineTo()` → `closePath()` → `fill()`/`stroke()`

### 3. 如何实现 Canvas 动画？
1. 使用 `requestAnimationFrame` 循环
2. 每帧清除画布：`clearRect()`
3. 更新对象状态（位置、颜色等）
4. 重绘所有元素
5. 使用离屏 Canvas 优化复杂图形

### 4. 如何做性能优化？
- **分层渲染**：背景层和动态层分离
- **避免浮点坐标**：防止亚像素渲染
- **使用离屏 Canvas**：缓存静态内容
- **减少绘制调用**：合并路径
- **合理使用 CSS 变换**：GPU 加速

### 5. 如何处理图像？
- **绘制**：`drawImage(img, dx, dy)` 或 `drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh)`
- **像素操作**：`getImageData()` 获取像素数据，操作后 `putImageData()` 绘制回画布
- **滤镜效果**：通过操作像素数据实现（灰度、反色、亮度等）

### 6. 如何实现事件交互？
1. 监听 Canvas 的 `click`/`mousemove` 事件
2. 获取鼠标坐标：`e.offsetX/Y` 或计算（考虑缩放）
3. 遍历所有图形进行碰撞检测
4. 使用 `isPointInPath()` 检测路径包含
5. 维护对象状态管理

### 7. 清除画布的三种方式？
- **`clearRect()`**：推荐，性能好，只清除像素
- **重置宽高**：`canvas.width = canvas.width`，会重置上下文状态
- **覆盖绘制**：用背景色填充，适合需要背景色的情况

### 8. 如何保存 Canvas 内容？
- **转 DataURL**：`canvas.toDataURL('image/png')`
- **转 Blob**：`canvas.toBlob(callback, 'image/png', quality)`
- **下载**：创建 `<a>` 标签，设置 `download` 和 `href`，触发 `click()`

### 9. 跨域图片处理？
- 设置 `img.crossOrigin = 'anonymous'`
- 服务端配置 CORS 头：`Access-Control-Allow-Origin`
- 使用 `try/catch` 处理安全错误
- 无法设置 CORS 时，转 base64 绕过限制

### 10. 如何实现旋转/缩放？
```javascript
ctx.save(); // 保存状态
ctx.translate(centerX, centerY); // 移动到中心
ctx.rotate(angle); // 旋转
ctx.scale(scaleX, scaleY); // 缩放
ctx.translate(-centerX, -centerY); // 移回
ctx.drawImage(...); // 绘制
ctx.restore(); // 恢复状态
```

### 11. Canvas 的像素数据格式？
- `getImageData()` 返回 `ImageData` 对象
- `imageData.data` 是 `Uint8ClampedArray`
- 每 4 个元素代表一个像素：`[R, G, B, A]`
- 数据按行扫描顺序排列

### 12. 如何实现图片滤镜？
- 获取像素数据：`getImageData()`
- 遍历像素，修改 RGB 值
- 将修改后的数据绘制回画布：`putImageData()`
- 常见滤镜：灰度、反色、亮度、对比度、模糊等
