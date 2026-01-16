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
  lang: 'zh-CN',
  // 配置 i18n（@vue/theme 需要）
  locales: {
    root: {
      label: '简体中文',
      lang: 'zh-CN',
      themeConfig: {
        // https://vitepress.dev/reference/default-theme-config
        nav: nav,
        sidebar: sidebar,
        socialLinks: [
          { icon: 'github', link: 'https://github.com/dajingyu/tao-docs' }
        ],
        // 添加 i18n 配置（@vue/theme 需要）
        i18n: {
          ariaSkipToContent: '跳转到内容',
          ariaSkipToNav: '跳转到导航',
          ariaMobileNav: '移动端导航',
          ariaDarkMode: '切换暗黑模式',
          ariaToC: '当前页面的目录',
          ariaSidebarNav: '侧边栏导航',
          ariaMainNav: '主导航',
          search: '搜索',
          menu: '菜单',
          appearance: '外观'
        }
      }
    }
  },
  vue: {
    template: {
      compilerOptions: {
        isCustomElement: (tag) => tag.startsWith('CodeEditor')
      }
    }
  }
})
