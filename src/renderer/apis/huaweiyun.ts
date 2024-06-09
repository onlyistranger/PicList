import { ipcRenderer } from 'electron'

import { deleteFailedLog, getRawData } from '@/utils/common'
import { removeFileFromHuaweiInMain } from '~/utils/deleteFunc'

export default class HuaweicloudApi {
  static async delete (configMap: IStringKeyMap): Promise<boolean> {
    try {
      return ipcRenderer
        ? await ipcRenderer.invoke('delete-huaweicloud-file',
          getRawData(configMap)
        )
        : await removeFileFromHuaweiInMain(getRawData(configMap))
    } catch (error: any) {
      deleteFailedLog(configMap.fileName, 'HuaweiCloud', error)
      return false
    }
  }
}
