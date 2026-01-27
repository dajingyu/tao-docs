# JavaScript 进阶核心知识

## 一、异步编程

### 1.1 Promise

#### 基本概念

Promise 是异步编程的解决方案，用于解决回调地狱问题。

**三种状态**：
- `pending`：初始状态
- `fulfilled`（resolved）：成功状态
- `rejected`：失败状态

**状态转换**：
- `pending` → `fulfilled`（调用 `resolve()`）
- `pending` → `rejected`（调用 `reject()` 或抛出错误）
- 状态一旦改变，不可逆转

#### 基本用法

```javascript
const promise = new Promise((resolve, reject) => {
  // 异步操作
  setTimeout(() => {
    const success = true;
    if (success) {
      resolve('操作成功');
    } else {
      reject('操作失败');
    }
  }, 1000);
});

promise
  .then(value => console.log(value))  // '操作成功'
  .catch(error => console.error(error)) // 捕获错误
  .finally(() => console.log('完成')); // 无论成功失败都执行
```

#### Promise 静态方法

| 方法 | 说明 | 示例 |
|------|------|------|
| `Promise.resolve()` | 返回成功状态的 Promise | `Promise.resolve(1)` |
| `Promise.reject()` | 返回失败状态的 Promise | `Promise.reject('error')` |
| `Promise.all()` | 所有成功才成功，一个失败就失败 | `Promise.all([p1, p2])` |
| `Promise.allSettled()` | 等待所有完成，返回所有结果 | `Promise.allSettled([p1, p2])` |
| `Promise.race()` | 第一个完成就返回 | `Promise.race([p1, p2])` |
| `Promise.any()` | 第一个成功就返回（ES2021） | `Promise.any([p1, p2])` |

**Promise.all()**：
```javascript
const p1 = Promise.resolve(1);
const p2 = Promise.resolve(2);
const p3 = Promise.reject('error');

Promise.all([p1, p2]).then(values => {
  console.log(values); // [1, 2]
});

Promise.all([p1, p2, p3]).catch(error => {
  console.error(error); // 'error'
});
```

**Promise.allSettled()**（ES2020）：
```javascript
const p1 = Promise.resolve(1);
const p2 = Promise.reject('error');

Promise.allSettled([p1, p2]).then(results => {
  console.log(results);
  // [
  //   { status: 'fulfilled', value: 1 },
  //   { status: 'rejected', reason: 'error' }
  // ]
});
```

**Promise.any()**（ES2021）：
```javascript
const p1 = Promise.reject('error1');
const p2 = Promise.resolve('success');

Promise.any([p1, p2]).then(value => {
  console.log(value); // 'success'（第一个成功的值）
});
```

### 1.2 async/await

#### 基本用法

```javascript
async function fetchData() {
  try {
    const response = await fetch('/api/data');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('错误:', error);
  }
}

// 使用
fetchData().then(data => console.log(data));
```

#### 错误处理

```javascript
// 方式1：try-catch
async function handleError() {
  try {
    await someAsyncOperation();
  } catch (error) {
    console.error(error);
  }
}

// 方式2：catch
async function handleError() {
  await someAsyncOperation().catch(error => {
    console.error(error);
  });
}
```

#### 并发执行

```javascript
// ❌ 串行执行（慢）
const result1 = await fetch('/api/1');
const result2 = await fetch('/api/2');

// ✅ 并发执行（快）
const [result1, result2] = await Promise.all([
  fetch('/api/1'),
  fetch('/api/2')
]);
```

### 1.3 Generator 函数

#### 基本语法

```javascript
function* generator() {
  yield 1;
  yield 2;
  yield 3;
}

const gen = generator();
console.log(gen.next()); // { value: 1, done: false }
console.log(gen.next()); // { value: 2, done: false }
console.log(gen.next()); // { value: 3, done: false }
console.log(gen.next()); // { value: undefined, done: true }
```

#### 异步应用

```javascript
function* fetchUser() {
  const user = yield fetch('/api/user').then(r => r.json());
  const posts = yield fetch(`/api/posts/${user.id}`).then(r => r.json());
  return { user, posts };
}

// 执行器
function run(generator) {
  const gen = generator();
  
  function handle(result) {
    if (result.done) return result.value;
    return Promise.resolve(result.value).then(res => {
      return handle(gen.next(res));
    });
  }
  
  return handle(gen.next());
}

run(fetchUser).then(data => console.log(data));
```

---

## 二、事件循环机制（Event Loop）

### 2.1 为什么是单线程？

