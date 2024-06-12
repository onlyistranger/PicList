import { ipcRenderer } from 'electron'

import { getRawData } from '@/utils/common'

import { PICLIST_MANAGE_GET_CONFIG, PICLIST_MANAGE_SAVE_CONFIG, PICLIST_MANAGE_REMOVE_CONFIG } from '~/manage/events/constants'

export function saveConfig (config: IObj | string, value?: any) {
  const configObj = typeof config === 'string' ? { [config]: value } : getRawData(config)
  ipcRenderer.send(PICLIST_MANAGE_SAVE_CONFIG, configObj)
}

export async function getConfig<T> (key?: string): Promise<T | undefined> {
  return await ipcRenderer.invoke(PICLIST_MANAGE_GET_CONFIG, key)
}

export function removeConfig (key: string, propName: string) {
  ipcRenderer.send(PICLIST_MANAGE_REMOVE_CONFIG, key, propName)
}
