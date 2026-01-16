# js进阶

## 异步加载和延迟加载
- 异步加载的方案： 动态插入 script 标签

- 通过 ajax 去获取 js 代码，然后通过 eval 执行

- script 标签上添加 defer 或者 async 属性

- 创建并插入 iframe，让它异步执行 js

- 延迟加载：有些 js 代码并不是页面初始化的时候就立刻需要的，而稍后的某些情况才需要的
## js延迟加载的方式
- 使用defer属性: 在script标签中添加defer属性，可以让浏览器在解析HTML时异步下载脚本，`但会保证所有带有defer属性的脚本按照在文档中出现的顺序执行，且都在DOMContentLoaded事件触发之前执行`。
```javascript
<script src="path/to/script.js" defer></script>
```
- 使用async属性: 同样在script标签中使用，async属性使得脚本异步加载并执行，`不保证执行顺序，也不阻塞页面渲染。脚本一旦加载完毕就会立即执行，可能在DOMContentLoaded事件触发之前或之后`。
```javascript
<script src="path/to/script.js" async></script>
```
- 动态创建script标签: 通过JavaScript在文档加载完成后动态插入script标签，可以实现脚本的延迟加载。
```javascript
var script = document.createElement('script');
script.src = 'path/to/script.js';
document.body.appendChild(script);
```
- 使用setTimeout或requestAnimationFrame进行延时执行: 如果目的是在页面加载一段时间后再执行脚本，可以使用setTimeout设置延迟时间，或者使用requestAnimationFrame在下一次重绘前执行脚本，但这并不是典型的延迟加载脚本的方式，主要用于控制执行时机。
- 需加载（懒加载）: 根据用户的交互或滚动位置，通过AJAX请求或其他方式动态加载必要的JS文件，这种方式适用于大型应用，确保只有在需要特定功能时才加载对应的脚本。



## 理解堆栈溢出和内存泄漏的原理，如何防止
谨慎使用闭包 
- a、在业务不需要用到的内部函数，可以重构在函数外，实现解除闭包.
- b、闭包内，局部变量使用后或不再需要，及时的清除掉

- 减少不必要的全局变量，如果用了，最好在声明周期钩子中或再函数调用之前，及时的清除掉.
- 减少生命周期较长的对象，及时对无用的数据进行释放销毁.
- 避免创建过多的对象，对不用的对象及时的释放.
- 对注册的事件，再不用的时候，及时的解耦.释放资源.
## 说说你对闭包的理解

1. 概念

通过 chrome 开发者调试工具得知: 闭包本质是内部函数中的一个容器(非 js 对象), 这个容器中包含了引用的局部变量

2. 产生原因

- 函数嵌套
- 内部函数引用外部函数的局部变量
- 调用外部函数时就会产生闭包

3. 闭包的生命周期

- 产生：当内部函数创建时

- 死亡：当内部函数没有变量引用，成为垃圾对象，就会自动被 GC(垃圾回收机制)自动回收

4. 闭包作用：

- 延长局部变量生命周期（活的久点）
- 让函数外部可以间接操作函数内部的局部变量数据

5. 闭包在项目中的应用

- React 中复用函数的手段，高阶函数形式
- 实际开发中很少使用闭包，我一般研究源码时发现闭包的场景，vue2 响应式原理中数据劫持阶段，内部通过闭包形式保存 dep 对象，这个 dep 对象在 vue2 响应式原理非常重要
  - 源码：https://github.com/vuejs/vue/blob/main/src/core/observer/index.ts 128 行开始

## ES6常用新语法

1. 简单的语法

- const 与 let
- 解构赋值
- 形参默认值
- 扩展运算符: ...
- 模板字符串
- 对象的属性与方法简写
- 模块化语法

2. 比较复杂的语法

