import { ipcRenderer } from 'electron'
import { ILogType, IRPCActionType } from '#/types/enum'
import { sendRPC } from '@/utils/common'

export const deleteLog = (fileName?: string, type?: string, isSuccess = true, msg?: string) => {
  ipcRenderer
    ? sendRPC(
        IRPCActionType.GALLERY_LOG_DELETE_MSG,
        msg || `Delete ${fileName} on ${type} success`,
        isSuccess ? ILogType.success : ILogType.error
      )
    : console.log(`Delete ${fileName} on ${type} success`)
}

export const deleteFailedLog = (fileName: string, type: string, error: any) => {
  deleteLog(fileName, type, false)
  ipcRenderer ? sendRPC(IRPCActionType.GALLERY_LOG_DELETE_MSG, error, ILogType.error) : console.error(error)
}