JavaScript 是单线程的，原因：
- 主要用途是与用户交互和操作 DOM
- 多线程会带来复杂的同步问题
- Web Worker 可以创建子线程，但不能操作 DOM

### 2.2 任务队列

**同步任务**：在主线程执行栈中执行
**异步任务**：由其他线程执行，完成后回调放入任务队列

**任务分类**：

| 类型 | 说明 | 示例 |
|------|------|------|
| **宏任务** | 由宿主环境提供 | `setTimeout`、`setInterval`、`I/O`、`UI渲染` |
| **微任务** | 由 JS 引擎提供 | `Promise.then`、`queueMicrotask`、`MutationObserver` |

### 2.3 执行顺序

**规则**：
1. 执行栈中的同步代码
2. 执行所有微任务
3. 执行一个宏任务
4. 重复步骤 2-3

**示例**：
```javascript
console.log(1);

setTimeout(() => {
  console.log(2);
  Promise.resolve().then(() => console.log(3));
}, 0);

Promise.resolve().then(() => {
  console.log(4);
  setTimeout(() => console.log(5), 0);
});

console.log(6);

// 输出：1, 6, 4, 2, 3, 5
```

**执行过程**：
1. 同步代码：`1`, `6`
2. 微任务：`4`
3. 宏任务：`2`，然后微任务：`3`
4. 宏任务：`5`

### 2.4 常见宏任务和微任务

**宏任务**：
- `setTimeout` / `setInterval`
- `setImmediate`（Node.js）
- `I/O` 操作
- `UI rendering`
- `MessageChannel`

**微任务**：
- `Promise.then` / `catch` / `finally`
- `queueMicrotask()`
- `MutationObserver`
- `process.nextTick`（Node.js）

---

## 三、ES6+ 新特性

### 3.1 ES6（ES2015）

#### let 和 const

```javascript
// let：块级作用域
if (true) {
  let x = 1;
}
console.log(x); // ReferenceError

// const：常量，必须初始化
const PI = 3.14;
PI = 3.14159; // TypeError
```

#### 解构赋值

```javascript
// 数组解构
const [a, b, c] = [1, 2, 3];

// 对象解构
const { name, age } = { name: 'Alice', age: 20 };

// 默认值
const { name = 'Unknown' } = {};

// 重命名
const { name: userName } = { name: 'Alice' };
```

#### 模板字符串

```javascript
const name = 'Alice';
const message = `Hello, ${name}!`;
const multiLine = `
  第一行
  第二行
`;
```

#### 箭头函数

```javascript
// 基本语法
const add = (a, b) => a + b;

// 特点
// 1. 没有 this，继承外部 this
// 2. 没有 arguments
// 3. 不能作为构造函数
// 4. 没有 prototype
```

#### 扩展运算符

```javascript
// 数组
const arr1 = [1, 2, 3];
const arr2 = [...arr1, 4, 5];

// 对象（ES2018）
const obj1 = { a: 1 };
const obj2 = { ...obj1, b: 2 };
```

#### 默认参数

```javascript
function greet(name = 'Guest') {
  console.log(`Hello, ${name}`);
}
```

### 3.2 ES2016（ES7）

#### Array.prototype.includes()

```javascript
[1, 2, 3].includes(2);        // true
[1, 2, NaN].includes(NaN);   // true（indexOf 无法判断 NaN）
```

#### 指数运算符（**）

```javascript
2 ** 3;        // 8（等同于 Math.pow(2, 3)）
2 ** 3 ** 2;   // 512（右结合）
```

### 3.3 ES2017（ES8）

#### async/await

见异步编程章节

#### Object.entries() / Object.values()

```javascript
const obj = { a: 1, b: 2, c: 3 };

Object.keys(obj);    // ['a', 'b', 'c']
Object.values(obj);  // [1, 2, 3]
Object.entries(obj); // [['a', 1], ['b', 2], ['c', 3]]

// 应用：对象转 Map
const map = new Map(Object.entries(obj));
```

#### String.prototype.padStart() / padEnd()

```javascript
'5'.padStart(3, '0');  // '005'
'5'.padEnd(3, '0');    // '500'
```

#### Object.getOwnPropertyDescriptors()

```javascript
const obj = {
  get name() { return 'Alice'; }
};

Object.getOwnPropertyDescriptors(obj);
// { name: { get: [Function: get name], enumerable: true, configurable: true } }
```

### 3.4 ES2018（ES9）

#### 异步迭代器（for-await-of）

