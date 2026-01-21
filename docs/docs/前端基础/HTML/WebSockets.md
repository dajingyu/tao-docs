# WebSocket 核心技术

## 一、核心概念

### WebSocket 是什么？
WebSocket 是一个**全双工通信协议**，允许服务器和客户端双向实时通信。

### 与轮询的区别
- **轮询**：客户端定时主动询问服务器有没有新数据（如每 3 秒请求一次）
- **WebSocket**：服务器有新数据就主动推送给客户端，无需客户端频繁请求

**优势**：
- 减少请求次数，降低服务器压力
- 延迟更低，实时性更好
- 适合实时数据可视化、聊天、游戏等场景

## 二、基本使用

### 1. 创建连接
```javascript
const ws = new WebSocket('ws://localhost:8080');
```

### 2. 核心 API

#### 事件监听
- **`onopen`**：连接成功时触发
- **`onmessage`**：接收到服务器消息时触发
- **`onerror`**：连接出错时触发
- **`onclose`**：连接关闭时触发

#### 方法调用
- **`send(data)`**：向服务器发送数据
- **`close()`**：关闭连接

### 3. 完整示例
```javascript
const ws = new WebSocket('ws://localhost:8080');

// 连接成功
ws.onopen = () => {
  console.log('连接成功');
  ws.send('Hello Server');
};

// 接收消息
ws.onmessage = (event) => {
  console.log('收到消息:', event.data);
};

// 连接关闭
ws.onclose = () => {
  console.log('连接已关闭');
};

// 错误处理
ws.onerror = (error) => {
  console.error('连接错误:', error);
};
```

## 三、心跳检测机制

### 为什么需要心跳？
WebSocket 连接可能因为网络问题**静默断开**（没有触发 onclose），需要主动检测连接状态。

### 实现原理
1. **定时发送心跳包**：客户端每隔一段时间（如 30 秒）发送 "ping"
2. **等待服务器响应**：服务器收到后回复 "pong"
3. **超时检测**：如果超时时间内没收到 "pong"，认为连接断开，触发重连

### 代码实现
```javascript
let heartbeatTimer = null;
let timeoutTimer = null;

// 发送心跳
function sendHeartbeat() {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send('ping');
    
    // 设置超时检测
    timeoutTimer = setTimeout(() => {
      console.log('心跳超时，连接断开');
      ws.close();
      reconnect();
    }, 5000); // 5秒内没收到响应就重连
  }
}

// 启动心跳
ws.onopen = () => {
  heartbeatTimer = setInterval(() => {
    sendHeartbeat();
  }, 30000); // 每30秒发送一次心跳
};

// 收到 pong 响应，清除超时定时器
ws.onmessage = (event) => {
  if (event.data === 'pong') {
    clearTimeout(timeoutTimer);
    return;
  }
  // 处理其他消息...
};
```xiu

## 四、重连机制

### 实现思路
1. **监听连接关闭**：在 `onclose` 事件中触发重连
2. **指数退避**：重连间隔逐渐增加（1s → 2s → 4s → 8s）
3. **限制重连次数**：超过最大次数后停止重连，提示用户

### 代码实现
```javascript
let reconnectTimer = null;
let reconnectCount = 0;
const MAX_RECONNECT_COUNT = 5;
const RECONNECT_INTERVALS = [1000, 2000, 4000, 8000, 16000];

function reconnect() {
  if (reconnectCount >= MAX_RECONNECT_COUNT) {
    console.error('重连次数超限，停止重连');
    return;
  }

  const delay = RECONNECT_INTERVALS[reconnectCount] || 16000;
  reconnectTimer = setTimeout(() => {
    console.log(`第 ${reconnectCount + 1} 次重连...`);
    ws = new WebSocket('ws://localhost:8080');
    reconnectCount++;
    
    // 重新绑定事件
    bindEvents();
  }, delay);
}

ws.onclose = () => {
  clearInterval(heartbeatTimer);
  reconnect();
};

// 连接成功后重置重连次数
ws.onopen = () => {
  reconnectCount = 0;
  // 启动心跳...
};
```

## 五、核心面试题

### 1. WebSocket 与 HTTP 的区别？
- **连接方式**：HTTP 是短连接，请求-响应后断开；WebSocket 是长连接，建立后保持连接
- **通信方向**：HTTP 只能客户端发起；WebSocket 支持双向通信
- **数据格式**：HTTP 需要完整请求头；WebSocket 数据帧更轻量
- **适用场景**：HTTP 适合一次性请求；WebSocket 适合实时通信

### 2. WebSocket 握手过程？
1. 客户端发送 HTTP 请求，包含 `Upgrade: websocket` 和 `Sec-WebSocket-Key`
2. 服务器返回 `101 Switching Protocols`，包含 `Sec-WebSocket-Accept`
3. 连接升级为 WebSocket 协议

### 3. 如何保证 WebSocket 连接稳定性？
- **心跳检测**：定时发送 ping/pong，及时发现断连
- **自动重连**：连接断开后自动重连，使用指数退避策略
- **错误处理**：监听 error 和 close 事件，妥善处理异常
- **状态管理**：通过 `readyState` 判断连接状态（CONNECTING/OPEN/CLOSING/CLOSED）

### 4. WebSocket 的 readyState 有哪些值？
- **0 (CONNECTING)**：连接正在建立
- **1 (OPEN)**：连接已建立，可以通信
- **2 (CLOSING)**：连接正在关闭
- **3 (CLOSED)**：连接已关闭或无法打开

### 5. 心跳检测的实现原理？
- 客户端定时发送心跳包（如 "ping"）
- 服务器收到后立即回复（如 "pong"）
- 客户端设置超时检测，超时未收到响应则认为断连
- 触发重连逻辑

### 6. 为什么需要心跳检测？
- **静默断开**：网络问题可能导致连接断开但未触发 onclose
- **连接保活**：防止中间设备（如代理、防火墙）关闭空闲连接
- **及时发现问题**：比等待 onclose 更早发现连接异常

## 六、实际应用场景

- **实时聊天**：即时消息推送
- **在线游戏**：实时状态同步
- **数据可视化**：实时数据更新（如股票行情、监控大屏）
- **协同编辑**：多人实时协作
- **通知推送**：系统消息实时推送
