# vue
## 生命周期函数

1. vue2和vue3的生命周期函数
```js
// vue2  ->  vue3
beforeCreate -> 使用 setup()
created -> 使用 setup()
beforeMount -> onBeforeMount
mounted -> onMounted
beforeUpdate -> onBeforeUpdate
updated -> onUpdated
beforeDestroy -> onBeforeUnmount
destroyed -> onUnmounted
errorCaptured -> onErrorCaptured
```

1. 其他生命周期函数

除此之外，还有一些别的生命周期函数：

- 被 keep-alive 缓存的组件会自动拥有两个生命周期函数

  - activated
  - deactivated

- 用来捕获后代组件产生的错误
  - errorCaptured

## 组件间通信 

- props 父 -> 子
  -  v-bind:xxx.sync 父 <-> 子
  - 绑定 xxx 属性和 update:xxx 自定义事件
- 自定义事件 子 -> 父
  - Vue2 中给组件绑定的事件默认都是自定义事件，加上`.native`才是 DOM 事件
  - Vue3 中给组件绑定的事件默认是 DOM 事件（当然实际要满足条件才会绑定：
  - 1. 事件名需要是 DOM 事件名称 
  - 2. 子组件必须有根标签 
  - 3. 子组件内部不能 defineEmits 声明接受），不满足条件就是自定义事件

- vuex / pinia 兄弟、祖孙
  - 一般 vue2 项目用 vuex，vue3 项目用 pinia


- v-model 父 <-> 子

  - vue2 和 vue3 用法也不一样：

  - vue2 中给组件绑定 value 属性和 input 自定义事件
  - vue3 中默认给组件绑定 modelValue 属性和 update:modelValue 事件
  - 也可以通过 v-model:xxx 的方式修改属性名和事件名

   插槽 父 <-> 子

  - 通信的内容主要是标签数据（之前通信方案都是普通数据）
  - 分类：默认插槽、具名插槽和作用域插槽
  - 一般我设置组件时，会优先最重要内容用默认插槽（因为简单），其他内容考虑具名插槽，如果需要子向父通信用作用域插槽（table）

- 全局事件总线(兄弟)：
  - vue2 中能使用，`$bus`
  - vue3 不能使用了, 因为删除了`$on/$off`等自定义事件方法，想要使用必须用第三方库，比如 `mitt` 实现
- `$parent/$children/$refs`（父 <-> 子），其中 vue3 删除了`$children`
- `$attrs/$listeners` （父 -> 子）, 其中 vue3 删除了`$listeners`， 内容放入了`$attrs`中
- `provide/inject` 祖孙注入
- 离线存储：localStorage、sessionStorage

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
## Vue2 和 Vue3 的区别

1. 生命周期不一样

卸载阶段

- vue2 beforeDestroy destroyed
- vue3 beforeUnmount unmounted

2. 组件间通信方案用法不一样

- vue3 删除了`$on/$off/$once`API，所以默认不能全局事件总线，如果想要使用全局事件总线，需要使用第三方库 mitt
- vue3 删除了 v-bind:xxx.sync 修饰符，父子组件双向通信只能使用 v-model
- v-model 对组件用法不一样
  - vue2 v-model 绑定的是 value 属性和 input 自定义事件
  - vue3 v-model 绑定的是 modelValue 属性和 update:modelValue 自定义事件
- vue3 删除`$listeners`，整合到`$attrs`中
- vue3 删除`$children`，获取子组件实例对象必须使用 ref

3. 指令不一样

- v-for 和 v-if 优先级不同
  - vue2 是 v-for 优先级更高
  - vue3 是 v-if 优先级更高
- vue3 新增了一个指令：v-memo 用来缓存 DOM 元素
- vue3 删除了 v-bind:xxx.sync 修饰符
- vue3 v-model 用法不一样

4. 开发模式不一样

- vue2 只有选项式开发模式
- vue3 除了有选项式开发模式以外，新增了组合式开发模式
  - setup
  - ref / reactive / watch / computed
  - onMounted / onBeforeUnmount

5. 响应式原理不一样

- vue2 通过 Object.defineProperty 实现的响应式
- vue3 通过 Proxy 实现的响应式

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
  - v-for 和 v-if 优先级：
    - vue2 是 v-for 更高
    - vue3 是 v-if 更高
- v-on 绑定事件 @
  - 事件修饰符 .prevent .stop .once .self
  - 按键修饰符 .enter .13
- v-model 双向数据绑定
  - 双向数据绑定原理
    - 给普通 input 元素（text）绑定，绑定的是 value 属性和 input 事件
    - 给单选（radio）或多选（checkout）绑定，绑定的是 checked 属性和 change 事件
    - 给下拉列表（select）绑定，绑定的是 value 属性和 change 事件
    - 给组件绑定
      - vue2 中，组件绑定和普通元素绑定效果一样
      - vue3 中，默认绑定 modelValue 属性和 update:modelValue 事件