- 箭头函数
  - 编码简洁
  - 不能通过 new 来创建实例对象，没有 constructor 方法
  - 内部没有 arguments, 可以通过 rest 参数来代替
  - 没有自己的 this, 使用外部作用域中的 this, 不能通过 bind 来绑定 this
  - 说到 this 指向，平时我专门总结过 this 指向
    - ...
- 还有 class 与 extends
  - 主要用来做继承的，是构造函数+原型的语法糖
  - 平时在项目主要还是通过原型的方式去继承：比如$bus
- promise / generator / async & await（引申 js 事件循环机制）
  - promise...(细说 promise)
  - promise 并不是解决回调地狱的最佳方案，后面推出了 generator
  - generator 惰性函数（懒），暂停 yield 执行 next，但是使用太复杂了，后面又推出了 async 函数
  - async、await、promise 一起使用，是项目中解决回调地狱的最佳方案
- Proxy（引申 vue2 和 vue3 响应式原理）
  - 可以对对象进行代理，当读取/设置对象上的属性时，会执行相应的 get/Set
  - 这个内容主要在 Vue 响应式原理中使用了，Vue3 响应式通过 Proxy 实现的，原有和新增属性都是响应式。
- Map / Set / WeakMap / WeakSet (引申 vue3 响应式原理)
  - 他们都是新的存储数据的结构
  - Map 类似于对象，存储 key-value 的结构，特点：1. 有序 2. key 是任意类型
  - Set 类似于数组，特点：1. 值是唯一的
  - WeakMap 类似于 Map，存储 key-value 的结构，特点：1. 有序 2. key 必须是对象类型 3. 一旦 key 没有外部引用，会自动删除
  - WeakSet 类似于 Set，特点：1. 值是唯一的 2. 值必须是对象类型 3. 一旦值没有外部引用，会自动删除

## promise

1.  概念

异步代码解决方案，用于解决回调地狱问题。

2.  promise 对象内部有 3 种状态

- pending 初始化状态
- resolved / fulfilled 成功状态
- rejected 失败状态

状态只能变化一次，只能有以下两种变化：

- pending --> resolved
- pending --> rejected

状态发生变化后不能在改了。

3.  如何改变 promise 的状态

- 调用 resolve(), 改成成功状态
- 调用 reject(), 改为失败状态
- throw new Error(), 改为失败状态

4.  promise 实例对象上的方法

- then 接受两个回调（一般只接受一个），第一个是成功回调，第二个是失败回调
- catch 接受一个回调，是失败回调
- finally 接受一个回调，不管成功/失败都会触发

5.  Promise 构造函数上的方法

- Promise.resolve() 返回一个成功的 promise 对象
  - 也可能返回失败的 promise 对象，比如 Promise.resolve(Promise.reject())
- Promise.reject() 返回一个失败的 promise 对象
- Promise.all([promise1, promise2, ...]) 只有所有 promise 成功才成功，只要有一个 promise 失败就会失败
- Promise.allSettled([promise1, promise2, ...]) 只要所有 promise 状态发生变化就成功，结果值包含所有 promise 的结果值（不管成功/失败）
- Promise.race([promise1, promise2, ...]) 只要有一个 promise 成功/失败，就成功/失败。

6.  应用

- 在项目中一般是使用 axios 发送请求时会使用，返回值是一个 promise 对象，结合 async await 来处理
- 如果同时要发送多个请求的话，可以使用 Promise.all() 方法来处理
 ## 模块化语法

1. Commonjs 模块化语法

- 主要用于 NodeJS 端
- 语法：
  - 引入：require
  - 暴露：exports / module.exports

2. ES6 模块化语法

- 主要用于浏览器端
- 语法：
- 引入：import
- 暴露：export
- 总结

  - 如果模块采用默认暴露：import xxx from 'xxx'
  - 如果模块采用分别/统一暴露：
    - 如果需要引入模块部分内容：import { xxx } from 'xxx'
    - 如果需要引入模块全部内容：`import * as xxx from 'xxx'`

