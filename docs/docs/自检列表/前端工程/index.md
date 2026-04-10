##  谈谈 Webpack

1. 概念

静态模块打包工具，可以将静态模块编译、打包和输出成一个或多个文件（bundles）。

2. 5 个核心概念

- 入口(entry): 指示 webpack 从哪个文件开始打包。
- 输出(output): 指示 webpack 编译、打包后的文件输出到哪里去。
- 加载器(loader): webpack 只能识别 js、json 文件，其他类型的文件需要通过 loader 转化成有效模块才能识别。
  - 比如：处理样式文件可以使用 css-loader\style-loader\less-loader\sass-loader
  - 处理 vue 文件可以使用 vue-loader
- 插件(plugin): 相对 loader，plugin 可以做范围更广的工作，比如：打包优化，资源管理，注入环境变量。
  - 比如：处理 html 资源需要使用 html-webpack-plugin
  - eslint 语法风格检查需要使用 eslint-webpack-plugin
- 模式(mode): 可以选择 development, production 或 none 之中的一个。不同模式会加载不同的配置。

2. 常见细节面试题

### 2.1 Webpack 中 loader 的执行顺序？

- 同一个模块上配置的多个 `loader`，**执行顺序是从右到左、从下到上**。
- 可以理解为：先执行离源码最近的 loader，再逐步把结果交给前一个 loader 处理，最后交给 Webpack。
- 例如：

```js
// webpack.config.js
module: {
  rules: [
    {
      test: /\.css$/,
      use: ['style-loader', 'css-loader'] // 实际执行顺序：css-loader -> style-loader
    }
  ]
}
```

**总结一句**：`use` 数组**写的顺序是从左到右**，**实际执行顺序是从右到左**。

### 2.2 loader 和 plugin 的区别？

- **loader**：是一个**转换器**，专注于把某种类型的文件转成 Webpack 能识别的模块，例如 `ts-loader`、`babel-loader`、`css-loader`。
- **plugin**：是一个**扩展器**，基于 Webpack 的生命周期钩子，在打包过程的不同阶段插入逻辑，比如压缩、拷贝文件、注入环境变量等。
- 配置上：loader 写在 `module.rules` 里，plugin 写在 `plugins` 数组里。

### 2.3 Tree Shaking 生效的前提条件？

- 代码使用 **ES Module（`import`/`export`）** 语法，方便静态分析。
- 打包模式为 `production` 或显式开启 `optimization.usedExports`。
- 不能有明显的副作用（对于带副作用的模块/文件，需要通过 `sideEffects` 配置声明）。

### 2.4 代码分割（Code Splitting）常见方式？

- Webpack 中常见三种：
  - 通过入口配置 `entry` 拆分多个 bundle。
  - 通过 `import()` 动态导入实现按需加载。
  - 通过 `SplitChunksPlugin` 抽离公共依赖（如第三方库）。

### 2.5 开发环境与生产环境的典型差异配置？

- **dev（开发环境）**：
  - `mode: 'development'`
  - 开启 `devtool: 'cheap-module-source-map'` 方便调试
  - 开启 `webpack-dev-server` / HMR，构建速度优先
- **prod（生产环境）**：
  - `mode: 'production'`
  - 开启压缩、Tree Shaking、代码分割、缓存（`contenthash`）
  - 关闭多余的 source map 或使用 `hidden-source-map`

### 2.6 Webpack 配置的组织方式（示例）

常见有两种做法，面试时说出“**单配置 + 环境变量** 和 **多配置文件 + webpack-merge**”即可。

**方式一：单个配置文件，使用 `mode` / 环境变量区分**

```js
// webpack.config.js
module.exports = (env, argv) => {
  const isProd = argv.mode === 'production';

  return {
    mode: isProd ? 'production' : 'development',
    entry: './src/main.ts',
    output: {
      filename: isProd ? 'js/[name].[contenthash].js' : 'js/[name].js',
      clean: true
    },
    devtool: isProd ? false : 'cheap-module-source-map',
    devServer: {
      hot: true,
      open: true
    },
    // 其他 loader / plugins 配置...
  };
};
```