```javascript
async function* asyncGenerator() {
  yield Promise.resolve(1);
  yield Promise.resolve(2);
}

(async () => {
  for await (const value of asyncGenerator()) {
    console.log(value); // 1, 2
  }
})();
```

#### Rest/Spread 属性

```javascript
// 对象解构 rest
const { a, ...rest } = { a: 1, b: 2, c: 3 };
// rest = { b: 2, c: 3 }

// 对象 spread
const obj = { ...{ a: 1 }, b: 2 };
```

#### Promise.finally()

```javascript
promise
  .then(value => console.log(value))
  .catch(error => console.error(error))
  .finally(() => console.log('完成'));
```

#### 正则表达式增强

```javascript
// 命名捕获组
const regex = /(?<year>\d{4})-(?<month>\d{2})/;
const match = '2024-01'.match(regex);
console.log(match.groups); // { year: '2024', month: '01' }

// 反向断言
/(?<=foo)bar/.test('foobar'); // true
/(?<!foo)bar/.test('barbar'); // true
```

### 3.5 ES2019（ES10）

#### Array.prototype.flat() / flatMap()

```javascript
[1, [2, [3]]].flat();        // [1, 2, [3]]
[1, [2, [3]]].flat(2);       // [1, 2, 3]
[1, 2, 3].flatMap(x => [x, x * 2]); // [1, 2, 2, 4, 3, 6]
```

#### Object.fromEntries()

```javascript
const entries = [['a', 1], ['b', 2]];
Object.fromEntries(entries); // { a: 1, b: 2 }

// 应用：Map 转对象
const map = new Map([['a', 1], ['b', 2]]);
Object.fromEntries(map); // { a: 1, b: 2 }
```

#### String.prototype.trimStart() / trimEnd()

```javascript
'  hello  '.trimStart(); // 'hello  '
'  hello  '.trimEnd();   // '  hello'
```

#### Optional catch binding

```javascript
try {
  // ...
} catch {  // 不需要 catch(error)
  // ...
}
```

### 3.6 ES2020（ES11）

#### BigInt

见 JS基础.md

#### 可选链操作符（?.）

```javascript
const user = {
  address: {
    street: '123 Main St'
  }
};

// 传统方式
const street = user && user.address && user.address.street;

// 可选链
const street = user?.address?.street;

// 方法调用
user?.getName?.();

// 数组访问
arr?.[0];
```

#### 空值合并运算符（??）

```javascript
const value = null ?? 'default';  // 'default'
const value = undefined ?? 'default'; // 'default'
const value = 0 ?? 'default';     // 0（注意：0 不是 null/undefined）

// 与 || 的区别
0 || 'default';  // 'default'
0 ?? 'default';   // 0
```

#### Promise.allSettled()

见 Promise 章节

#### globalThis

```javascript
// 统一全局对象访问
globalThis === window;  // 浏览器
globalThis === global;  // Node.js
```

#### Dynamic import()

```javascript
// 动态导入
const module = await import('./module.js');
```

### 3.7 ES2021（ES12）

#### Promise.any()

见 Promise 章节

#### 逻辑赋值运算符

```javascript
// &&=
let a = 1;
a &&= 2;  // a = a && 2

// ||=
let b = null;
b ||= 'default';  // b = b || 'default'

// ??=
let c = null;
c ??= 'default';  // c = c ?? 'default'
```

#### String.prototype.replaceAll()

```javascript
'hello world'.replaceAll('l', 'L'); // 'heLLo worLd'
```

#### 数字分隔符

```javascript
const billion = 1_000_000_000;  // 1000000000
const binary = 0b1010_0001;     // 161
```

### 3.8 ES2022（ES13）

#### 顶层 await

```javascript
// 模块顶层可以直接使用 await
const data = await fetch('/api/data').then(r => r.json());
```

#### 类字段声明

```javascript
class MyClass {
  // 公共字段
  publicField = 1;
  
  // 私有字段
  #privateField = 2;
  
  // 静态字段
  static staticField = 3;
  
  // 静态私有字段
  static #staticPrivateField = 4;
}
```

#### Object.hasOwn()

```javascript
const obj = { a: 1 };
Object.hasOwn(obj, 'a');  // true（替代 obj.hasOwnProperty('a')）
```

#### Array.at()

```javascript
const arr = [1, 2, 3];
arr.at(0);   // 1
arr.at(-1);  // 3（负数索引）
```

#### Error.cause

```javascript
throw new Error('错误', { cause: originalError });
```

