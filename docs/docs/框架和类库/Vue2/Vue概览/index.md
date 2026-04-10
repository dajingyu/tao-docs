# vue（Vue 2 侧概览）

> **Vue 2 与 Vue 3 对照**（生命周期映射、通信/API 差异等）见：[Vue2与Vue3对比](../../Vue2与Vue3对比/index.md)。

## 生命周期函数（Vue 2 选项式）

常用钩子：`beforeCreate`、`created`、`beforeMount`、`mounted`、`beforeUpdate`、`updated`、`beforeDestroy`、`destroyed`、`errorCaptured`。

被 `keep-alive` 缓存的组件额外具有：`activated`、`deactivated`。

## 组件间通信（Vue 2 常用）

- **props**：父 → 子。
- **`v-bind:xxx.sync`**：父子双向（绑定 `xxx` 与 `update:xxx` 事件）。
- **自定义事件**：子 → 父；组件上监听默认多为**自定义事件**，监听原生 DOM 事件常需 **`.native`**。
- **Vuex**：多组件共享状态（兄弟、祖孙等场景常见）。
- **`v-model`**：在 Vue 2 组件上常见为 **`value` + `input`**（与具体封装有关）。
- **插槽**：默认插槽、具名插槽、作用域插槽。
- **全局事件总线**：如 `$bus`（自建）。
- **`$parent` / `$children` / `$refs`**：获取实例或子组件。
- **`$attrs` / `$listeners`**：透传属性与监听（Vue 2 中二者分离）。
- **`provide` / `inject`**：跨层级注入。
- **离线存储**：`localStorage`、`sessionStorage`。

## 全局状态管理工具
### Vuex

一个集中式状态管理方案，通常用于管理多个组件共享的状态数据。

开发时需要定义主模块和其他分模块

主模块主要定义 modules 属性用来汇总其他分模块

其他分模块主要定义 `state`、`getters`、`actions`、`mutations`、`namespaced`。

- state 模块管理的状态数据
- getters 只读计算属性数据
- actions 一般用来与服务器进行交互的函数，比如：发送请求
- mutations 直接更新数据的函数
- namespaced 的值为 true，开启命名空间，这样每个 vuex 模块的内容就被隔离，不会互相影响。

组件读取/更新 vuex 数据有两种方式，一种通过`$store`，一种 map 函数形式

一般如果数据只用一两次，我会用$store，比较简单。数据比较频繁使用，用 map 函数形式

### Pinia

一个集中式状态管理方案，通常用于管理多个组件共享的状态数据。

相对于 Vuex 来说，pinia 优点：

- 没有 mutations （流程更简洁）
- Typescript 支持更友好
- pinia 模块定义即可使用，不用汇总

开发时需要定义主模块和其他分模块：主模块定义好后，就定义分模块即可，不用汇总

分模块主要由以下内容：

- state 模块管理的状态数据
- getters 只读计算属性数据
- actions 与服务器进行交互（发送请求），同时更新数据

组件引入分模块暴露的 useXxxStore 函数，得到 Store 对象，即可操作数据和方法了

- 一般如果我需要直接更新一个数据：就直接操作数据即可
- 如果我需要直接更新多个数据：store.$patch 方法更新数据
- 如果我需要更新数据并且发送请求：就需要定义 action 函数，通过 store 调用 action 函数来更新

（**与 Vue 3 的差异清单**已迁至 [综合差异速查](../../Vue2与Vue3对比/综合差异速查.md)。）

## Vue的指令

1. 常用指令

- v-if / v-else-if / v-else 条件渲染（控制元素的显示和隐藏）
- v-show 条件渲染（控制元素的显示和隐藏）
  - v-if 和 v-show 区别：
    - v-if 隐藏时，销毁元素（卸载组件）
    - v-show 隐藏时，通过 display:none 来隐藏的
    - 结论：频繁切换用 v-show，不频繁用 v-if
- v-for 遍历展示（列表渲染）
  - key 属性作用：在 diff 算法中，尽可能复用相同 key 的元素，更新性能更好
  - key 属性取值：一般用 id，用 index 可能导致更新性能不好
  - **Vue 2** 中同节点 **`v-for` 优先级高于 `v-if`**（不建议同节点混用；与 Vue 3 的差异见 [综合差异速查](../../Vue2与Vue3对比/综合差异速查.md)）
- v-on 绑定事件 @
  - 事件修饰符 .prevent .stop .once .self
  - 按键修饰符 .enter .13
