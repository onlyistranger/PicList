import { ipcRenderer } from 'electron'

import { removeFileFromHuaweiInMain } from '~/utils/deleteFunc'

import { getRawData, triggerRPC } from '@/utils/common'
import { deleteFailedLog } from '#/utils/deleteLog'
import { IRPCActionType } from '#/types/enum'

export default class HuaweicloudApi {
  static async delete(configMap: IStringKeyMap): Promise<boolean> {
    try {
      return ipcRenderer
        ? (await triggerRPC(IRPCActionType.GALLERY_DELETE_HUAWEI_OSS_FILE, getRawData(configMap))) || false
        : await removeFileFromHuaweiInMain(getRawData(configMap))
    } catch (error: any) {
      deleteFailedLog(configMap.fileName, 'HuaweiCloud', error)
      return false
    }
  }
}