- 扩展
  - 无论什么暴露方式，暴露的一定是一个对象
    - 默认暴露：对象上添加一个 default 属性，值为暴露的内容
    - 分别暴露/统一暴露：直接在对象上暴露内容
  - `import { xxx } from './xxx'` 引入暴露内容的某个属性（部分）
  - `import xxx from './xxx'` 引入暴露内容的 default 属性（只要 default）
  - `import * as xxx from './xxx'` 引入暴露内容的所有内容（全部）

## 箭头函数

- 编码简洁
- 不能通过 new 来创建实例对象，没有 constructor 方法
- 内部没有 arguments, 可以通过 rest 参数来代替
- 没有自己的 this, 使用外部作用域中的 this, 不能通过 bind 来绑定 this
- 更方便的绑定this
- 说到 this 指向，平时我专门总结过 this 指向

## this指向

普通情况下，this 指向看函数的调用方式：

1. 直接调用（默认绑定），this 指向 window, 严格模式（'use strict'）下指向 undefined

2. 对象调用函数（隐式绑定），this 指向调用的对象

3. call/apply/bind 调用函数（显示绑定），this 指向传入第一个参数

- call/apply/bind 区别和联系：
  - call/apply 都会立即执行函数，bind 返回一个新函数
  - call/apply 执行函数时函数的 this 指向第一个参数，bind 方法返回的新函数的 this 指向第一个参数，原函数不变
  - call/bind 方法传参是一致的, 可以 n 个参数, apply 只能两个参数，第二个参数是数组

4. new 调用函数，this 指向生成的实例对象

特殊情况：

1. 箭头函数：this 指向包裹它离它最近的函数的 this（指向外部函数的 this）

2. 回调函数：

- 定时器回调函数：window，严格模式下 undefined
- DOM 事件回调函数：指向绑定的事件的 DOM 元素
- Vue 生命周期函数 / methods 中的函数 / 微信小程序生命周期函数：指向组件实例对象

应用：
- 将伪数组转化为数组（含有length属性的对象，dom节点, 函数的参数arguments）
- 数组拼接，添加
```js
let arr1 = [1,2,3];let arr2 = [4,5,6];
//数组的concat方法：返回一个新的数组
let arr3 = arr1.concat(arr2); 
console.log(arr3); // [1, 2, 3, 4, 5, 6]
console.log(arr1);// [1, 2, 3] 不变
console.log(arr2); // [4, 5, 6] 不变
// 用 apply方法
[].push.apply(arr1,arr2); 
// 给arr1添加arr2
console.log(arr1); // [1, 2, 3, 4, 5, 6]
console.log(arr2); // 不变
```
- 判断变量类型
- 利用call和apply做继承
```js
function Animal(name){ this.name = name; this.showName = function(){ console.log(this.name); } } 
function Cat(name){ Animal.call(this, name); } 
// Animal.call(this) 的意思就是使用this对象代替Animal对象，
那么// Cat中不就有Animal的所有属性和方法了吗，Cat对象就能够直接调用Animal的方法以及属性了
var cat = new Cat("TONY"); 
cat.showName(); //TONY

```

## 浅度克隆和深度克隆

1. 浅度克隆

- object.assign()
- 扩展运算符: { ...obj }
- Array.prototype.slice()
- Array.prototype.concat()

2. 深度克隆

- JSON.parse(JSON.stringify())
- 自定义深度克隆
- lodash 中 cloneDeep

3. 区别

- 浅度克隆: 对当前对象进行克隆，基本类型克隆生成新值，引用类型克隆的是地址值（所以当修改对象内部引用类型数据时，原对象也会发生变化）
- 深度克隆: 会完全复制整个对象，包括这个对象所包含的内部对象（所以不管如何修改对象数据，原对象都不会发生变化）。

4. 深度克隆应用

- 权限管理功能中使用深度克隆克隆了异步路由表

## 谈谈 ajax