- v-bind 单向数据绑定（强制绑定数据） :
- v-slot 插槽 #
  - 默认插槽、具名插槽和作用域插槽
- v-memo(新增的指令) 用于缓存部分 DOM 元素

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

## nextTick方法的原理 

### Vue2

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

### Vue3

调用 nextTick 方法，如果不传入参数，就会直接返回一个成功的 promise 对象。后续代码会添加到异步队列等待将来执行。

问题：为什么 Vue3 的 nextTick 这么简单？

- 因为 Vue2 要考虑低版本浏览器的兼容性处理，所以用了 4 种方式来将回调函数添加到异步队列。
- 而 Vue3 放弃了低版本浏览器的兼容，所以只需要考虑最佳方案：Promise 即可。

## 双向数据绑定原理 

v-model 主要用于双向数据绑定（收集表单数据），它给元素绑定时，不同元素做法不一样：

1. 如果是文本类型元素（input 和 textarea）：绑定 value 属性和 input 事件；
2. 如果是单选或多选元素（input type="checkbox" 和 input type="radio"）：绑定 checked 属性和 change 事件；
3. 如果是下拉列表元素（select）：绑定 value 属性和 change 事件；
4. 如果不是上述这些元素（比如组件），会按照文本类型元素处理。

- Vue3 中，给组件绑定的是 modelValue 属性和 update:modelValue 事件

## 响应式原理 <a name="响应式原理"></a>

### Vue2

1. 数据代理

- 总结：将 data/props/methods 等属性代理到 this 上，可以通过 this 直接访问数据，从而让访问数据更加方便

- 详情：遍历 data 所有属性，对每一个属性通过 Object.defineProperty 方法，将 data 属性定义在 vm 上，同时定义了读取数据的 get 和设置属性值的 set 方法。此时我们就能通过 this.xxx 的方式访问 data 中的数据了。 get/set 实际访问/操作的都是原 data 数据

2. 数据劫持

- 总结：将原 data 数据中所有属性进行重新定义，定义成响应式的属性

- 详情：遍历 data 所有属性，每一个属性都会创建一个 dep 对象， 然后通过 Object.defineProperty 方法进行重新定义，同时定义读取数据的 get 和设置属性值的 set 方法, 此时 dep 对象会以闭包的形式保存在 get 和 set 方法中。
  - 未来当你读取属性数据就会触发 get 方法，会返回属性的值，同时会调用 dep.depend() 方法，它用来建立响应式联系，响应式联系就是，dep 保存 watcher，watcher 保存 dep
  - 未来当你设置属性的值就会触发 set 方法，内部会同步更新值，同时会调用 dep.notify() 方法，它用来遍历 dep 保存的所有 watcher，调用 watcher 的方法将更新用户界面的方法添加到异步队列，等待异步更新。（更新数据是同步的，更新用户界面是异步的。）

3. 页面解析渲染

- 总结：将模板页面内部模板语法进行解析生成虚拟 DOM 树，这个过程会建立响应式联系，遍历虚拟 DOM 树渲染成真实 DOM 元素，插入页面根标签生效，完成初始化渲染

- 详情：首先 new Watcher，然后内部会调用方法去进行页面初始化渲染，初始化渲染过程中就会构建虚拟 DOM 树，此时会读取表达式的值，会触发数据代理的 get，又触发数据劫持的 get，此时会通过 dep.depend() 建立响应式联系，所谓的响应式联系就是 dep 保存 watcher，watcher 保存 dep（dep 保存 watcher 的目的为了将来能通过 dep 找到 watcher 从而更新用户界面，watcher 保存 dep 为了防止重复保存），构建完虚拟 DOM 树，就会将虚拟 DOM 树解析成真实 DOM 元素，插入页面生效

4. 更新触发响应式

- 将来当你更新 data 数据时，就会触发数据代理阶段给属性设置的 set 方法，方法内部实际更新的是原 data 数据，又会触发数据劫持阶段给属性设置的 set 方法，此时会同步更新数据的值，同时触发 dep.notify() 方法遍历 dep 保存的 watcher 将更新用户界面的方法添加到异步队列，等待异步更新（通过 nextTick 方法做得：我在官网查询 nextTick 方法的时候，发现他能等 DOM 元素渲染好在触发指定回调，我就去研究它怎么做到的，发现原来它真正原理，并没有等 DOM 元素渲染好，仅仅是将回调函数添加到异步队列而已（这里可以在展开说为什么，也可以等他来问））。

