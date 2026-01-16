
# 5. pinia

## 5.1【准备一个效果】



## 5.2【搭建 pinia 环境】

第一步：`npm install pinia`

第二步：操作`src/main.ts`

```ts
import { createApp } from "vue";
import App from "./App.vue";

/* 引入createPinia，用于创建pinia */
import { createPinia } from "pinia";

/* 创建pinia */
const pinia = createPinia();
const app = createApp(App);

/* 使用插件 */ {
}
app.use(pinia);
app.mount("#app");
```

此时开发者工具中已经有了`pinia`选项

<img src="https://cdn.nlark.com/yuque/0/2023/png/35780599/1684309952481-c67f67f9-d1a3-4d69-8bd6-2b381e003f31.png" style="zoom:80%;border:1px solid black;border-radius:10px" />

## 5.3【存储+读取数据】

1. `Store`是一个保存：**状态**、**业务逻辑** 的实体，每个组件都可以**读取**、**写入**它。

2. 它有三个概念：`state`、`getter`、`action`，相当于组件中的： `data`、 `computed` 和 `methods`。

3. 具体编码：`src/store/count.ts`

   ```ts
   // 引入defineStore用于创建store
   import { defineStore } from "pinia";

   // 定义并暴露一个store
   export const useCountStore =
     defineStore("count", {
       // 动作
       actions: {},
       // 状态
       state() {
         return {
           sum: 6,
         };
       },
       // 计算
       getters: {},
     });
   ```

4. 具体编码：`src/store/talk.ts`

   ```js
   // 引入defineStore用于创建store
   import { defineStore } from "pinia";

   // 定义并暴露一个store
   export const useTalkStore =
     defineStore("talk", {
       // 动作
       actions: {},
       // 状态
       state() {
         return {
           talkList: [
             {
               id: "yuysada01",
               content:
                 "你今天有点怪，哪里怪？怪好看的！",
             },
             {
               id: "yuysada02",
               content:
                 "草莓、蓝莓、蔓越莓，你想我了没？",
             },
             {
               id: "yuysada03",
               content:
                 "心里给你留了一块地，我的死心塌地",
             },
           ],
         };
       },
       // 计算
       getters: {},
     });
   ```

5. 组件中使用`state`中的数据

   ```vue
   <template>
     <h2>
       当前求和为：{{
         sumStore.sum
       }}
     </h2>
   </template>

   <script
     setup
     lang="ts"
     name="Count"
   >
   // 引入对应的useXxxxxStore
   import { useSumStore } from "@/store/sum";

   // 调用useXxxxxStore得到对应的store
   const sumStore =
     useSumStore();
   </script>
   ```

   ```vue
   <template>
     <ul>
       <li
         v-for="talk in talkStore.talkList"
         :key="talk.id"
       >
         {{ talk.content }}
       </li>
     </ul>
   </template>

   <script
     setup
     lang="ts"
     name="Count"
   >
   import axios from "axios";
   import { useTalkStore } from "@/store/talk";

   const talkStore =
     useTalkStore();
   </script>
   ```

## 5.4.【修改数据】(三种方式)

1. 第一种修改方式，直接修改

   ```ts
   countStore.sum = 666;
   ```

2. 第二种修改方式：批量修改

   ```ts
   countStore.$patch({
     sum: 999,
     school: "atguigu",
   });
   ```

3. 第三种修改方式：借助`action`修改（`action`中可以编写一些业务逻辑）

   ```js
   import { defineStore } from "pinia";

   export const useCountStore =
     defineStore("count", {
       /*************/
       actions: {
         //加
         increment(
           value: number
         ) {
           if (
             this.sum < 10
           ) {
             //操作countStore中的sum
             this.sum +=
               value;
           }
         },
         //减
         decrement(
           value: number
         ) {
           if (this.sum > 1) {
             this.sum -=
               value;
           }
         },
       },
       /*************/
     });
   ```

4. 组件中调用`action`即可

   ```js
   // 使用countStore
   const countStore =
     useCountStore();

   // 调用对应action
   countStore.incrementOdd(
     n.value
   );
   ```

## 5.5.【storeToRefs】

- 借助`storeToRefs`将`store`中的数据转为`ref`对象，方便在模板中使用。
- 注意：`pinia`提供的`storeToRefs`只会将数据做转换，而`Vue`的`toRefs`会转换`store`中数据。

```vue
<template>
  <div class="count">
    <h2>
      当前求和为：{{ sum }}
    </h2>
  </div>
</template>

<script
  setup
  lang="ts"
  name="Count"
>
import { useCountStore } from "@/store/count";
/* 引入storeToRefs */
import { storeToRefs } from "pinia";

/* 得到countStore */
const countStore =
  useCountStore();
/* 使用storeToRefs转换countStore，随后解构 */
const { sum } = storeToRefs(
  countStore
);
</script>
```

## 5.6.【getters】

1. 概念：当`state`中的数据，需要经过处理后再使用时，可以使用`getters`配置。

2. 追加`getters`配置。

   ```js
   // 引入defineStore用于创建store
   import { defineStore } from "pinia";

   // 定义并暴露一个store
   export const useCountStore =
     defineStore("count", {
       // 动作
       actions: {
         /************/
       },
       // 状态
       state() {
         return {
           sum: 1,
           school: "atguigu",
         };
       },
       // 计算
       getters: {
         bigSum: (
           state
         ): number =>
           state.sum * 10,
         upperSchool(): string {
           return this.school.toUpperCase();
         },
       },
     });
   ```