**方式二：拆分为 common/dev/prod，多文件配置 + `webpack-merge`**

```js
// webpack.common.js
module.exports = {
  entry: './src/main.ts',
  module: {
    rules: [
      { test: /\.ts$/, use: 'ts-loader', exclude: /node_modules/ }
    ]
  }
};

// webpack.dev.js
const { merge } = require('webpack-merge');
const common = require('./webpack.common');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'cheap-module-source-map',
  devServer: { hot: true, open: true }
});

// webpack.prod.js
const { merge } = require('webpack-merge');
const common = require('./webpack.common');

module.exports = merge(common, {
  mode: 'production',
  output: {
    filename: 'js/[name].[contenthash].js',
    clean: true
  }
});
```

**一句话总结**：项目大一些时，推荐用 **common + dev + prod 拆分配置**，既复用公共部分，又方便针对不同环境做差异化优化。

## webpack 优化

### 1. CSS 处理优化

#### 开发环境：使用 style-loader
- **目的**：将 CSS 注入到 JS 中，利用 HMR 实现样式热更新，修改样式后无需刷新页面
- **配置示例**：
```js
// webpack.dev.js
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'] // style-loader 将 CSS 注入到 <style> 标签
      }
    ]
  }
};
```

#### 生产环境：抽离 CSS 并压缩
- **目的**：将 CSS 抽离成单独文件，减少 JS 体积，并压缩 CSS 文件大小
- **配置示例**：
```js
// webpack.prod.js
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'] // 抽离 CSS
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash].css' // 输出到单独文件
    })
  ],
  optimization: {
    minimizer: [
      new CssMinimizerPlugin() // 压缩 CSS
    ]
  }
};
```

**对比总结**：
- 开发环境：`style-loader` → CSS 在 JS 中，热更新快
- 生产环境：`MiniCssExtractPlugin` + `CssMinimizerPlugin` → CSS 单独文件，体积更小

### 2. 构建速度优化：缓存

#### cache-loader 缓存 loader 处理结果
- **目的**：第二次打包时，跳过未变化的文件，直接使用缓存结果，大幅提升构建速度
- **配置示例**：
```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          'cache-loader',        // 放在最前面，缓存处理结果
          'babel-loader'
        ],
        include: /src/
      },
      {
        test: /\.css$/,
        use: [
          'cache-loader',
          'style-loader',
          'css-loader'
        ]
      }
    ]
  }
};
```

**注意**：Webpack 5 内置了持久化缓存，可以直接使用：
```js
module.exports = {
  cache: {
    type: 'filesystem', // 文件系统缓存
    buildDependencies: {
      config: [__filename] // 配置文件变化时，缓存失效
    }
  }
};
```

### 3. 资源处理优化：asset 模块

#### 使用 asset 模块代替 file-loader/url-loader
- **目的**：Webpack 5 内置的 asset 模块，可以自动处理图片、字体等静态资源，无需额外 loader
- **配置示例**：
```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 8 * 1024 // 8KB，小于此大小的图片转 base64
          }
        },
        generator: {
          filename: 'images/[name].[hash:8][ext]' // 大于 limit 的输出文件
        }
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        type: 'asset/resource', // 字体文件总是输出文件，不转 base64
        generator: {
          filename: 'fonts/[name].[hash:8][ext]'
        }
      }
    ]
  }
};
```

**对比旧方案**：
- **旧方案**：`file-loader`（输出文件）+ `url-loader`（转 base64）
- **新方案**：`type: 'asset'`（自动选择）+ `type: 'asset/resource'`（总是输出文件）
- **优势**：配置更简洁，无需安装额外 loader

### 4. 其他常见优化措施

#### 4.1 代码分割（Code Splitting）
```js
module.exports = {
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          priority: 10
        },
        common: {
          minChunks: 2,
          priority: 5,
          reuseExistingChunk: true
        }
      }
    }
  }
};
```

