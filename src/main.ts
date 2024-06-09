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
import 'highlight.js/styles/atom-one-dark.css'
import hljsVuePlugin from '@highlightjs/vue-plugin'
import hljsCommon from 'highlight.js/lib/common'
import 'video.js/dist/video-js.css'

import App from '@/App.vue'
import router from '@/router'
import db from '@/utils/db'
import { T } from '@/i18n/index'
import { store } from '@/store'
import { initTalkingData } from '@/utils/analytic'
import { getConfig, saveConfig, sendToMain, triggerRPC } from '@/utils/dataSender'
import { mainMixin } from '@/utils/mainMixin'
import { dragMixin } from '@/utils/mixin'

webFrame.setVisualZoomLevelLimits(1, 1)

const app = createApp(App)

app.config.globalProperties.$$db = db
app.config.globalProperties.$T = T
app.config.globalProperties.getConfig = getConfig
app.config.globalProperties.triggerRPC = triggerRPC
app.config.globalProperties.saveConfig = saveConfig
app.config.globalProperties.sendToMain = sendToMain

app.mixin(mainMixin)
app.mixin(dragMixin)
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

app.use(VueLazyLoad, {
  error: `file://${__static.replace(/\\/g, '/')}/unknown-file-type.svg`
})
app.use(ElementUI)
app.use(router)
app.use(store)
app.use(vue3PhotoPreview)
app.use(pinia)
console.log(hljsCommon.highlightAuto('<h1>Highlight.js has been registered successfully!</h1>').value)
app.use(hljsVuePlugin)
app.use(VueVideoPlayer)
app.mount('#app')

initTalkingData()