- v-model 双向数据绑定
  - 双向数据绑定原理
    - 给普通 input 元素（text）绑定，绑定的是 value 属性和 input 事件
    - 给单选（radio）或多选（checkout）绑定，绑定的是 checked 属性和 change 事件
    - 给下拉列表（select）绑定，绑定的是 value 属性和 change 事件
    - 给组件绑定：在 **Vue 2** 中常与**普通表单元素**类似（`value` + `input` 等，依组件实现而定）
- v-bind 单向数据绑定（强制绑定数据） :
- v-slot 插槽 #
  - 默认插槽、具名插槽和作用域插槽

2. 不常用指令

- v-text 设置元素 textContent
- v-html 设置元素 innerHTML
- v-once 元素只解析渲染一次，后续再也不变了
- v-pre 跳过解析，直接渲染最原始的内容
- v-cloak 防止解析时渲染表达式(用于隐藏尚未完成编译的 DOM 模板。)


## VueRouter 

1. 概念
   用来实现 Vue 的单页面应用（single page web application，SPA）。

单页面应用特点：

- 整个应用只有一个完整页面，所有更新只是这个页面的局部渲染
- 点击页面链接不会刷新整个页面，只会更新浏览历史记录和页面局部更新

2. 路由两种模式

- hash
  - 特点
    - hash 路径带 #，# 后面的值（路由路径）不会提交到 server 端；
    - hash 可以改变 url ，准确来说改变的是 # 后面的值，页面不会刷新；
    - 兼容性更好, IE6+。
  - 原理
    - hash 通过 window.location.hash 的方式，实现路由跳转的功能。
    - hash 通过 window.onhashchange 的方式，来监听 hash 的改变，借此实现无刷新跳转的功能。
- history
  - 特点
    - history 路径不带 #，更美观。
    - history 可以改变 url ，改变的是整个 url，页面不会刷新；
    - 兼容性稍差, IE10+；
    - 页面刷新时，history 可能会出现 404 问题。
  - 原理
    - history 通过 window.history.pushState / replaceState 等方式，实现路由跳转的功能。
    - history 通过 window.onpopstate 的方式，来监听 url 的改变，借此实现无刷新跳转的功能。

3. 基本内容

- 提供两个组件
  - router-link 用来路由跳转（声明式导航）
  - router-view 用来加载渲染路由组件
- 提供两个属性
  - $router 用来路由跳转（编程式导航）
  - $route 用来获取路由参数和路由路径

4. 路由跳转两种方式

- 声明式导航 router-link
- 编程式导航 this.$router.push/replace/go

5. 路由传参

- query
- params
- meta

6. 路由导航守卫

- 全局路由导航守卫
  - beforeEach
  - afterEach
- 路由独享守卫
- 组件独享守卫

最重要的是全局路由导航守卫的 beforeEach

主要用来：权限管理功能，控制用户的访问权限

7. 路由懒加载

通过 import 动态加载组件，实现组件懒加载

内部做了两件事：

- 代码分割：将路由组件单独打包成一个 js 文件
- 按需加载：需要使用这个路由组件时，才会加载对应的 js 文件

## nextTick 方法的原理（Vue 2）

