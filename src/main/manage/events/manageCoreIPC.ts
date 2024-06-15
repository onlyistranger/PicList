import { IpcMainEvent, IpcMainInvokeEvent, ipcMain } from 'electron'

import getManageApi from '~/manage/Main'
import {
  PICLIST_MANAGE_GET_CONFIG,
  PICLIST_MANAGE_SAVE_CONFIG,
  PICLIST_MANAGE_REMOVE_CONFIG
} from '~/manage/events/constants'

const manageApi = getManageApi()

const handleManageGetConfig = () => {
  ipcMain.handle(PICLIST_MANAGE_GET_CONFIG, (_: IpcMainInvokeEvent, key: string | undefined) => {
    return manageApi.getConfig(key)
  })
}

const handleManageSaveConfig = () => {
  ipcMain.on(PICLIST_MANAGE_SAVE_CONFIG, (_: IpcMainEvent, data: any) => {
    manageApi.saveConfig(data)
  })
}

const handleManageRemoveConfig = () => {
  ipcMain.on(PICLIST_MANAGE_REMOVE_CONFIG, (_: IpcMainEvent, key: string, propName: string) => {
    manageApi.removeConfig(key, propName)
  })
}

export default {
  listen() {
    handleManageGetConfig()
    handleManageSaveConfig()
    handleManageRemoveConfig()
  }
}
