import { ipcRenderer } from 'electron'

import { deleteFailedLog, getRawData } from '@/utils/common'

export default class SftpPlistApi {
  static async delete (configMap: IStringKeyMap): Promise<boolean> {
    const { fileName, config } = configMap
    try {
      const deleteResult = await ipcRenderer.invoke('delete-sftp-file',
        getRawData(config),
        fileName
      )
      return deleteResult
    } catch (error: any) {
      deleteFailedLog(fileName, 'SFTP', error)
      return false
    }
  }
}
