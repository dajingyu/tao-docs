<!--
 * @Date: 2024-07-05 09:57:16
 * @LastEditors: dajingyu
 * @LastEditTime: 2025-02-05 17:30:29
 * @Description: 文件信息
-->
# Canvas 核心技术

## 高频应用场景
- **电子签名**：通过Path2D记录笔迹坐标实现手写签名
- **动态海报生成**：结合DOM截图与Canvas绘制生成分享图
- **游戏开发**：2D游戏引擎渲染（如Phaser.js）
- **数据可视化**：Echarts等图表库的底层渲染
- **图像处理**：像素级操作（滤镜/抠图/合成）
- **动画效果**：粒子系统/物理引擎可视化

## 核心面试题
### 1. Canvas与SVG的核心区别？
- **渲染方式**：位图 vs 矢量图
- **事件处理**：Canvas需手动计算坐标区域
- **性能表现**：Canvas更适合高频重绘
- **缩放效果**：SVG无损缩放，Canvas会模糊
- **DOM结构**：Canvas单元素，SVG多节点

### 2. 如何绘制基本图形？
``` js
// 矩形
ctx.fillRect(x, y, width, height)
ctx.strokeRect(x, y, width, height)
// 圆形
ctx.beginPath()
ctx.arc(x, y, radius, 0, Math.PI 2)
ctx.fill()
// 路径
ctx.beginPath()
ctx.moveTo(x1, y1)
ctx.lineTo(x2, y2)
ctx.closePath()
```

### 3. 如何实现Canvas动画？
1. 使用requestAnimationFrame循环
2. 每帧清除画布：ctx.clearRect()
3. 更新对象状态（位置/颜色等）
4. 重绘所有元素
5. 使用离屏Canvas优化复杂图形

### 4. 如何做性能优化？
- 分层渲染：背景层/动态层分离
- 避免浮点坐标：防止亚像素渲染
- 使用离屏Canvas缓存静态内容
- 减少绘制调用（合并路径）
- 合理使用will-change: transform

### 5. 如何处理图像？
```javascript
const img = new Image()
img.onload = () => {
  // 基础绘制
  ctx.drawImage(img, dx, dy)
  
  // 图像裁剪
  ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh)
  
  // 像素操作
  const imageData = ctx.getImageData(x, y, w, h)
  ctx.putImageData(imageData, x, y) 
}
img.src = 'image.png'
```

### 6. 如何实现事件交互？
1. 监听Canvas的click/mousemove事件
2. 获取鼠标坐标：e.offsetX/Y
3. 遍历所有图形进行碰撞检测
4. 使用isPointInPath检测路径包含
5. 维护对象状态管理

### 7. 清除画布的三种方式？
```javascript
// 全清
ctx.clearRect(0, 0, canvas.width, canvas.height)

// 重置宽高（会重置上下文状态）
canvas.width = canvas.width

// 覆盖绘制
ctx.fillStyle = 'white'
ctx.fillRect(0, 0, canvas.width, canvas.height)
```

### 8. 如何保存Canvas内容？
```javascript
// 转DataURL
const png = canvas.toDataURL('image/png') 

// 转Blob
canvas.toBlob(blob => {
  const file = new File([blob], 'image.png')
}, 'image/png')

// 保存文件
const link = document.createElement('a')
link.download = 'canvas.png'
link.href = png
link.click()
```

### 9. 跨域图片处理？
- 设置img.crossOrigin = 'anonymous'
- 服务端配置CORS头
- 使用try/catch处理安全错误
- 转base64绕过限制

### 10. 如何实现旋转/缩放？
```javascript
ctx.save() // 保存状态
ctx.translate(centerX, centerY)
ctx.rotate(angle * Math.PI/180)
ctx.scale(scaleX, scaleY)
ctx.translate(-centerX, -centerY)
ctx.drawImage(...)
ctx.restore() // 恢复状态
```

