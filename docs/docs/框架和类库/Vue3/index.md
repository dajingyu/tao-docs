# 1. 认识 Vue 3

## 1) 版本与定位

- Vue 3 是当前主线版本，对 **TypeScript**、**组合式 API**、**性能与包体**做了系统级升级。
- 官方文档：<https://cn.vuejs.org/>

## 2) 性能与实现方向（Vue 3 自身）

- 更小包体、更快渲染与更新（具体数据以官方发布说明为准）。
- 响应式基于 **`Proxy`**，配合新的调度与编译优化。
- 虚拟 DOM 与编译管线重写，**Tree-Shaking** 更友好。

## 3) 开发体验上的新能力

- **组合式 API**：`setup` / `<script setup>`、`ref`、`reactive`、`computed`、`watch`、`provide` / `inject`、以 `on` 开头的生命周期等。
- **内置组件**：`Fragment`、`Teleport`、`Suspense` 等。
- **应用级 API**：全局 API 改为在 **`createApp`** 返回的应用实例上挂载（如 `app.use`、`app.component`）。

> 若需要 **Vue 2 与 Vue 3 对照**，见同级目录 [Vue2与Vue3对比](../Vue2与Vue3对比/index.md)。  
> **Vue 3 响应式原理（effect / 依赖收集）**：[响应式系统概述](./响应式系统概述.md)。
