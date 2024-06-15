import { ipcRenderer } from 'electron'

import { removeFileFromSFTPInMain } from '~/utils/deleteFunc'

import { getRawData, triggerRPC } from '@/utils/common'
import { deleteFailedLog } from '#/utils/deleteLog'
import { IRPCActionType } from '#/types/enum'

export default class SftpPlistApi {
  static async delete(configMap: IStringKeyMap): Promise<boolean> {
    const { fileName, config } = configMap
    try {
      return ipcRenderer
        ? (await triggerRPC(IRPCActionType.GALLERY_DELETE_SFTP_FILE, getRawData(config), fileName)) || false
        : await removeFileFromSFTPInMain(getRawData(config), fileName)
    } catch (error: any) {
      deleteFailedLog(fileName, 'SFTP', error)
      return false
    }
  }
}