可以发送异步请求，进行局部页面更新

流程：

1. new XMLHttpRequest() 来创建 xhr 对象
2. 通过 xhr 调用 open 方法，设置请求方式和请求地址（请求地址可以添加查询字符串参数）
3. 通过 xhr.send 方法发送请求（可以携带请求体参数）
4. 通过 xhr.onreadystatechange 或 onload 事件监听响应回来的结果，往往需要判断 xhr 的响应状态码是否 2 开头，来判断请求成功还是失败


## js的事件循环机制  <a name="js的事件循环机制"></a>
我们常见的JavaScript运行时（runtime）有两个，一个是浏览器环境，一个是Node.js环境
JavaScript 事件循环机制分为浏览器和 Node 事件循环机制，两者的实现技术不一样。

浏览器 Event Loop 是 HTML 中定义的规范，Node Event Loop 是由 libuv 库实现

浏览器的事件循环机制
### 一、为什么JavaScript是单线程？
背景

JavaScript的单线程，与它的用途有关。

作为浏览器脚本语言，JavaScript的主要用途是与用户互动，以及操作DOM。这决定了它只能是单线程，否则会带来很复杂的同步问题。

比如，假定JavaScript同时有两个线程，一个线程在某个DOM节点上添加内容，另一个线程删除了这个节点，这时浏览器应该以哪个线程为准？

所以，为了避免复杂性，从一诞生，JavaScript就是单线程，这已经成了这门语言的核心特征，将来也不会改变。

为了利用多核CPU的计算能力，HTML5提出Web Worker标准，允许JavaScript脚本创建多个线程，但是子线程完全受主线程控制，且不得操作DOM。所以，这个新标准并没有改变JavaScript单线程的本质。

### 二、任务队列
背景

为了实现主线程的不阻塞，Event Loop这样的方案应运而生

概念

由于上面的背景，所有任务可以分成两种，

同步任务（synchronous）
同步任务指的是，在主线程上排队执行的任务，只有前一个任务执行完毕，才能执行后一个任务。同步任务执行时会形成一个任务栈。
异步任务（asynchronous）。
异步任务指的是，不进入主线程，而由浏览器其他线程执行(比如ajax-->http 异步线程, onclick-->浏览器事件线程)，执行完毕后，把回调函数放入"任务队列"（task queue）的任务。（主线程执行栈执行完毕后，会去任务队列查看是否有任务需要处理）
异步任务又分为宏任务(macro-task-->Task)和微任务(micro-task-->Job)
- 宏任务: 一个event loop有一个或者多个task队列，Task任务源非常宽泛，`比如ajax的onload，click事件`，基本上我们经常绑定的各种事件都是Task任务源，还有数据库操作（IndexedDB ），`需要注意的是setTimeout、setInterval、setImmediate也是宏任务`。总结来说宏任务有：++setTimeout++ ++setInterval++ ++setImmediate++ ++I/O++ ++UI rendering++
- 微任务: 微任务队列和宏任务队列有些相似，都是先进先出的队列，由指定的任务源去提供任务，不同的是一个
event loop里只有一个microtask 队列。另外microtask执行时机和Macrotasks也有所差异。`总结来说微任务有：++process.nextTick++ ++promises++ ++Object.observe++ ++MutationObserver++`
执行时机: `在执行栈执行完毕时会立刻先处理所有微任务队列中的事件，清空微任务之后，再去宏任务队列中取出一个事件`。同一次事件循环中，微任务永远在宏任务之前执行。
任务队列：可以理解为一个静态的队列存储结构，非线程，只做存储，里面存的是一堆异步成功后的回调函数，肯定是先成功的异步的回调函数在队列的前面，后成功的在后面。

注意：++是异步成功后，才把其回调函数扔进队列中++，而不是一开始就把所有异步的回调函数扔进队列。比如setTimeout 3秒后执行一个函数，那么这个函数是在3秒后才进队列的。

