# Web Workers 核心技术

## 一、核心概念

### Web Worker 是什么？
Web Worker 能开启"后台线程"处理耗时任务，避免阻塞主线程导致页面卡顿。

### 重要理解
**注意**：Web Worker 不是真正的多线程，而是 JavaScript 的单线程通过浏览器提供的 API **模拟的多线程环境**。

### 工作原理
- 主线程：负责 UI 渲染和用户交互
- Worker 线程：在后台执行计算任务，不阻塞主线程
- 通信方式：通过 `postMessage` 传递数据，数据是**深拷贝**，不是共享内存

## 二、使用限制

### Worker 里不能做什么？
- ❌ **不能操作 DOM**：无法访问 `document`、`window` 等
- ❌ **不能操作 BOM**：无法使用 `alert`、`confirm` 等浏览器 API
- ❌ **不能使用存储**：无法使用 `localStorage`、`sessionStorage`
- ❌ **不能访问父页面**：无法直接访问主线程的变量和函数

### Worker 能做什么？
- ✅ **纯数据计算**：大数组排序、复杂数据处理
- ✅ **图片处理**：图片压缩的计算部分（不涉及 DOM）
- ✅ **数据解析**：JSON 解析、CSV 处理
- ✅ **加密解密**：加密算法的计算

## 三、基本使用

### 1. 创建 Worker
```javascript
// 主线程：创建 Worker
const worker = new Worker('./worker.js');
```

### 2. 主线程与 Worker 通信

#### 主线程 → Worker
```javascript
// 主线程发送消息
worker.postMessage({ type: 'calculate', data: [1, 2, 3, 4, 5] });
```

#### Worker → 主线程
```javascript
// 主线程接收消息
worker.onmessage = (event) => {
  console.log('收到结果:', event.data);
};
```

### 3. Worker 内部实现
```javascript
// worker.js
// 接收主线程消息
self.onmessage = (event) => {
  const { type, data } = event.data;
  
  if (type === 'calculate') {
    // 执行计算任务
    const result = data.reduce((sum, num) => sum + num, 0);
    
    // 发送结果回主线程
    self.postMessage({ result });
  }
};
```

### 4. 关闭 Worker
```javascript
// 主线程关闭 Worker
worker.terminate();

// Worker 内部关闭自己
self.close();
```

## 四、完整示例

### 场景：大数组排序
```javascript
// main.js（主线程）
const worker = new Worker('./sort-worker.js');
const largeArray = new Array(1000000).fill(0).map(() => Math.random());

// 发送数据给 Worker
worker.postMessage({ array: largeArray });

// 接收排序结果
worker.onmessage = (event) => {
  console.log('排序完成:', event.data.sortedArray);
  worker.terminate(); // 关闭 Worker
};

worker.onerror = (error) => {
  console.error('Worker 错误:', error);
};
```

```javascript
// sort-worker.js（Worker 线程）
self.onmessage = (event) => {
  const { array } = event.data;
  
  // 执行排序（不会阻塞主线程）
  const sortedArray = array.sort((a, b) => a - b);
  
  // 返回结果
  self.postMessage({ sortedArray });
};
```

## 五、性能注意事项

### 数据传递的性能损耗
- **深拷贝机制**：`postMessage` 传递的数据是深拷贝，不是共享内存
- **大数据传递**：传递大对象或大数组会有性能损耗
- **优化建议**：
  - 只传递必要的数据
  - 使用 `Transferable Objects`（如 `ArrayBuffer`）实现零拷贝传输

### Transferable Objects 示例
```javascript
// 主线程：传递 ArrayBuffer（零拷贝）
const buffer = new ArrayBuffer(1024);
worker.postMessage({ buffer }, [buffer]); // 第二个参数表示转移所有权

// Worker 接收后，主线程的 buffer 变为不可用
```

## 六、核心面试题

### 1. Web Worker 的作用？
- 创建后台线程处理耗时任务
- 避免 JS 主线程阻塞
- 适合复杂计算场景
- 通过 `postMessage` 通信

### 2. Web Worker 的限制？
- **不能操作 DOM**：无法访问 `document`、`window`
- **不能操作 BOM**：无法使用浏览器 API
- **不能使用存储**：无法使用 `localStorage`、`sessionStorage`
- **只能做纯计算**：适合数据处理、算法计算等

