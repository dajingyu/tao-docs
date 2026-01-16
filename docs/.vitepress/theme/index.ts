/*
 * @Date: 2024-07-26 13:30:02
 * @LastEditors: 我家有条大鲸鱼
 * @LastEditTime: 2025-03-03 20:12:41
 * @Description: 文件信息
 */
import { VPTheme } from '@vue/theme'
import { App, h } from 'vue'
import {
  filterHeadersByPreference,
  preferComposition,
  preferSFC
} from './components/preferences'
import SponsorsAside from './components/SponsorsAside.vue'
import VueSchoolLink from './components/VueSchoolLink.vue'
import './styles/index.css'
// import TextAd from './components/TextAd.vue'

export default {
  ...VPTheme,
  Layout: () => {
    return h(VPTheme.Layout, null, {
      'aside-mid': () => h(SponsorsAside)
    })
  },
  async enhanceApp({ app }: { app: App }) {
    app.provide('prefer-composition', preferComposition)
    app.provide('prefer-sfc', preferSFC)
    app.provide('filter-headers', filterHeadersByPreference)
    app.component('VueSchoolLink', VueSchoolLink)
  }
}
