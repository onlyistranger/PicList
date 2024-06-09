import { reactive, InjectionKey, readonly, App, UnwrapRef, ref } from 'vue'
import { saveConfig } from '@/utils/dataSender'
import { configPaths } from '#/utils/configPaths'

export interface IState {
  defaultPicBed: string
}

export interface IStore {
  state: UnwrapRef<IState>
  setDefaultPicBed: (type: string) => void
  updateForceUpdateTime: () => void
}

export const storeKey: InjectionKey<IStore> = Symbol('store')

// state
const state: IState = reactive({
  defaultPicBed: 'smms'
})

const forceUpdateTime = ref<number>(Date.now())

// methods
const setDefaultPicBed = (type: string) => {
  saveConfig({
    [configPaths.picBed.current]: type,
    [configPaths.picBed.uploader]: type
  })
  state.defaultPicBed = type
}

const updateForceUpdateTime = () => {
  forceUpdateTime.value = Date.now()
}

export const store = {
  install (app: App) {
    app.provide(storeKey, {
      state: readonly(state),
      setDefaultPicBed,
      updateForceUpdateTime
    })
    app.provide('forceUpdateTime', forceUpdateTime)
  }
}
