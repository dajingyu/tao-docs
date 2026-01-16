/*
 * @Date: 2025-02-07 17:09:39
 * @LastEditors: 我家有条大鲸鱼
 * @LastEditTime: 2025-03-03 20:01:24
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
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: nav,
    sidebar: sidebar,
    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
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
