import { ipcRenderer } from 'electron'

import { deleteFailedLog, getRawData } from '@/utils/common'
import { removeFileFromS3InMain } from '~/utils/deleteFunc'

export default class AwsS3Api {
  static async delete (configMap: IStringKeyMap): Promise<boolean> {
    try {
      return ipcRenderer
        ? await ipcRenderer.invoke('delete-aws-s3-file',
          getRawData(configMap)
        )
        : await removeFileFromS3InMain(getRawData(configMap))
    } catch (error: any) {
      deleteFailedLog(configMap.fileName, 'AWS S3', error)
      return false
    }
  }
}
