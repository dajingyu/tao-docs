# 1. Composition API(常用部分)

文档：<https://cn.vuejs.org/guide/extras/composition-api-faq.html>、<https://cn.vuejs.org/api/sfc-script-setup.html>、<https://cn.vuejs.org/api/composition-api-setup.html>

## 1) `setup()` 与 `<script setup>`

- 组合式 API 可在选项 **`setup()`** 或 **`<script setup>`** 中使用；**新项目优先使用 `<script setup>`**（见下文「setup 语法糖」）。
- **`setup()`**：在组件实例创建前执行一次；返回对象中的属性/方法会暴露给模板。与选项式 `data` / `methods` 混用不推荐。
- **`<script setup>`**：编译期糖，顶层绑定自动暴露给模板，配合 `defineProps` / `defineEmits` 等，类型与写法更贴近日常开发。

## 2) ref

- 作用: 定义一个数据的响应式
- 语法: const xxx = ref(initValue): 
  - 创建一个包含响应式数据的引用(reference)对象
  - js中操作数据: xxx.value
  - 模板中操作数据: 不需要.value
- 常见用法：基本类型、或需要**整体替换**的单个引用（对象也可放在 `ref` 里；多字段对象常用 `reactive` 或 `ref` 包一层按项目习惯选择）



```vue
<template>
  <h2>{{ count }}</h2>
  <hr />
  <button type="button" @click="update">更新</button>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const count = ref(1)

function update() {
  count.value += 1
}
</script>
```

## 3) reactive

- 作用: 定义多个数据的响应式
- const proxy = reactive(obj): 接收一个普通对象然后返回该普通对象的响应式代理器对象
- 响应式转换是“深层的”：会影响对象内部所有嵌套的属性
- 内部基于 ES6 的 Proxy 实现，通过代理对象操作源对象内部数据都是响应式的

```vue
<template>
  <h2>name: {{ state.name }}</h2>
  <h2>age: {{ state.age }}</h2>
  <h2>wife: {{ state.wife }}</h2>
  <hr />
  <button type="button" @click="update">更新</button>
</template>

<script setup lang="ts">
import { reactive } from 'vue'

const state = reactive({
  name: 'tom',
  age: 25,
  wife: {
    name: 'marry',
    age: 22
  }
})

function update() {
  state.name += '--'
  state.age += 1
  state.wife.name += '++'
  state.wife.age += 2
}
</script>
```

## 4) 响应式实现要点（仅 Vue 3）

- `reactive` 返回的对象由 **`Proxy`** 代理：拦截读/写、增删属性等；常配合 **`Reflect`** 保持默认语义。
- `ref` 则通过**包裹一层引用**管理单个响应式值，在 `<script>` 里用 **`.value`**，在模板中自动解包。
- 依赖收集与视图更新由运行时内部的 **`effect` / `track` / `trigger`** 等机制调度（面试可结合 [响应式系统概述](./响应式系统概述.md) 串讲）。
- **与 Vue 2 的对比表**（`defineProperty` vs `Proxy`）见：[Vue2与Vue3对比/响应式对比.md](../Vue2与Vue3对比/响应式对比.md)

## 5) setup 语法糖最佳实践

### 5.1 使用 `<script setup>`

`<script setup>` 是 Vue 3.2+ 引入的语法糖，简化了 Composition API 的使用。

**优势**：
- 更简洁的语法
- 自动暴露变量和函数
- 更好的 TypeScript 支持
- 更好的性能（编译时优化）

**基本用法**：

```vue
<script setup lang="ts">
import { ref, computed } from 'vue'

// 直接定义，自动暴露给模板
const count = ref(0)
const doubleCount = computed(() => count.value * 2)

function increment() {
  count.value++
}
</script>

<template>
  <div>
    <p>Count: {{ count }}</p>
    <p>Double: {{ doubleCount }}</p>
    <button @click="increment">+1</button>
  </div>
</template>
```

### 5.2 Props 和 Emits

```vue
<script setup lang="ts">
// 定义 Props
interface Props {
  title: string
  count?: number
}

const props = defineProps<Props>()

// 定义 Emits
const emit = defineEmits<{
  change: [value: string]
  update: [id: number]
}>()

function handleClick() {
  emit('change', 'new value')
}
</script>
```

### 5.3 使用 defineExpose 暴露方法

```vue
<script setup lang="ts">
import { ref } from 'vue'

const inputRef = ref<HTMLInputElement>()

function focus() {
  inputRef.value?.focus()
}

// 暴露方法给父组件
defineExpose({
  focus
})
</script>

<template>
  <input ref="inputRef" />
</template>
```

### 5.4 使用 defineOptions（Vue 3.3+）

```vue
<script setup lang="ts">
// 定义组件选项
defineOptions({
  name: 'MyComponent',
  inheritAttrs: false
})
</script>
```

### 5.5 最佳实践总结

1. **优先使用 `<script setup>`**：更简洁、性能更好
2. **合理使用 TypeScript**：为 Props 和 Emits 提供类型定义
3. **使用 Composables**：将可复用逻辑提取为 Composables
4. **基础类型用 `ref`、对象聚合用 `reactive`**：需要在模板里驱动更新的数据保持响应式；常量、无响应需求的工具函数不必强行包一层
5. **合理使用 computed**：对于派生状态，使用 computed 而不是 watch
6. **使用 defineExpose**：需要暴露方法给父组件时使用
7. **使用 defineOptions**：定义组件选项（Vue 3.3+）

### 5.6 常见错误避免

```vue
<script setup lang="ts">
// ❌ 错误：不能直接修改 props
const props = defineProps<{ count: number }>()
props.count++ // 错误！

// ✅ 正确：使用 emit 通知父组件
const emit = defineEmits<{ 'update:count': [value: number] }>()
emit('update:count', props.count + 1)

// ❌ 错误：不能使用 this
const message = this.someValue // 错误！

// ✅ 正确：直接使用变量
const message = ref('hello')
</script>
```