---

## 四、闭包

### 4.1 闭包概念

**定义**：内部函数可以访问外部函数的变量，即使外部函数已执行完毕。

**产生条件**：
1. 函数嵌套
2. 内部函数引用外部函数的变量
3. 调用外部函数

### 4.2 闭包示例

```javascript
function outer() {
  let count = 0;
  
  function inner() {
    count++;
    console.log(count);
  }
  
  return inner;
}

const counter = outer();
counter(); // 1
counter(); // 2
counter(); // 3
```

### 4.3 闭包应用

#### 1. 数据私有化

```javascript
function createCounter() {
  let count = 0;
  
  return {
    increment() { count++; },
    decrement() { count--; },
    getCount() { return count; }
  };
}

const counter = createCounter();
counter.increment();
console.log(counter.getCount()); // 1
```

#### 2. 函数工厂

```javascript
function createMultiplier(multiplier) {
  return function(number) {
    return number * multiplier;
  };
}

const double = createMultiplier(2);
const triple = createMultiplier(3);

console.log(double(5));  // 10
console.log(triple(5));  // 15
```

#### 3. 防抖和节流

见手写函数.md

### 4.4 闭包问题

**内存泄漏**：
```javascript
// ❌ 问题：闭包持有大对象引用
function outer() {
  const largeData = new Array(1000000).fill(0);
  
  return function() {
    // 即使不使用 largeData，也会持有引用
    console.log('inner');
  };
}

// ✅ 解决：使用后置 null
function outer() {
  let largeData = new Array(1000000).fill(0);
  
  const inner = function() {
    console.log('inner');
  };
  
  largeData = null; // 释放引用
  return inner;
}
```

---

## 五、this 指向

### 5.1 绑定规则

| 规则 | 说明 | 示例 |
|------|------|------|
| **默认绑定** | 非严格模式指向 `window`，严格模式 `undefined` | `function fn() { console.log(this); } fn();` |
| **隐式绑定** | 对象调用，指向调用对象 | `obj.fn()` → `this` 指向 `obj` |
| **显式绑定** | `call`/`apply`/`bind` | `fn.call(obj)` → `this` 指向 `obj` |
| **new 绑定** | 构造函数调用，指向实例 | `new Fn()` → `this` 指向实例 |

### 5.2 call / apply / bind

```javascript
function greet(greeting, punctuation) {
  console.log(`${greeting}, ${this.name}${punctuation}`);
}

const person = { name: 'Alice' };

// call：立即执行，参数逐个传递
greet.call(person, 'Hello', '!'); // 'Hello, Alice!'

// apply：立即执行，参数数组传递
greet.apply(person, ['Hi', '.']); // 'Hi, Alice.'

// bind：返回新函数，不立即执行
const boundGreet = greet.bind(person);
boundGreet('Hey', '!'); // 'Hey, Alice!'
```

### 5.3 箭头函数的 this

```javascript
const obj = {
  name: 'Alice',
  regular: function() {
    console.log(this.name); // 'Alice'
  },
  arrow: () => {
    console.log(this.name); // undefined（指向外层 this）
  }
};

obj.regular(); // 'Alice'
obj.arrow();   // undefined
```

---

## 六、内存管理

### 6.1 垃圾回收机制

**标记清除**（主流）：
- 标记所有可达对象
- 清除未标记的对象

**引用计数**（已废弃）：
- 记录每个对象的引用次数
- 引用为 0 时回收
- 无法处理循环引用

### 6.2 内存泄漏场景

#### 1. 全局变量

```javascript
// ❌ 泄漏
function leak() {
  globalVar = new Array(1000000);
}

// ✅ 解决
function noLeak() {
  const localVar = new Array(1000000);
}
```

#### 2. 闭包

```javascript
// ❌ 泄漏：闭包持有大对象
function outer() {
  const largeData = new Array(1000000);
  return function() {
    // 即使不使用 largeData
  };
}

// ✅ 解决：使用后置 null
function outer() {
  let largeData = new Array(1000000);
  const inner = function() { };
  largeData = null;
  return inner;
}
```

#### 3. 事件监听器

```javascript
// ❌ 泄漏：未移除监听器
element.addEventListener('click', handler);

// ✅ 解决：移除监听器
element.removeEventListener('click', handler);
```

#### 4. 定时器

```javascript
// ❌ 泄漏：未清除定时器
const timer = setInterval(() => { }, 1000);

// ✅ 解决：清除定时器
clearInterval(timer);
```