#### 4.2 Tree Shaking（生产环境自动开启）
```js
module.exports = {
  mode: 'production', // 自动开启 Tree Shaking
  optimization: {
    usedExports: true, // 标记未使用的导出
    sideEffects: false // 告知 webpack 无副作用，可安全删除
  }
};
```

#### 4.3 压缩优化
```js
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: true // 生产环境移除 console
          }
        }
      })
    ]
  }
};
```

#### 4.4 排除依赖
```js
module.exports = {
  externals: {
    'vue': 'Vue',        // 不打包 Vue，使用 CDN
    'element-ui': 'ELEMENT'
  }
};
```

#### 4.5 多线程构建
```js
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  optimization: {
    minimizer: [
      new TerserPlugin({
        parallel: true, // 开启多线程压缩
        terserOptions: {
          compress: {
            drop_console: true
          }
        }
      })
    ]
  }
};
```

### 5. 优化总结

| 优化方向         | 开发环境                                          | 生产环境                                      | 说明                               |
| ---------------- | ------------------------------------------------- | --------------------------------------------- | ---------------------------------- |
| **CSS 处理**     | `style-loader`                                    | `MiniCssExtractPlugin` + `CssMinimizerPlugin` | 开发热更新快，生产体积小           |
| **构建缓存**     | `cache-loader` 或 `cache: { type: 'filesystem' }` | 同开发环境                                    | 二次构建速度大幅提升               |
| **资源处理**     | `asset` 模块                                      | 同开发环境                                    | 小于 limit 转 base64，大于输出文件 |
| **代码分割**     | 可选                                              | `SplitChunksPlugin`                           | 抽离公共依赖，减少重复打包         |
| **Tree Shaking** | 关闭                                              | 自动开启                                      | 删除未使用代码                     |
| **压缩**         | 关闭                                              | `TerserPlugin` + `CssMinimizerPlugin`         | 减小文件体积                       |
| **多线程**       | 可选                                              | 开启                                          | 利用多核 CPU 加速构建              |

**核心原则**：
- **开发环境**：优先考虑**构建速度**和**开发体验**（HMR、source map）
- **生产环境**：优先考虑**文件体积**和**加载性能**（压缩、分割、缓存）

## vite 和 webpack 的区别

1. 底层语言不同

Vite 是基于 esbuild 采用 go 语言编写，go 语言的操作是纳秒级别

Webpack 是基于 Nodejs，以毫秒计数

所以 vite 比 webpack 更快。

2. 启动方式

webpack 启动慢：webpack 首先分析各个模块之间的依赖，然后将所有内容进行打包，模块越多打包速度越慢，所以启动慢。

vite 启动快：vite 采用了一种懒加载的方式，它在启动的时候不需要打包，而是需要某个模块时，再对模块内容进行编译，所以启动很快

3. 首屏渲染

webpack 渲染快：webpack 启动时已经将所有内容进行打包了，渲染时直接获取资源渲染即可

vite 渲染慢：Vite 渲染时才会打包编译文件，然后再渲染，打包越慢，渲染速度越慢（但是 vite 有缓存，所以第二次渲染速度没问题）

4. 生态

webpack 诞生很久了，生态基本完善

vite 生态不够全，对代码分割不够友好

## Vitest（单元测试）

### 1. 它是什么？（通俗说）

- **Vitest** 是给 **Vite 项目** 用的**单元测试工具**，API 风格和 **Jest** 很像（`describe`、`it`、`expect` 那一套）。
- 可以把它理解成：**在 Node 里自动跑你的小函数、小模块，用断言检查“结果对不对”**；跑错了就红字报错，对了就通过。
- 和 Vite 同一家思路：**开发时启动快**，和 `vite.config` 能共用解析别名、TS、Vue 等配置，少写一份重复配置。

### 2. 常见安装与脚本

```bash
npm i -D vitest
```

在 `package.json` 里加脚本（名字可按团队习惯改）：

```json
{
  "scripts": {
    "test": "vitest",
    "test:run": "vitest run"
  }
}
```

- **`vitest`**：默认**监听模式**，改代码会自动重跑，适合开发时边写边测。
- **`vitest run`**：**跑完就退出**，适合 CI / 提交前一次性执行。

