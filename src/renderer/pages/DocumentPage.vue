<template>
  <webview
    :src="srcUrl"
    disablewebsecurity
    allowpopups
    autosize="on"
    scrollbars="none"
    style="width: 100%; height: 100%;"
  />
</template>

<script lang="ts" setup>
import { getConfig } from '@/utils/dataSender'
import { onMounted, ref } from 'vue'
import { II18nLanguage } from '~/universal/types/enum'
import { configPaths } from '~/universal/utils/configPaths'

const srcUrl = ref('https://piclist.cn/app.html')

const updateUrl = async () => {
  const lang = await getConfig(configPaths.settings.language) || II18nLanguage.ZH_CN
  srcUrl.value = lang === II18nLanguage.ZH_CN ? 'https://piclist.cn/app.html' : 'https://piclist.cn/en/app.html'
}

onMounted(() => {
  updateUrl()
})

</script>

<script lang="ts">
export default {
  name: 'DocumentPage'
}
</script>