### 6.3 WeakMap / WeakSet

**特点**：
- 弱引用，不阻止垃圾回收
- 键必须是对象
- 不可遍历

**应用**：
```javascript
// 存储私有数据
const privateData = new WeakMap();

class MyClass {
  constructor() {
    privateData.set(this, { secret: 'data' });
  }
  
  getSecret() {
    return privateData.get(this);
  }
}
```

---

## 七、Map 和 Set

### 7.1 Map

**特点**：
- 键可以是任意类型
- 保持插入顺序
- 有 `size` 属性

```javascript
const map = new Map();
map.set('key', 'value');
map.set(1, 'number');
map.set({}, 'object');

map.get('key');  // 'value'
map.size;        // 3
```

### 7.2 Set

**特点**：
- 值唯一
- 保持插入顺序

```javascript
const set = new Set([1, 2, 2, 3]);
set.size;        // 3
set.has(2);      // true
set.add(4);
```

### 7.3 WeakMap / WeakSet

**特点**：
- 弱引用，不阻止垃圾回收
- 键/值必须是对象
- 不可遍历

**应用**：
- 存储私有数据
- DOM 节点关联数据
- 缓存计算结果

---

## 八、Proxy 和 Reflect

### 8.1 Proxy

**基本用法**：
```javascript
const target = { name: 'Alice' };
const proxy = new Proxy(target, {
  get(target, prop) {
    console.log(`读取 ${prop}`);
    return target[prop];
  },
  set(target, prop, value) {
    console.log(`设置 ${prop} = ${value}`);
    target[prop] = value;
    return true;
  }
});

proxy.name;        // '读取 name' → 'Alice'
proxy.age = 20;    // '设置 age = 20'
```

**应用场景**：
- Vue3 响应式系统
- 数据验证
- 函数调用拦截

### 8.2 Reflect

**特点**：
- 提供操作对象的统一 API
- 与 Proxy 配合使用

```javascript
const obj = { name: 'Alice' };

// 传统方式
obj.name;                    // 'Alice'
obj.name = 'Bob';
delete obj.name;

// Reflect 方式
Reflect.get(obj, 'name');    // 'Alice'
Reflect.set(obj, 'name', 'Bob');
Reflect.deleteProperty(obj, 'name');
```

---

## 九、JavaScript API 细节与对比

### 9.1 数组查找 API 对比

#### indexOf() vs findIndex()

**相同点**：
- 都用于查找元素在数组中的索引
- 找不到时都返回 `-1`
- 都从前往后查找

**不同点**：

| 特性         | indexOf()                    | findIndex()                     |
| ------------ | ---------------------------- | ------------------------------- |
| **ES版本**   | ES5                          | ES6                             |
| **查找方式** | 值相等（===）                | 回调函数判断                    |
| **参数**     | `indexOf(value, fromIndex?)` | `findIndex(callback, thisArg?)` |
| **适用场景** | 简单值查找                   | 复杂条件查找                    |
| **NaN处理**  | 无法查找 NaN                 | 可以查找 NaN                    |

**示例**：
```javascript
const arr = [1, 2, 3, 4, 5];

// indexOf：值查找
arr.indexOf(3);        // 2
arr.indexOf(6);        // -1（找不到）
arr.indexOf(NaN);      // -1（NaN !== NaN，无法查找）

// findIndex：条件查找
arr.findIndex(x => x > 3);           // 3（第一个大于3的元素）
arr.findIndex(x => x === 6);        // -1（找不到）
arr.findIndex(x => isNaN(x));       // 可以查找 NaN

// 复杂对象查找
const users = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' }
];

users.indexOf({ id: 1 });                    // -1（对象引用不同）
users.findIndex(user => user.id === 1);      // 0（按属性查找）
```

#### lastIndexOf() vs findLastIndex()

**lastIndexOf()**（ES5）：
```javascript
const arr = [1, 2, 3, 2, 1];
arr.lastIndexOf(2);        // 3（从后往前找）
arr.lastIndexOf(2, 2);     // 1（从索引2往前找）
arr.lastIndexOf(6);        // -1（找不到）
```

**findLastIndex()**（ES2023）：
```javascript
const arr = [1, 2, 3, 4, 5];
arr.findLastIndex(x => x > 3);      // 4（从后往前找第一个满足条件的）
arr.findLastIndex(x => x === 6);   // -1（找不到）
```

#### includes() vs indexOf()

**相同点**：
- 都用于判断数组是否包含某个元素
- 都使用严格相等（===）比较

