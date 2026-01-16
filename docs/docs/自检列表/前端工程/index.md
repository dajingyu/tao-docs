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

## webpack 优化

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