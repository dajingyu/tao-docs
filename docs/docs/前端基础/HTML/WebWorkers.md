# WebWorkers
- 多线程操作，可以用于项目性能优化：比如将计算量大的任务交给 web worker 处理(大文件上传)

1. 概念

Web Worker 是 H5 新特性，允许我们开辟分线程，运行 js 代码。

2. 使用

- `const worker = new Worker('./xxx.js')` 创建分线程执行 js 脚本
- 主线程通过 `worker.onmessage` 事件接受分线程的消息
- 主线程通过 `worker.postMessage` 方法向分线程发送消息
- 分线程通过 `self.onmessage` 事件接受主线程的消息
- 分线程通过 `self.postMessage` 方法向主线程发送消息