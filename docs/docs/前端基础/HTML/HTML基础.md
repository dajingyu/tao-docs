<!--
 * @Date: 2024-07-04 22:14:02
 * @LastEditors: dajingyu
 * @LastEditTime: 2025-02-05 17:15:54
 * @Description: 文件信息
-->
# HTML 核心知识点

## 一、HTML基础概念
- 超文本标记语言（HyperText Markup Language）
- 最新标准为HTML5（2014年W3C正式发布）

## 二、HTML5核心特性
### 1. 语义化标签
- 新增结构化元素：header/nav/article/section/aside/footer等
- 语义化优势：
    - 增强文档可读性：无样式时仍保持清晰结构
    - 提升SEO效果：帮助爬虫理解内容权重和上下文关系
    - 改善可访问性：屏幕阅读器等辅助设备能更准确解析内容
    - 便于团队协作：符合W3C标准，降低代码维护成本

### 2. 多媒体支持
- 原生集成audio和video标签，无需依赖第三方插件即可实现音视频播放

### 3. 表单增强
- 新增输入类型：date/color/email/url/search/tel等
- 验证属性：required/pattern/min/max等
- 新增元素：datalist/output/progress/meter

### 4. 存储方案
- localStorage：持久化存储（5MB）
- sessionStorage：会话级存储
- IndexedDB：结构化数据存储
- Application Cache（已弃用，推荐Service Worker）

## 三、核心面试题
### 1. HTML5新特性有哪些？
- 语义化标签体系
- 多媒体原生支持
- Canvas/SVG图形绘制
- 地理定位API
- Web Workers多线程
- WebSocket全双工通信
- 拖放(Drag and Drop) API
- History API（前端路由基础）

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
- 语法严格性：XHTML要求标签闭合、属性引号
- MIME类型：XHTML需用application/xhtml+xml
- 错误处理：XHTML遇到错误会停止解析
- 兼容性：HTML5兼容传统写法


 












	
		

     