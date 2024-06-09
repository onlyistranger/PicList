import { ipcRenderer } from 'electron'
import { ComponentOptions } from 'vue'

import bus from '@/utils/bus'

import { FORCE_UPDATE, GET_PICBEDS } from '#/events/constants'

export const mainMixin: ComponentOptions = {
  inject: ['forceUpdateTime'],

  created () {
    // FIXME: may be memory leak
    this?.$watch('forceUpdateTime', (newVal: number, oldVal: number) => {
      if (oldVal !== newVal) {
        this?.$forceUpdate()
      }
    })
  },

  methods: {
    forceUpdate () {
      bus.emit(FORCE_UPDATE)
    },
    getPicBeds () {
      ipcRenderer.send(GET_PICBEDS)
    }
  }
}
