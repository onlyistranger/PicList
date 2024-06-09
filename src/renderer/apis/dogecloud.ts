import { ipcRenderer } from 'electron'

import { deleteFailedLog, getRawData } from '@/utils/common'
import { removeFileFromDogeInMain } from '~/utils/deleteFunc'

export default class AwsS3Api {
  static async delete (configMap: IStringKeyMap): Promise<boolean> {
    try {
      return ipcRenderer
        ? await ipcRenderer.invoke('delete-doge-file',
          getRawData(configMap)
        )
        : await removeFileFromDogeInMain(getRawData(configMap))
    } catch (error: any) {
      deleteFailedLog(configMap.fileName, 'DogeCloud', error)
      return false
    }
  }
}
