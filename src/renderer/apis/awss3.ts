import { ipcRenderer } from 'electron'

import { getRawData, triggerRPC } from '@/utils/common'
import { removeFileFromS3InMain } from '~/utils/deleteFunc'
import { deleteFailedLog } from '#/utils/deleteLog'
import { IRPCActionType } from '#/types/enum'

export default class AwsS3Api {
  static async delete(configMap: IStringKeyMap): Promise<boolean> {
    try {
      return ipcRenderer
        ? (await triggerRPC(IRPCActionType.GALLERY_DELETE_AWS_S3_FILE, getRawData(configMap))) || false
        : await removeFileFromS3InMain(getRawData(configMap))
    } catch (error: any) {
      deleteFailedLog(configMap.fileName, 'AWS S3', error)
      return false
    }
  }
}