> Vue 3 中 `nextTick` 行为与动机对照见 [综合差异速查](../../Vue2与Vue3对比/综合差异速查.md#nexttick-差异原理层面)。

1. 定义一个数组（callbacks）用来存储回调函数
2. 定义一个用来遍历数组，执行回调函数的方法（flushCallbacks）
3. 定义一个用来将执行回调函数的方法添加到异步队列去的方法（timerFunc）

- 这个方法内部会通过 4 种方式来操作：Promise、MutationObserver、setImmediate、setTimeout
- 会从上到下依次判断来选择，一旦选择前面的方案，后面就不看了

4. 到此准备工作完成了，接下来组件会调用 nextTick 方法

5. 调用 nextTick 方法时，会将回调函数添加到数组（callbacks）中，在通过 timerFunc 将执行回调函数的方法 flushCallbacks 添加到异步队列等待将来执行
6. 等主线程执行完所有同步代码，就会执行异步代码，此时会就执行 flushCallbacks 函数
7. 执行 flushCallbacks 函数就会遍历所有回调函数依次执行

总结：

所以 nextTick 方法的真正理解就是将回调函数添加到异步队列中，等待将来执行。

它之所以可以等 DOM 元素渲染完成才触发回调函数，是因为我们先更新响应式数据，此时内部会将更新用户界面的方法通过 nextTick 添加到异步队列去，在调用 nextTick 方法，会将其他代码也添加到异步队列去，队列先进先出，所以先更新用户界面，在执行其他代码，此时就能操作更新后的 DOM 元素了

## 双向数据绑定原理 

v-model 主要用于双向数据绑定（收集表单数据），它给元素绑定时，不同元素做法不一样：

1. 如果是文本类型元素（input 和 textarea）：绑定 value 属性和 input 事件；
2. 如果是单选或多选元素（input type="checkbox" 和 input type="radio"）：绑定 checked 属性和 change 事件；
3. 如果是下拉列表元素（select）：绑定 value 属性和 change 事件；
4. 如果不是上述这些元素（比如组件），会按照文本类型元素处理。

## 响应式原理（Vue 2）<a name="响应式原理"></a>

完整分点说明见：[Vue2 响应式原理](../Vue2/响应式原理.md)（数据代理、数据劫持、首次渲染与更新链路）。

## 虚拟 DOM：与 Vue 3 的对照

Vue 2 / Vue 3 在虚拟 DOM 与编译策略上的差异见：[综合差异速查](../../Vue2与Vue3对比/综合差异速查.md#虚拟-dom-与更新策略对照)。

##  Vue2中虚拟DOMDiff算法 

1. Diff 算法简述

初始化渲染阶段会生成一个虚拟 DOM 树（旧树），更新数据时会生成一个新的虚拟 DOM 树，新旧虚拟 DOM 树进行比较，找到不同的内容，从而更新，这就是虚拟 DOM Diff 算法做的事情

2. 虚拟 DOM 树简述

虚拟 DOM 树就是一个对象，这个对象通过特定属性代表真实 DOM 元素的信息，比如：tag 代表元素标签，data 代表元素属性，children 代表子元素

3. Diff 算法详细流程

Diff 算法一共会经历三个函数：patch、patchVnode、updateChildren

其中最重要的是 updateChildren 方法：

它是对相同层级的所有子节点进行 diff（比较），整体流程是从两端到中间遍历，一个一个元素进行比较，从而更新。

具体来说：

- 定义 4 个指针，分别指向旧的虚拟 DOM 树开头，也叫做旧前，指向旧的虚拟 DOM 树结尾，叫做旧后，新的虚拟 DOM 树开头，叫做新前，新的虚拟 DOM 树结尾，叫做新后

- 整个遍历过程（详细版本）：

  - 判断旧前元素是否存在，不存在就更新下标（旧前++），存在就下一步
  - 判断旧后元素是否存在，不存在就更新下标（旧后--）存在就下一步
  - 判断旧前和新前元素是否一致（sameVnode：看 key 和 tag），如果一致就会进一步比较（patchVnode），（新前旧前）下标++，不一致就下一步
  - 判断旧后和新后元素是否一致（sameVnode：看 key 和 tag），如果一致就会进一步比较（patchVnode），（新后旧后）下标--，不一致就下一步
  - 判断旧前和新后元素是否一致（sameVnode：看 key 和 tag），如果一致就会进一步比较（patchVnode），更新下标（新后--旧前++），移动 DOM 元素位置（将旧前插入到旧后的后面），不一致就下一步
  - 判断旧后和新前元素是否一致（sameVnode：看 key 和 tag），如果一致就会进一步比较（patchVnode），更新下标（旧后--新前++），移动 DOM 元素位置（将旧后插入到旧前的前面），不一致就下一步
  - 看 key，提取旧树剩下的子元素的 key 属性，判断新前节点的 key 在不在旧树 key 中，存在就移动 DOM 元素位置，不存在创建新前元素插入页面，更新下标（新前++）

- 整个遍历过程（简化版本）：
  - 旧前新前
  - 旧后新后
  - 旧前新后
  - 旧后新前
  - 看 key
  - 其中 旧前新后 旧后新前 看 key 更新 DOM 元素后，还需要移动 DOM 元素位置

到此更新基本完成。（后面还有两个流程，也可以说）

## 如何理解Vue中的模板编译原理？
- 这个问题的核心是如何将template转换成render函数。
- 将template模块转换成ast语法书 - parserHTML
- 对静态语法做标记（某些节点不改变）
- 重新生成代码 - codeGen,使用with语法包裹字符串