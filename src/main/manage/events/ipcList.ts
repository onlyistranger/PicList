import { ipcMain, IpcMainInvokeEvent, dialog, app, shell } from 'electron'
import fs from 'fs-extra'
import path from 'path'

import UpDownTaskQueue from '~/manage/datastore/upDownTaskQueue'
import manageCoreIPC from '~/manage/events/manageCoreIPC'
import { ManageApi } from '~/manage/manageApi'
import { downloadFileFromUrl } from '~/manage/utils/common'

import { selectDownloadFolder } from '#/utils/static'

export const manageIpcList = {
  listen() {
    manageCoreIPC.listen()

    ipcMain.handle('getBucketList', async (_: IpcMainInvokeEvent, currentPicBed: string) => {
      const manage = new ManageApi(currentPicBed)
      return manage.getBucketList()
    })

    ipcMain.handle('createBucket', async (_: IpcMainInvokeEvent, currentPicBed: string, param: IStringKeyMap) => {
      const manage = new ManageApi(currentPicBed)
      return manage.createBucket(param)
    })

    ipcMain.handle('getBucketFileList', async (_: IpcMainInvokeEvent, currentPicBed: string, param: IStringKeyMap) => {
      const manage = new ManageApi(currentPicBed)
      return manage.getBucketFileList(param)
    })

    ipcMain.handle('getBucketDomain', async (_: IpcMainInvokeEvent, currentPicBed: string, param: IStringKeyMap) => {
      const manage = new ManageApi(currentPicBed)
      const result = await manage.getBucketDomain(param)
      return result
    })

    ipcMain.handle('setBucketAclPolicy', async (_: IpcMainInvokeEvent, currentPicBed: string, param: IStringKeyMap) => {
      const manage = new ManageApi(currentPicBed)
      return manage.setBucketAclPolicy(param)
    })

    ipcMain.handle('renameBucketFile', async (_: IpcMainInvokeEvent, currentPicBed: string, param: IStringKeyMap) => {
      const manage = new ManageApi(currentPicBed)
      return manage.renameBucketFile(param)
    })

    ipcMain.handle('deleteBucketFile', async (_: IpcMainInvokeEvent, currentPicBed: string, param: IStringKeyMap) => {
      const manage = new ManageApi(currentPicBed)
      return manage.deleteBucketFile(param)
    })

    ipcMain.handle('deleteBucketFolder', async (_: IpcMainInvokeEvent, currentPicBed: string, param: IStringKeyMap) => {
      const manage = new ManageApi(currentPicBed)
      return manage.deleteBucketFolder(param)
    })

    ipcMain.on('getBucketListBackstage', async (_: IpcMainInvokeEvent, currentPicBed: string, param: IStringKeyMap) => {
      const manage = new ManageApi(currentPicBed)
      return manage.getBucketListBackstage(param)
    })

    ipcMain.on(
      'getBucketListRecursively',
      async (_: IpcMainInvokeEvent, currentPicBed: string, param: IStringKeyMap) => {
        const manage = new ManageApi(currentPicBed)
        return manage.getBucketListRecursively(param)
      }
    )

    ipcMain.handle('convertPathToBase64', async (_: IpcMainInvokeEvent, filePath: string) => {
      const res = fs.readFileSync(filePath, 'base64')
      return res
    })

    ipcMain.handle('openFileSelectDialog', async () => {
      const res = await dialog.showOpenDialog({
        properties: ['openFile', 'multiSelections']
      })
      if (res.canceled) {
        return []
      } else {
        return res.filePaths
      }
    })

    ipcMain.handle('getPreSignedUrl', async (_: IpcMainInvokeEvent, currentPicBed: string, param: IStringKeyMap) => {
      const manage = new ManageApi(currentPicBed)
      return manage.getPreSignedUrl(param)
    })

    ipcMain.handle('getUploadTaskList', async () => {
      return UpDownTaskQueue.getInstance().getAllUploadTask()
    })

    ipcMain.handle('getDownloadTaskList', async () => {
      return UpDownTaskQueue.getInstance().getAllDownloadTask()
    })

    ipcMain.on('uploadBucketFile', async (_: IpcMainInvokeEvent, currentPicBed: string, param: IStringKeyMap) => {
      const manage = new ManageApi(currentPicBed)
      return manage.uploadBucketFile(param)
    })

    ipcMain.on('downloadBucketFile', async (_: IpcMainInvokeEvent, currentPicBed: string, param: IStringKeyMap) => {
      const manage = new ManageApi(currentPicBed)
      return manage.downloadBucketFile(param)
    })

    ipcMain.handle('createBucketFolder', async (_: IpcMainInvokeEvent, currentPicBed: string, param: IStringKeyMap) => {
      const manage = new ManageApi(currentPicBed)
      return manage.createBucketFolder(param)
    })

    ipcMain.on('deleteUploadedTask', async () => {
      UpDownTaskQueue.getInstance().removeUploadedTask()
    })

    ipcMain.on('deleteAllUploadedTask', async () => {
      UpDownTaskQueue.getInstance().clearUploadTaskQueue()
    })

    ipcMain.on('deleteDownloadedTask', async () => {
      UpDownTaskQueue.getInstance().removeDownloadedTask()
    })

    ipcMain.on('deleteAllDownloadedTask', async () => {
      UpDownTaskQueue.getInstance().clearDownloadTaskQueue()
    })

    ipcMain.handle(selectDownloadFolder, async () => {
      const res = await dialog.showOpenDialog({
        properties: ['openDirectory']
      })
      return res.filePaths[0]
    })

    ipcMain.handle('getDefaultDownloadFolder', async () => {
      return app.getPath('downloads')
    })

    ipcMain.on('OpenDownloadedFolder', async (_: IpcMainInvokeEvent, path: string | undefined) => {
      if (path) {
        shell.showItemInFolder(path)
      } else {
        shell.openPath(app.getPath('downloads'))
      }
    })

    ipcMain.on('OpenLocalFile', async (_: IpcMainInvokeEvent, fullPath: string) => {
      fs.existsSync(fullPath) ? shell.showItemInFolder(fullPath) : shell.openPath(path.dirname(fullPath))
    })

    ipcMain.handle('downloadFileFromUrl', async (_: IpcMainInvokeEvent, urls: string[]) => {
      const res = await downloadFileFromUrl(urls)
      return res
    })
  }
}