3. 组件中读取数据：

   ```js
   const {
     increment,
     decrement,
   } = countStore;
   let {
     sum,
     school,
     bigSum,
     upperSchool,
   } = storeToRefs(
     countStore
   );
   ```

## 5.7.【$subscribe】

通过 store 的 `$subscribe()` 方法侦听 `state` 及其变化

```ts
talkStore.$subscribe(
  (mutate, state) => {
    console.log(
      "LoveTalk",
      mutate,
      state
    );
    localStorage.setItem(
      "talk",
      JSON.stringify(
        talkList.value
      )
    );
  }
);
```

## 5.8. 【store 组合式写法】

```ts
import { defineStore } from "pinia";
import axios from "axios";
import { nanoid } from "nanoid";
import { reactive } from "vue";

export const useTalkStore =
  defineStore("talk", () => {
    // talkList就是state
    const talkList = reactive(
      JSON.parse(
        localStorage.getItem(
          "talkList"
        ) as string
      ) || []
    );

    // getATalk函数相当于action
    async function getATalk() {
      // 发请求，下面这行的写法是：连续解构赋值+重命名
      let {
        data: {
          content: title,
        },
      } = await axios.get(
        "https://api.uomg.com/api/rand.qinghua?format=json"
      );
      // 把请求回来的字符串，包装成一个对象
      let obj = {
        id: nanoid(),
        title,
      };
      // 放到数组中
      talkList.unshift(obj);
    }
    return {
      talkList,
      getATalk,
    };
  });
```

---

## 5.9. 【持久化插件】

Pinia 本身不提供持久化功能，但可以使用 `pinia-plugin-persistedstate` 插件实现数据持久化。

### 安装插件

```bash
npm install pinia-plugin-persistedstate
```

### 配置插件

```ts
// main.ts
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

app.use(pinia)
```

### 使用持久化

```ts
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    name: 'Vue',
    age: 18
  }),
  // 启用持久化
  persist: true
})

// 或者使用组合式写法
export const useUserStore = defineStore('user', () => {
  const name = ref('Vue')
  const age = ref(18)
  
  return { name, age }
}, {
  persist: true // 启用持久化
})
```

### 自定义持久化配置

```ts
export const useUserStore = defineStore('user', {
  state: () => ({
    name: 'Vue',
    age: 18,
    token: 'xxx'
  }),
  persist: {
    // 自定义存储键名
    key: 'user-store',
    // 只持久化指定字段
    paths: ['name', 'age'],
    // 自定义存储方式（默认 localStorage）
    storage: sessionStorage,
    // 自定义序列化方式
    serializer: {
      serialize: JSON.stringify,
      deserialize: JSON.parse
    }
  }
})
```

## 5.10. 【最佳实践】

### 1. Store 组织方式

**推荐的文件结构**：

```
store/
  ├── index.ts          # Pinia 实例
  ├── modules/
  │   ├── user.ts      # 用户相关
  │   ├── cart.ts      # 购物车相关
  │   └── product.ts   # 产品相关
```

### 2. 组合式写法 vs 选项式写法

**组合式写法（推荐）**：
- 更灵活，适合复杂逻辑
- 更好的 TypeScript 支持
- 更容易复用逻辑

**选项式写法**：
- 更直观，适合简单场景
- 与 Vuex 类似，迁移成本低

### 3. 避免过度使用 Store

- **使用 Store**：全局状态、跨组件共享数据
- **不使用 Store**：组件内部状态、临时数据

### 4. 性能优化

```ts
// 使用 storeToRefs 保持响应性
import { storeToRefs } from 'pinia'

const userStore = useUserStore()
// ✅ 正确：保持响应性
const { name, age } = storeToRefs(userStore)

// ❌ 错误：失去响应性
const { name, age } = userStore
```

### 5. TypeScript 支持

```ts
// 定义 Store 类型
export interface UserState {
  name: string
  age: number
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    name: '',
    age: 0
  })
})
```

### 6. 测试 Store

```ts
import { setActivePinia, createPinia } from 'pinia'
import { useUserStore } from './user'

describe('User Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should update name', () => {
    const store = useUserStore()
    store.name = 'Vue'
    expect(store.name).toBe('Vue')
  })
})
```

## 5.11. 【常见问题】

### 1. 解构失去响应性

```ts
// ❌ 错误
const { name } = useUserStore()

// ✅ 正确
const userStore = useUserStore()
const name = userStore.name // 在模板中使用 userStore.name

// ✅ 或使用 storeToRefs
const { name } = storeToRefs(useUserStore())
```

### 2. 在 Store 外部修改 State

```ts
// ❌ 不推荐：直接修改
const store = useUserStore()
store.name = 'New Name'

// ✅ 推荐：使用 action
store.updateName('New Name')
```

### 3. 循环依赖问题

避免 Store 之间的循环依赖，使用计算属性或方法延迟访问。

## 5.12. 【与 Vuex 的对比】

| 特性 | Pinia | Vuex |
|------|-------|------|
| **Vue 版本** | Vue 2 & 3 | Vue 2 & 3 |
| **TypeScript** | 原生支持 | 需要额外配置 |
| **DevTools** | 支持 | 支持 |
| **代码分割** | 自动 | 需要手动配置 |
| **API 设计** | 更简洁 | 更复杂 |
| **学习曲线** | 较平缓 | 较陡峭 |

**推荐**：新项目优先使用 Pinia，Vuex 项目可以逐步迁移。