**不同点**：

| 特性        | includes()   | indexOf()       |
| ----------- | ------------ | --------------- |
| **ES版本**  | ES2016       | ES5             |
| **返回值**  | 布尔值       | 索引或 -1       |
| **NaN处理** | 可以查找 NaN | 无法查找 NaN    |
| **可读性**  | 更语义化     | 需要判断 !== -1 |

**示例**：
```javascript
const arr = [1, 2, 3, NaN];

// includes：返回布尔值
arr.includes(2);        // true
arr.includes(6);        // false
arr.includes(NaN);      // true（可以查找 NaN）

// indexOf：返回索引
arr.indexOf(2) !== -1;   // true（需要判断）
arr.indexOf(6) !== -1;  // false
arr.indexOf(NaN);       // -1（无法查找 NaN）

// 推荐使用 includes
if (arr.includes(value)) { }  // ✅ 更清晰
if (arr.indexOf(value) !== -1) { }  // ❌ 不够直观
```

#### find() vs filter()

**find()**：
- 返回**第一个**满足条件的元素
- 找不到返回 `undefined`
- 找到后**立即停止**查找

**filter()**：
- 返回**所有**满足条件的元素组成的**新数组**
- 找不到返回**空数组** `[]`
- 会**遍历整个数组**

**示例**：
```javascript
const arr = [1, 2, 3, 4, 5];

// find：找第一个
arr.find(x => x > 3);        // 4
arr.find(x => x > 10);       // undefined

// filter：找所有
arr.filter(x => x > 3);      // [4, 5]
arr.filter(x => x > 10);     // []

// 性能对比
const largeArr = new Array(1000000).fill(0).map((_, i) => i);

// find：找到第一个就停止
largeArr.find(x => x > 100);  // 很快

// filter：遍历整个数组
largeArr.filter(x => x > 100); // 较慢
```

#### some() vs every()

**some()**：
- 判断是否**至少有一个**元素满足条件
- 找到第一个满足条件的就返回 `true`，停止查找
- 全部不满足返回 `false`

**every()**：
- 判断是否**所有**元素都满足条件
- 找到第一个不满足条件的就返回 `false`，停止查找
- 全部满足返回 `true`

**示例**：
```javascript
const arr = [1, 2, 3, 4, 5];

// some：至少一个满足
arr.some(x => x > 3);        // true（有4和5）
arr.some(x => x > 10);       // false（全部不满足）

// every：全部满足
arr.every(x => x > 0);       // true（全部大于0）
arr.every(x => x > 3);       // false（1、2、3不满足）

// 空数组的特殊情况
[].some(x => x > 0);         // false（空数组返回false）
[].every(x => x > 0);        // true（空数组返回true，空真值）
```

### 9.2 字符串 API 详解

#### slice() - 提取字符串片段

**语法**：`str.slice(startIndex, endIndex?)`

**参数**：
- `startIndex`：开始位置（包含）
- `endIndex`：结束位置（不包含），可选，默认为字符串长度

**特点**：
- 支持**负数索引**（从末尾开始计算）
- 不修改原字符串
- `startIndex > endIndex` 时返回空字符串

**示例**：
```javascript
const str = 'Hello World';

str.slice(0);           // 'Hello World'（从0到末尾）
str.slice(0, 5);         // 'Hello'（从0到5，不包含5）
str.slice(6);            // 'World'（从6到末尾）
str.slice(6, 11);        // 'World'（从6到11）

// 负数索引
str.slice(-5);           // 'World'（从倒数第5个到末尾）
str.slice(-5, -1);       // 'Worl'（从倒数第5个到倒数第1个）
str.slice(0, -6);         // 'Hello'（从0到倒数第6个）

// 边界情况
str.slice(5, 2);         // ''（start > end 返回空字符串）
str.slice(100);           // ''（超出范围返回空字符串）
```

#### substring() - 提取子字符串

**语法**：`str.substring(startIndex, endIndex?)`

**参数**：
- `startIndex`：开始位置（包含）
- `endIndex`：结束位置（不包含），可选

**特点**：
- **不支持负数索引**（负数会被当作0处理）
- 自动交换参数（如果 `start > end`）
- 不修改原字符串

**示例**：
```javascript
const str = 'Hello World';

str.substring(0, 5);     // 'Hello'
str.substring(6);         // 'World'
str.substring(6, 11);     // 'World'

// 负数处理
str.substring(-3, 5);     // 'Hello'（-3被当作0）
str.substring(5, -3);     // 'Hello'（自动交换，-3被当作0）

// 自动交换
str.substring(5, 2);      // 'llo'（自动交换为 substring(2, 5)）
```