### 3. 最小配置示例（可选）

Vite 项目里常放在 `vitest.config.ts`（或与 `vite.config` 合并）。下面是一个**够用**的起步配置：

```ts
// vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,        // 可不写 import，直接用 describe / it / expect（需在 tsconfig 里配 types）
    environment: 'node'   // 测 DOM 时用 'happy-dom' 或 'jsdom'，并安装对应包
  }
});
```

**通俗理解**：`environment` 决定测试跑在哪种“假浏览器 / 纯 Node”里；只算数字、调纯函数用 `node`；要 `document`、`window` 再换 `jsdom` / `happy-dom`。

### 4. 基本写法：描述 → 用例 → 断言

**思路**：先**分组**（`describe`），再写**一条条用例**（`it` 或 `test`），里面用 **`expect(实际).toXXX(期望)`** 说明“我期待什么”。

```ts
// src/utils/sum.ts
export function sum(a: number, b: number) {
  return a + b;
}
```

```ts
// src/utils/sum.test.ts
import { describe, it, expect } from 'vitest';
import { sum } from './sum';

describe('sum', () => {
  it('两个正数相加得到正确结果', () => {
    expect(sum(1, 2)).toBe(3);
  });

  it('负数也按预期工作', () => {
    expect(sum(-1, 1)).toBe(0);
  });
});
```

常用断言（**口语化记忆**）：

- **`toBe`**：严格相等（`===`），适合数字、布尔、字符串等简单值。
- **`toEqual`**：深度比较对象/数组“长得像不像”。
- **`toThrow`**：期待某段代码执行时会报错。

```ts
it('对象内容一致', () => {
  expect({ a: 1 }).toEqual({ a: 1 });
});

it('非法输入应抛错', () => {
  expect(() => JSON.parse('')).toThrow();
});
```

### 5. 钩子函数：准备数据、收尾（通俗说）

- **`beforeEach`**：每个用例**开始前**执行一次（常见：重置数据、造 mock）。
- **`afterEach`**：每个用例**结束后**执行（常见：清定时器、恢复 mock）。
- **`beforeAll` / `afterAll`**：整组用例**只执行一次**（常见：连测试库、起服务——注意别和别的用例互相污染）。

```ts
import { describe, it, expect, beforeEach } from 'vitest';

describe('计数器', () => {
  let count: number;

  beforeEach(() => {
    count = 0; // 每个用例都从干净状态开始
  });

  it('加一后变为 1', () => {
    count += 1;
    expect(count).toBe(1);
  });
});
```

### 6. 异步测试

**规则**：如果用例里有 `async`，在 `expect` 前 **`await`**，或 **`return` 一个 Promise**，否则 Vitest 可能在你还没测完就认为“通过了”。

```ts
it('异步结果正确', async () => {
  const data = await Promise.resolve(42);
  expect(data).toBe(42);
});
```

### 7. Mock（简单理解）

**Mock** 就是：**把真实依赖（接口、时间、随机数）换成“可控的假实现”**，只测当前函数的逻辑。

```ts
import { vi, it, expect } from 'vitest';

it('可以伪造函数返回值', () => {
  const fn = vi.fn().mockReturnValue(100);
  expect(fn()).toBe(100);
  expect(fn).toHaveBeenCalled();
});
```

模块替换用 **`vi.mock('./api')`** 等（具体路径与项目结构有关），面试能说清：**隔离外部、让测试稳定可重复**即可。

### 8. 和 Jest 的对比（一句话）

- **写法**：断言、Mock API 大多能平移，学习成本低。
- **场景**：**Vite 项目优先 Vitest**；老 Webpack 项目若已深度绑定 Jest，不必强行换。

### 9. 自检小问题

- [ ] 能说出 **`vitest` 与 `vitest run`** 的区别（监听 vs 一次性）。
- [ ] 能写出一个 **`describe` + `it` + `expect`** 的最小例子。
- [ ] 知道异步用例要 **`await` / 返回 Promise**。
- [ ] 知道测 DOM 时要选 **`jsdom` / `happy-dom`** 环境。