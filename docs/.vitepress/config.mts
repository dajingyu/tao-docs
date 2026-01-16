/*
 * @Date: 2025-02-07 17:09:39
 * @LastEditors: 我家有条大鲸鱼
 * @LastEditTime: 2026-01-16 19:00:13
 * @Description: 文件信息
 */
import { defineConfig } from 'vitepress'
import nav from './nav.mts'
import sidebar from './sidebar.mts'
// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "大鲸鱼博客",
  description: "前端技术学习！",
  base:'/dajingyu-project/',
  srcDir:'docs',
  lang: 'zh-CN',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: nav,
    sidebar: sidebar,
    socialLinks: [
      { icon: 'github', link: 'https://github.com/dajingyu/tao-docs' }
    ]
  },
  vue: {
    template: {
      compilerOptions: {
        isCustomElement: (tag) => tag.startsWith('CodeEditor')
      }
    }
  }
})
