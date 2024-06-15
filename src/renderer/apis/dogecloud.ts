import { ipcRenderer } from 'electron'

import { removeFileFromDogeInMain } from '~/utils/deleteFunc'

import { getRawData, triggerRPC } from '@/utils/common'
import { deleteFailedLog } from '#/utils/deleteLog'
import { IRPCActionType } from '#/types/enum'

export default class AwsS3Api {
  static async delete(configMap: IStringKeyMap): Promise<boolean> {
    try {
      return ipcRenderer
        ? (await triggerRPC(IRPCActionType.GALLERY_DELETE_DOGE_FILE, getRawData(configMap))) || false
        : await removeFileFromDogeInMain(getRawData(configMap))
    } catch (error: any) {
      deleteFailedLog(configMap.fileName, 'DogeCloud', error)
      return false
    }
  }
}
