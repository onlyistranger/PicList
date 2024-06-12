import { ComponentOptions } from 'vue'

import bus from '@/utils/bus'

import { FORCE_UPDATE } from '#/events/constants'

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
    }
  }
}