宏任务与微任务执行机制：

在一个事件循环中，异步事件返回结果后会被放到一个任务队列中。然而，根据这个异步事件的类型，这个事件实际上会被对应的宏任务队列或者微任务队列中去。

并且在当前执行栈为空的时候，主线程会查看微任务队列是否有事件存在。

如果不存在，那么再去宏任务队列中取出一个事件并把对应的回到加入当前执行栈；
如果存在，则会依次执行队列中事件对应的回调，直到微任务队列为空，然后去宏任务队列中取出最前面的一个事件，把对应的回调加入当前执行栈，执行完成后再次执行清空微任务队列...如此反复，进入循环
如果微任务的回调是自身(递归调用)，则会一直执行微任务队列，导致阻塞。
++这是因为微任务队列总是在执行后返回到事件循环之前，并继续清空其他微任务++
上面的例子: 是每次微任务执行过后又在微任务队列添加微任务，那么事件循环会一直处理微任务，例子3
与上面相对，宏任务的回调是自身(递归调用)，既不会阻塞也不会堆栈溢出
因为宏任务在单个循环周期中一次一个地推入堆栈。主线程执行完毕后，宏任务队列的回调被推入执行栈执行，执行时再次给宏任务队列添加任务，如此反复，所以执行栈最多只有一个任务，所以不会堆栈溢出
例子1：

```js
setTimeout(function () {
    console.log(1);
});

new Promise(function(resolve,reject){
    console.log(2)
    resolve(3)
}).then(function(val){
    console.log(val);
})

// 2
// 3
// 1
```
例子2：

```js
setTimeout(function () {
  console.log(1);
});
new Promise(function (resolve, reject) {
  console.log(2)
  resolve(3)
}).then(function (val) {
  console.log(val);
})
console.log(4);

// 2
// 4
// 3
// 1
```
例子3
```js

// 每次调用'foo'都会继续在微任务队列上添加另一个'foo'回调，因此事件循环无法继续处理其他事件（滚动，单击等），直到该队列完全清空为止。因此，它会阻止渲染。
function foo() {
    return Promise.resolve().then(foo)
}
```
例子4

```js
function foo() {
  setTimeout(foo, 0);
};  
https://mp.weixin.qq.com/s/qnBR5uoTn15-bpC8Zah80Q 例子3，4来源
先执行script的第一条同步代码，即new Promise中的console.log(2),then后面的不执行, 因为它属于微任务
然后执行第二条同步代码console.log(4)
执行完script同步代码后，执行异步代码的微任务，console.log(3)，没有其他微任务了。
执行异步代码的宏任务，定时器，console.log(1)。
```
### 三、Event Loop(异步执行的运行机制)
主线程从"任务队列"中读取事件，这个过程是循环不断的，所以整个的这种运行机制又称为Event Loop（事件循环）

所有同步任务都在主线程上执行，形成一个执行栈（execution context stack）。
异步任务执行有结果后，把相应的回调函数放入"任务队列"之中。
++一旦"执行栈"中的所有同步任务执行完毕，系统就会读取"任务队列++"，看看里面有哪些任务（微任务-->宏任务）。那些对应的异步任务，于是结束等待状态，进入执行栈，开始执行。
主线程不断重复上面的第三步，这个过程形成事件循环机制。


image

上图中，主线程运行的时候，产生堆（heap）和栈（stack），栈中的代码调用各种外部API(可能由其他浏览器其他线程辅助)，它们在"任务队列"中加入各种事件（click，load，done）。只要栈中的代码执行完毕，主线程就会去读取"任务队列"，依次执行那些事件所对应的回调函数。
heap（堆）是用户主动请求而划分出来的内存区域，比如你new Object()，就是将一个对象存入堆中，可以理解为heap存对象。
stack（栈）是由于函数运行而临时占用的内存区域，函数都存放在栈里。
例子1：事件循环执行过程：