### Vue3

1. 概述

主要由 4 个方法构成 reactive、track、trigger、effect

- reactive 用来将数据定义成响应式
- track 用来进行依赖收集：建立响应式数据和 effect 实例之间的联系
- trigger 用来触发依赖更新：找到响应式数据对应的 effect 实例，去更新用户界面
- effect 用来存储更新用户界面的方法

2. 当你定义 reactive 数据时，内部通过 Proxy 方法对数据进行代理，当你读取属性的时候会触发 get，设置属性的值的时候会触发 set，get 方法中会返回属性的值，同时通过 track 进行依赖收集，set 方法中会更新属性的值，同时会通过 trigger 触发依赖更新

3. 默认 effect 方法一上来就会执行一遍，此时会生成 effect 实例，将更新用户界面的方法存储在 effect 实例, 并调用更新用户界面的方法来完成页面初始化渲染

4. 初始化渲染时会读取表达式的值，触发 Proxy 设置的 get，此时会通过 track 进行依赖收集：依赖收集会创建一个 weakMap 容器，存储的 key 为响应式对象，值为 Map 容器，Map 容器 存储的 key 为响应式对象中某个属性，值为 Set 容器，Set 容器会存储对应的 effect 实例。到此依赖收集完成，初始化渲染后续也会完成

```js
{ // WeakMap容器 key是响应式数据 value是一个Map容器
  { age: 18 }: { // Map容器 key是响应式数据中某个属性 value是Set容器
    age: [ // Set容器保存effect实例
      effect1, effect2, ...
    ]
  }
}
```

5. 将来更新响应式数据时，数据的值会同步更新，同时会触发 Proxy 设置的 set，此时会通过 trigger 触发依赖更新: 依赖更新会通过 weakMap 容器找到响应式数据对应的 Map 容器，通过 Map 容器找到对应属性的 Set 容器，遍历 Set 容器中 effect 实例调用更新用户界面的方法，从而更新用户界面达到响应式

## vue2和vue3的虚拟dom的区别 
Vue 2 和 Vue 3 在虚拟 DOM (Virtual DOM) 的处理上有几个关键的区别，这些差异主要体现在性能优化、API 设计以及内部实现机制上。下面是 Vue 2 和 Vue 3 虚拟 DOM 的主要区别：

1. 性能优化
Vue 3：

预编译模板：Vue 3 在编译阶段做了更多的优化工作，例如将模板提前编译成 JavaScript 函数，从而减少了运行时的解析成本。
更高效的 VNode：Vue 3 的 VNode 实现更轻量级，减少了不必要的属性，提高了性能。
Patch 函数：Vue 3 引入了更细粒度的 patch 函数，能够更精确地更新 DOM，减少不必要的重渲染。
Tree-Shaking：Vue 3 的 VNode 和相关 API 被设计为可 tree-shaking 的，这意味着未使用的代码可以被自动移除，减小了最终包的大小。
Vue 2：

运行时解析：Vue 2 需要在运行时解析模板字符串，这会增加一些额外的计算开销。
更重的 VNode：Vue 2 的 VNode 包含了更多的元数据，这可能会导致内存占用较高。
2. API 改进
Vue 3：

渲染函数：Vue 3 的渲染函数更加灵活，支持创建更高效的 VNode，并提供了更多的 API 来控制渲染过程。
Composition API：Vue 3 引入了 Composition API，使得状态管理和逻辑复用变得更加直观和简单，这也间接影响到虚拟 DOM 的创建和更新过程。
Vue 2：

选项式 API：Vue 2 使用的是基于选项的 API，虽然直观易用，但在复杂的状态管理场景下可能导致组件间的逻辑耦合。
3. 内部实现
Vue 3：

响应式系统：Vue 3 采用了基于 Proxy 的响应式系统，这使得对象的响应式处理更加高效，也简化了虚拟 DOM 的更新流程。
细粒度更新：Vue 3 的 Diff 算法更加高效，能够识别更细粒度的变化，从而减少不必要的 DOM 更新。
Vue 2：

观察者模式：Vue 2 使用的是基于 Object.defineProperty 的观察者模式，这在某些情况下可能不够高效，并且对于新增属性的支持有限。
4. 其他改进
Vue 3：
Typescript 支持：Vue 3 的源代码和 API 更好地集成了 TypeScript，有助于类型安全和开发体验。
更好的错误追踪：Vue 3 在调试和错误追踪方面有所改进，可以帮助开发者更快地定位问题。
综上所述，Vue 3 在虚拟 DOM 的处理上进行了多方面的优化，不仅提升了性能，也增强了开发者的体验。这些改进使得 Vue 3 更适合构建大型和高性能的应用程序。
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