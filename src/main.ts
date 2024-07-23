import { webFrame } from 'electron'
import ElementUI from 'element-plus'
import 'element-plus/dist/index.css'

import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import { createApp } from 'vue'
import VueLazyLoad from 'vue3-lazyload'

import vue3PhotoPreview from 'vue3-photo-preview'
import 'vue3-photo-preview/dist/index.css'

import VueVideoPlayer from '@videojs-player/vue'
import 'video.js/dist/video-js.css'

import 'highlight.js/styles/stackoverflow-light.css'
import hljsVuePlugin from '@highlightjs/vue-plugin'
import 'highlight.js/lib/common'

import App from '@/App.vue'
import router from '@/router'
import { sendRPC, sendToMain, triggerRPC } from '@/utils/common'
import db from '@/utils/db'
import { T } from '@/i18n/index'
import { store } from '@/store'
import { initTalkingData } from '@/utils/analytic'

webFrame.setVisualZoomLevelLimits(1, 1)

const app = createApp(App)

app.config.globalProperties.$$db = db
app.config.globalProperties.$T = T
app.config.globalProperties.triggerRPC = triggerRPC
app.config.globalProperties.sendRPC = sendRPC
app.config.globalProperties.sendToMain = sendToMain

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
app.use(VueLazyLoad, {
  loading: `file://${__static.replace(/\\/g, '/')}/loading.jpg`,
  error: `file://${__static.replace(/\\/g, '/')}/unknown-file-type.svg`,
  delay: 500
})
app.use(ElementUI)
app.use(router)
app.use(store)
app.use(vue3PhotoPreview)
app.use(pinia)
app.use(hljsVuePlugin)
app.use(VueVideoPlayer)
app.mount('#app')

initTalkingData()