```js
1 var a = 2;

2 setTimeout(fun A)

3 ajax(fun B)

4 console.log()

5 dom.onclick(func C)
```
主线程在运行这段代码时，碰到2 setTimeout(fun A)，把这行代码交给 定时器触发线程 去执行
碰到3 ajax(fun B)，把这行代码交给 http 异步线程 去执行
碰到5 dom.onclick(func C) ，把这行代码交给 浏览器事件线程 去执行
注意：这几个异步代码的回调函数fun A，fun B，fun C，各自的线程都会保存，等待未来加入任务队列，再等待主线程执行

所以这些线程主要干两件事：

执行主线程扔过来的异步代码，并执行代码
保存着回调函数，异步代码执行成功后，将回调函数推入到任务队列中
问题

所以导致一个现象：
对于setTimeout，setInterval的定时，不一定完全按照设想的时间的，因为主线程里的代码可能复杂到执行很久，所以会发生你定时3秒后执行，实际上是3.5秒后执行（主线程花费了0.5秒）
## 宏任务和微任务分别有哪些
宏任务： setTimeout，setInterval，setImmediate (Node独有)，requestAnimationFrame (浏览器独有)，I/O，UI rendering (浏览器独有)
微任务： process.nextTick (Node独有)，Promise，Object.observe，MutationObserver


## 可以快速分析一个复杂的异步嵌套逻辑，并掌握分析方法
```js
// 执行顺序，先微队列，后宏队列。
console.log(1);
setTimeout(() => {
  console.log(2);
  setTimeout(() => {
    console.log(8);
  })
  Promise.resolve().then(() => {
    console.log(3)
  });
});
new Promise((resolve, reject) => {
  console.log(4)
  setTimeout(() => {
    console.log(10);
  })
  resolve()
}).then(() => {
  console.log(5);
  Promise.resolve().then(() => {
    console.log(11)
  });
  setTimeout(() => {
    console.log(13);
  })
})
setTimeout(() => {
  Promise.resolve().then(() => {
    console.log(9)
  });
  console.log(6);
  setTimeout(() => {
    console.log(12);
  })
})
console.log(7);


// 栈区（stack）
console.log(1);
console.log(4);
console.log(7);
//////////
console.log(5);
/////////
console.log(11);
/////////
console.log(2);
console.log(10);
console.log(6);
console.log(13);
////////
console.log(3)
console.log(9)
////////
console.log(8);
console.log(12);
```
## Map用法

### 基本特性
```javascript:webview-panel/webview-8535bebe-e5a1-4533-8303-8b256b9d663d
// 创建空Map
const map = new Map();

// 使用二维数组初始化
const initMap = new Map([
  ['name', 'Alice'],
  [1, '数字键'],
  [true, '布尔键']
]);
```

### 核心方法
#### 1. 添加/更新元素
```javascript
map.set(key, value); // 支持链式调用
map.set({}, '对象键')
   .set(() => {}, '函数键')
   .set(NaN, '特殊键');
```

#### 2. 获取元素
```javascript
map.get('name');    // 'Alice'
map.get(NaN);       // '特殊键'
map.get('notExist');// undefined
```

#### 3. 存在性检查
```javascript
map.has('name');  // true
map.has(999);     // false
```

#### 4. 删除元素
```javascript
map.delete('name'); // 删除成功返回true
map.clear();        // 清空整个Map
```

#### 5. 大小获取
```javascript
map.size; // 返回键值对数量（实时计算）
```

### 遍历方法
```javascript
// 遍历键
for (const key of map.keys()) {
  console.log(key);
}

// 遍历值
for (const value of map.values()) {
  console.log(value);
}

// 遍历键值对
for (const [key, value] of map.entries()) {
  console.log(key, value);
}

// forEach遍历
map.forEach((value, key) => {
  console.log(key, value);
});
```