### 3. Web Worker 与主线程如何通信？
- **主线程 → Worker**：`worker.postMessage(data)`
- **Worker → 主线程**：`self.postMessage(data)`
- **接收消息**：通过 `onmessage` 事件监听
- **数据传递**：深拷贝机制，不是共享内存

### 4. 为什么 Web Worker 不能操作 DOM？
- **线程安全**：DOM 操作必须在主线程进行，避免多线程竞争
- **设计限制**：Worker 运行在独立上下文，无法访问主线程的 DOM
- **性能考虑**：DOM 操作需要与渲染引擎交互，必须在主线程

### 5. 如何优化 Web Worker 的数据传递性能？
- **只传必要数据**：避免传递大对象
- **使用 Transferable Objects**：`ArrayBuffer`、`ImageBitmap` 等可以零拷贝传输
- **分批处理**：大数据分批传递和处理
- **使用 SharedArrayBuffer**（需要特殊环境）：真正的共享内存

### 6. Web Worker 的应用场景？
- **大数组排序**：不阻塞 UI 的排序操作
- **图片处理**：图片压缩、滤镜计算
- **数据解析**：大 JSON 解析、CSV 处理
- **加密解密**：加密算法的计算
- **复杂计算**：数学计算、数据分析

### 7. SharedWorker 与 Worker 的区别？
- **Worker**：每个页面创建独立的 Worker 实例
- **SharedWorker**：多个页面共享同一个 Worker 实例，可以跨标签页通信

### 8. 如何调试 Web Worker？
- 使用 `console.log`（会在浏览器控制台显示）
- 使用 Chrome DevTools 的 Sources 面板
- 监听 `onerror` 事件捕获错误
- 使用 `debugger` 语句设置断点

## 七、实际应用场景

### 1. 大文件上传
```javascript
// 主线程：选择文件
const file = input.files[0];
const worker = new Worker('./upload-worker.js');

// 分块读取文件
const chunkSize = 1024 * 1024; // 1MB
let offset = 0;

const reader = new FileReader();
reader.onload = (e) => {
  worker.postMessage({ chunk: e.target.result, offset });
  offset += chunkSize;
  if (offset < file.size) {
    readChunk();
  }
};

function readChunk() {
  const chunk = file.slice(offset, offset + chunkSize);
  reader.readAsArrayBuffer(chunk);
}
```

### 2. 图片压缩
```javascript
// worker.js：图片压缩计算
self.onmessage = (event) => {
  const { imageData, quality } = event.data;
  
  // 执行压缩算法（不涉及 DOM）
  const compressed = compressImage(imageData, quality);
  
  self.postMessage({ compressed });
};
```

### 3. 数据可视化预处理
```javascript
// worker.js：处理大量数据
self.onmessage = (event) => {
  const { rawData } = event.data;
  
  // 数据清洗、转换、聚合
  const processedData = rawData
    .filter(item => item.value > 0)
    .map(item => ({ ...item, normalized: item.value / 100 }))
    .reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + item.normalized;
      return acc;
    }, {});
  
  self.postMessage({ processedData });
};
```

## 八、最佳实践

### 1. 何时使用 Web Worker？
- ✅ 需要处理大量数据
- ✅ 复杂计算会阻塞 UI
- ✅ 需要保持页面响应性
- ❌ 简单计算不需要（创建 Worker 有开销）
- ❌ 需要操作 DOM 的场景

### 2. 性能优化建议
- **及时关闭 Worker**：使用完后调用 `terminate()`
- **避免频繁创建**：复用 Worker 实例
- **合理传递数据**：只传必要数据，使用 Transferable Objects
- **错误处理**：监听 `onerror` 事件
- **超时处理**：长时间任务设置超时机制

### 3. 代码示例：带超时的 Worker
```javascript
const worker = new Worker('./worker.js');
let timeoutId;

worker.postMessage({ data: largeData });

// 设置超时
timeoutId = setTimeout(() => {
  worker.terminate();
  console.error('Worker 超时');
}, 30000);

worker.onmessage = (event) => {
  clearTimeout(timeoutId);
  console.log('结果:', event.data);
};
```