#### substr() - 提取指定长度的子字符串（已废弃）

**语法**：`str.substr(startIndex, length?)`

**参数**：
- `startIndex`：开始位置
- `length`：提取的长度，可选，默认为到末尾

**特点**：
- 支持负数索引
- **已废弃**，不推荐使用
- 推荐使用 `slice()` 替代

**示例**：
```javascript
const str = 'Hello World';

str.substr(0, 5);         // 'Hello'（从0开始，长度5）
str.substr(6);            // 'World'（从6到末尾）
str.substr(-5);           // 'World'（从倒数第5个到末尾）
str.substr(-5, 3);        // 'Wor'（从倒数第5个开始，长度3）

// ⚠️ 已废弃，推荐使用 slice
str.slice(6, 11);         // 'World'（推荐）
```

#### slice() vs substring() vs substr() 对比

| 特性         | slice()        | substring()       | substr()        |
| ------------ | -------------- | ----------------- | --------------- |
| **参数**     | (start, end)   | (start, end)      | (start, length) |
| **负数索引** | ✅ 支持         | ❌ 不支持（当作0） | ✅ 支持          |
| **自动交换** | ❌ 返回空字符串 | ✅ 自动交换        | ❌ 不支持        |
| **状态**     | ✅ 推荐         | ⚠️ 可用            | ❌ 已废弃        |
| **ES版本**   | ES3            | ES3               | ES3（废弃）     |

**推荐使用**：`slice()`（功能最强大，支持负数索引）

#### indexOf() vs lastIndexOf() - 查找子字符串位置

**indexOf()**：
```javascript
const str = 'Hello World';

str.indexOf('o');         // 4（第一个'o'的位置）
str.indexOf('o', 5);     // 7（从索引5开始查找）
str.indexOf('xyz');      // -1（找不到）
str.indexOf('');          // 0（空字符串在开头）
```

**lastIndexOf()**：
```javascript
const str = 'Hello World';

str.lastIndexOf('o');     // 7（最后一个'o'的位置）
str.lastIndexOf('o', 6);  // 4（从索引6往前找）
str.lastIndexOf('xyz');   // -1（找不到）
```

#### includes() vs startsWith() vs endsWith()

**includes()**（ES2016）：
```javascript
const str = 'Hello World';

str.includes('World');    // true（包含）
str.includes('world');    // false（区分大小写）
str.includes('Hello', 1); // false（从索引1开始查找）
```

**startsWith()**（ES2015）：
```javascript
const str = 'Hello World';

str.startsWith('Hello');  // true（以'Hello'开头）
str.startsWith('World');  // false
str.startsWith('World', 6); // true（从索引6开始判断）
```

**endsWith()**（ES2015）：
```javascript
const str = 'Hello World';

str.endsWith('World');    // true（以'World'结尾）
str.endsWith('Hello');    // false
str.endsWith('Hello', 5); // true（只判断前5个字符）
```

#### replace() vs replaceAll()

**replace()**（ES3）：
```javascript
const str = 'Hello World Hello';

str.replace('Hello', 'Hi');        // 'Hi World Hello'（只替换第一个）
str.replace(/Hello/g, 'Hi');       // 'Hi World Hi'（全局替换，使用正则）
str.replace(/hello/gi, 'Hi');      // 'Hi World Hi'（不区分大小写）
```

**replaceAll()**（ES2021）：
```javascript
const str = 'Hello World Hello';

str.replaceAll('Hello', 'Hi');     // 'Hi World Hi'（替换所有，无需正则）
str.replaceAll(/Hello/g, 'Hi');    // 'Hi World Hi'（正则必须带g标志）
```

**对比**：
- `replace()`：只替换第一个，全局替换需要正则
- `replaceAll()`：直接替换所有，更简洁

#### split() - 分割字符串

**语法**：`str.split(separator, limit?)`

**参数**：
- `separator`：分隔符（字符串或正则）
- `limit`：返回数组的最大长度，可选

**示例**：
```javascript
const str = 'apple,banana,orange';

str.split(',');           // ['apple', 'banana', 'orange']
str.split(',', 2);        // ['apple', 'banana']（限制长度）
str.split('');            // ['a', 'p', 'p', 'l', 'e', ',', ...]（每个字符）
str.split();              // ['apple,banana,orange']（不分割）

// 正则分隔符
'apple,banana;orange'.split(/[,;]/); // ['apple', 'banana', 'orange']

// 特殊情况
'a,b,c,'.split(',');     // ['a', 'b', 'c', '']（末尾空字符串）
',a,b,'.split(',');      // ['', 'a', 'b', '']（开头和末尾）
```