### 特殊用法
#### 对象键处理
```javascript
const objKey = { id: 1 };
map.set(objKey, '对象关联数据');
console.log(map.get(objKey)); // '对象关联数据'

// 不同对象实例不相等
console.log(map.get({ id: 1 })); // undefined
```

#### NaN处理
```javascript
map.set(NaN, '特殊值');
console.log(map.get(NaN)); // '特殊值'（Map中NaN等于自身）
```

### 性能特性
| 操作        | 时间复杂度 |
|-----------|--------|
| set()     | O(1)   |
| get()     | O(1)   |
| has()     | O(1)   |
| delete()  | O(1)   |

### 与Object对比
| 特性                | Map              | Object           |
|-------------------|------------------|------------------|
| 键类型               | 任意类型             | String/Symbol    |
| 元素顺序              | 插入顺序             | ES6后保留字符串键顺序   |
| 大小获取              | .size 属性         | 手动计算            |
| 原型污染风险            | 无                | 可能（如constructor） |
| 序列化               | 不能直接JSON序列化      | 支持JSON序列化       |
| 默认键               | 无                | 有原型属性           |
| 迭代方式              | 直接可迭代            | 需要获取keys后迭代     |
| 内存回收              | 强引用              | 强引用             |
| 适合场景              | 频繁增删、需要复杂键、维护顺序 | 静态键值、需要序列化     |

### 使用场景
1. 需要键值类型丰富的字典
2. 需要维护插入顺序的集合
3. 高频添加/删除操作的场景
4. 需要避免对象原型污染的情况
5. 需要精确统计元素数量的场景

### 扩展技巧
```javascript
// 快速克隆Map
const original = new Map([[1, 'a'], [2, 'b']]);
const clone = new Map(original);

// 数组合并
const map1 = new Map([[1, 'a']]);
const map2 = new Map([[2, 'b']]);
const merged = new Map([...map1, ...map2]);

// 配合数组处理
const kvArray = [['key1', 'value1'], ['key2', 'value2']];
const mapFromArray = new Map(kvArray);
const arrayFromMap = Array.from(mapFromArray);
```

### 注意事项
1. 内存管理：Map对键是强引用，可能阻止垃圾回收
2. 类型转换：键的比较基于严格相等（===），但NaN例外
3. 迭代顺序：按照键值对的插入顺序迭代
4. 浏览器兼容：IE11及以下不支持，需polyfill

## 函数柯里化
什么是柯里化

函数柯里化的定义：是把接受多个参数的函数变换成接受一个单一参数（最初函数的第一个参数）的函数，并且返回接受余下的参数而且返回结果的新函数的技术。

例如我们在使用ajax的时候url是不变的，但是传递的参数不同将返回不同的数据，那么我们就可以把url封装到一个函数里然后返回一个带参数的函数，通过返回的函数去处理不同参数的情况
```js
function requestCurry(url){
    return function(params){
        return new Promise((resolve,reject)=>{
            axios({
                method:"post",
                url:url,
                data:{
                    ...params
                }
            }).then(res=>{
                resolve(res)
            }).catch(err=>{
                reject(err)
            })
        })
    }
}

const userRequest = requestCurry("http://192.168.0.0.1/user")
//请求参数code为112
userRequest({
    code:112
}).then(res=>{
    //请求成功
    console.log(res)
})
//请求参数code为114
userRequest({
    code:114
}).then(res=>{
    //请求成功
    console.log(res)
})
```
上面的两个请求参数不同，但是请求的地址url是固定不变的。这就是柯里化，将不变的参数通过闭包的形式封装起来，然后去处理可变的参数
lodash中有一个柯里化方法curry。举个官网的例子：
```js
var abc = function(a, b, c) {
  return [a, b, c];
};
var curried = _.curry(abc);
curried(1)(2)(3);
// => [1, 2, 3]
curried(1, 2)(3);
// => [1, 2, 3]
curried(1, 2, 3);
// => [1, 2, 3]
```