#### trim() / trimStart() / trimEnd() - 去除空白

**trim()**（ES5）：
```javascript
'  hello  '.trim();       // 'hello'（去除两端空白）
```

**trimStart()**（ES2019）：
```javascript
'  hello  '.trimStart();  // 'hello  '（只去除开头空白）
```

**trimEnd()**（ES2019）：
```javascript
'  hello  '.trimEnd();    // '  hello'（只去除结尾空白）
```

#### padStart() / padEnd() - 填充字符串

**语法**：`str.padStart(targetLength, padString?)`

**参数**：
- `targetLength`：目标长度
- `padString`：填充字符串，可选，默认为空格

**示例**：
```javascript
'5'.padStart(3, '0');     // '005'（左侧填充）
'5'.padEnd(3, '0');       // '500'（右侧填充）
'5'.padStart(3);          // '  5'（默认填充空格）

// 实际应用
const num = 42;
num.toString().padStart(5, '0');  // '00042'（数字补零）
```

### 9.3 API 返回值总结

#### 数组查找 API 返回值

| API               | 找到时返回   | 找不到时返回 | ES版本 |
| ----------------- | ------------ | ------------ | ------ |
| `indexOf()`       | 索引（数字） | `-1`         | ES5    |
| `lastIndexOf()`   | 索引（数字） | `-1`         | ES5    |
| `findIndex()`     | 索引（数字） | `-1`         | ES6    |
| `findLastIndex()` | 索引（数字） | `-1`         | ES2023 |
| `includes()`      | `true`       | `false`      | ES2016 |
| `find()`          | 元素         | `undefined`  | ES6    |
| `some()`          | `true`       | `false`      | ES5    |
| `every()`         | `true`       | `false`      | ES5    |

#### 字符串截取方法对比

| 方法                    | 参数           | 负数支持 | 自动交换 | 状态     | 推荐度 |
| ----------------------- | -------------- | -------- | -------- | -------- | ------ |
| `slice(start, end)`     | 开始和结束索引 | ✅        | ❌        | ✅ 推荐   | ⭐⭐⭐⭐⭐  |
| `substring(start, end)` | 开始和结束索引 | ❌        | ✅        | ⚠️ 可用   | ⭐⭐⭐    |
| `substr(start, length)` | 开始索引和长度 | ✅        | ❌        | ❌ 已废弃 | ⭐      |

**最佳实践**：
- ✅ 优先使用 `slice()`（功能最全）
- ⚠️ 避免使用 `substr()`（已废弃）
- ✅ 字符串查找使用 `includes()` 而不是 `indexOf() !== -1`

---

## 十、核心面试题

### 1. Promise 和 async/await 的区别？
- Promise 是对象，async/await 是语法糖
- async/await 代码更简洁，错误处理更方便
- async/await 基于 Promise 实现

### 2. 事件循环的执行顺序？
1. 执行同步代码
2. 执行所有微任务
3. 执行一个宏任务
4. 重复步骤 2-3

### 3. 闭包的应用场景？
- 数据私有化
- 函数工厂
- 防抖和节流
- 模块化

### 4. this 指向的四种规则？
- 默认绑定：`window`（非严格模式）
- 隐式绑定：调用对象
- 显式绑定：`call`/`apply`/`bind`
- new 绑定：实例对象

### 5. Map 和 Object 的区别？
- Map 键可以是任意类型，Object 键只能是字符串/Symbol
- Map 有 `size` 属性，Object 需要手动计算
- Map 保持插入顺序，Object ES6 后也保持
- Map 无原型，Object 有原型

### 6. 如何避免内存泄漏？
- 避免全局变量
- 及时清除事件监听器
- 及时清除定时器
- 闭包使用后置 null
- 使用 WeakMap/WeakSet

### 7. ES6+ 新特性有哪些？
- ES6：let/const、解构、箭头函数、Promise、Class
- ES7：includes、指数运算符
- ES8：async/await、Object.entries/values
- ES9：for-await-of、Promise.finally
- ES10：flat/flatMap、Object.fromEntries
- ES11：可选链、空值合并、BigInt
- ES12：Promise.any、逻辑赋值
- ES13：顶层 await、类字段、Array.at
