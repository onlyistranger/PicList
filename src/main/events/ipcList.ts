import {
  app,
  ipcMain,
  shell,
  Notification,
  IpcMainEvent,
  BrowserWindow,
  screen,
  IpcMainInvokeEvent
} from 'electron'
import fs from 'fs-extra'
import path from 'path'
import { ISftpPlistConfig } from 'piclist'

import bus from '@core/bus'
import logger from '@core/picgo/logger'
import db, { GalleryDB } from '@core/datastore'

import shortKeyHandler from 'apis/app/shortKey/shortKeyHandler'
import uploader from 'apis/app/uploader'
import {
  uploadClipboardFiles,
  uploadChoosedFiles
} from 'apis/app/uploader/apis'
import windowManager from 'apis/app/window/windowManager'

import { T } from '~/i18n'
import server from '~/server'
import picgoCoreIPC from '~/events/picgoCoreIPC'
import { buildMainPageMenu, buildMiniPageMenu, buildPluginPageMenu, buildPicBedListMenu } from '~/events/remotes/menu'
import { handleCopyUrl, generateShortUrl, setTrayToolTip } from '~/utils/common'
import { removeFileFromS3InMain, removeFileFromDogeInMain, removeFileFromHuaweiInMain } from '~/utils/deleteFunc'
import getPicBeds from '~/utils/getPicBeds'
import pasteTemplate from '~/utils/pasteTemplate'
import SSHClient from '~/utils/sshClient'
import { uploadFile, downloadFile } from '~/utils/syncSettings'
import webServer from '~/server/webServer'

import {
  TOGGLE_SHORTKEY_MODIFIED_MODE,
  OPEN_DEVTOOLS,
  SHOW_MINI_PAGE_MENU,
  MINIMIZE_WINDOW,
  CLOSE_WINDOW,
  SHOW_MAIN_PAGE_MENU,
  SHOW_UPLOAD_PAGE_MENU,
  OPEN_USER_STORE_FILE,
  OPEN_URL,
  RELOAD_APP,
  SHOW_PLUGIN_PAGE_MENU,
  SET_MINI_WINDOW_POS,
  GET_PICBEDS,
  HIDE_DOCK
} from '#/events/constants'
import { configPaths } from '#/utils/configPaths'
import { ILogType, IPasteStyle, IWindowList } from '#/types/enum'

const STORE_PATH = app.getPath('userData')
const commonConfigList = ['data.json', 'data.bak.json']
const manageConfigList = ['manage.json', 'manage.bak.json']

export default {
  listen () {
    picgoCoreIPC.listen()
    // Upload Related IPC
    // from macOS tray
    ipcMain.on('uploadClipboardFiles', async () => {
      const trayWindow = windowManager.get(IWindowList.TRAY_WINDOW)!
      // macOS use builtin clipboard is OK
      const img = await uploader.setWebContents(trayWindow.webContents).uploadWithBuildInClipboard()
      if (img !== false) {
        const pasteStyle = db.get(configPaths.settings.pasteStyle) || IPasteStyle.MARKDOWN
        handleCopyUrl(await (pasteTemplate(pasteStyle, img[0], db.get(configPaths.settings.customLink))))
        const isShowResultNotification = db.get(configPaths.settings.uploadResultNotification) === undefined ? true : !!db.get(configPaths.settings.uploadResultNotification)
        if (isShowResultNotification) {
          const notification = new Notification({
            title: T('UPLOAD_SUCCEED'),
            body: img[0].imgUrl!
            // icon: file[0]
            // icon: img[0].imgUrl
          })
          notification.show()
        }
        await GalleryDB.getInstance().insert(img[0])
        trayWindow.webContents.send('clipboardFiles', [])
        if (windowManager.has(IWindowList.SETTING_WINDOW)) {
          windowManager.get(IWindowList.SETTING_WINDOW)!.webContents.send('updateGallery')
        }
      }
      trayWindow.webContents.send('uploadFiles')
    })

    ipcMain.on('uploadClipboardFilesFromUploadPage', () => {
      uploadClipboardFiles()
    })

    ipcMain.on('uploadChoosedFiles', async (evt: IpcMainEvent, files: IFileWithPath[]) => {
      return uploadChoosedFiles(evt.sender, files)
    })

    ipcMain.on('setTrayToolTip', (_: IpcMainEvent, title: string) => {
      setTrayToolTip(title)
    })

    // ShortKey Related IPC
    ipcMain.on('updateShortKey', (evt: IpcMainEvent, item: IShortKeyConfig, oldKey: string, from: string) => {
      const result = shortKeyHandler.updateShortKey(item, oldKey, from)
      evt.sender.send('updateShortKeyResponse', result)
      if (result) {
        const notification = new Notification({
          title: T('OPERATION_SUCCEED'),
          body: T('TIPS_SHORTCUT_MODIFIED_SUCCEED')
        })
        notification.show()
      } else {
        const notification = new Notification({
          title: T('OPERATION_FAILED'),
          body: T('TIPS_SHORTCUT_MODIFIED_CONFLICT')
        })
        notification.show()
      }
    })

    ipcMain.on('bindOrUnbindShortKey', (_: IpcMainEvent, item: IShortKeyConfig, from: string) => {
      const result = shortKeyHandler.bindOrUnbindShortKey(item, from)
      if (result) {
        const notification = new Notification({
          title: T('OPERATION_SUCCEED'),
          body: T('TIPS_SHORTCUT_MODIFIED_SUCCEED')
        })
        notification.show()
      } else {
        const notification = new Notification({
          title: T('OPERATION_FAILED'),
          body: T('TIPS_SHORTCUT_MODIFIED_CONFLICT')
        })
        notification.show()
      }
    })

    // Gallery image cloud delete IPC

    ipcMain.on('logDeleteMsg', async (_: IpcMainEvent, msg: string, logLevel: ILogType) => {
      logger[logLevel](msg)
    })

    ipcMain.handle('delete-sftp-file', async (_: IpcMainInvokeEvent, config: ISftpPlistConfig, fileName: string) => {
      try {
        const client = SSHClient.instance
        await client.connect(config)
        const uploadPath = `/${(config.uploadPath || '')}/`.replace(/\/+/g, '/')
        const remote = path.join(uploadPath, fileName)
        const deleteResult = await client.deleteFileSFTP(config, remote)
        client.close()
        return deleteResult
      } catch (err: any) {
        logger.error(err)
        return false
      }
    })

    ipcMain.handle('delete-aws-s3-file', async (_: IpcMainInvokeEvent, configMap: IStringKeyMap) => {
      const result = await removeFileFromS3InMain(configMap)
      return result
    })

    ipcMain.handle('delete-doge-file', async (_: IpcMainInvokeEvent, configMap: IStringKeyMap) => {
      const result = await removeFileFromDogeInMain(configMap)
      return result
    })

    ipcMain.handle('delete-huaweicloud-file', async (_: IpcMainInvokeEvent, configMap: IStringKeyMap) => {
      const result = await removeFileFromHuaweiInMain(configMap)
      return result
    })

    // migrate from PicGo

    ipcMain.handle('migrateFromPicGo', async () => {
      const picGoConfigPath = STORE_PATH.replace('piclist', 'picgo')
      const files = [
        'data.json',
        'data.bak.json',
        'picgo.db',
        'picgo.bak.db'
      ]
      try {
        await Promise.all(files.map(async file => {
          const sourcePath = path.join(picGoConfigPath, file)
          const targetPath = path.join(STORE_PATH, file.replace('picgo', 'piclist'))
          await fs.remove(targetPath)
          await fs.copy(sourcePath, targetPath, { overwrite: true })
        }
        ))
        return true
      } catch (err: any) {
        logger.error(err)
        return false
      }
    })

    // PicList Setting page IPC

    ipcMain.on('autoStart', (_: IpcMainEvent, val: boolean) => {
      app.setLoginItemSettings({
        openAtLogin: val
      })
    })

    ipcMain.handle('getShortUrl', async (_: IpcMainInvokeEvent, url: string) => {
      const shortUrl = await generateShortUrl(url)
      return shortUrl
    })

    ipcMain.handle('uploadCommonConfig', async () => {
      return await uploadFile(commonConfigList)
    })

    ipcMain.handle('downloadCommonConfig', async () => {
      return await downloadFile(commonConfigList)
    })

    ipcMain.handle('uploadManageConfig', async () => {
      return await uploadFile(manageConfigList)
    })

    ipcMain.handle('downloadManageConfig', async () => {
      return await downloadFile(manageConfigList)
    })

    ipcMain.handle('uploadAllConfig', async () => {
      return await uploadFile([...commonConfigList, ...manageConfigList])
    })

    ipcMain.handle('downloadAllConfig', async () => {
      return await downloadFile([...commonConfigList, ...manageConfigList])
    })

    ipcMain.on('toggleMainWindowAlwaysOnTop', () => {
      const mainWindow = windowManager.get(IWindowList.SETTING_WINDOW)!
      const isAlwaysOnTop = mainWindow.isAlwaysOnTop()
      mainWindow.setAlwaysOnTop(!isAlwaysOnTop)
    })

    // Window operation API

    ipcMain.on('openSettingWindow', () => {
      windowManager.get(IWindowList.SETTING_WINDOW)!.show()
      const autoCloseMiniWindow = db.get(configPaths.settings.autoCloseMiniWindow) || false
      if (autoCloseMiniWindow) {
        if (windowManager.has(IWindowList.MINI_WINDOW)) {
          windowManager.get(IWindowList.MINI_WINDOW)!.hide()
        }
      }
    })

    ipcMain.on('openManualWindow', () => {
      windowManager.get(IWindowList.MANUAL_WINDOW)!.show()
    })

    ipcMain.on('openMiniWindow', () => {
      const miniWindow = windowManager.get(IWindowList.MINI_WINDOW)!
      const settingWindow = windowManager.get(IWindowList.SETTING_WINDOW)!
      miniWindow.removeAllListeners()
      if (db.get(configPaths.settings.miniWindowOntop)) {
        miniWindow.setAlwaysOnTop(true)
      }
      const { width, height } = screen.getPrimaryDisplay().workAreaSize
      const lastPosition = db.get(configPaths.settings.miniWindowPosition)
      if (lastPosition) {
        miniWindow.setPosition(lastPosition[0], lastPosition[1])
      } else {
        miniWindow.setPosition(width - 100, height - 100)
      }
      const setPositionFunc = () => {
        const position = miniWindow.getPosition()
        db.set(configPaths.settings.miniWindowPosition, position)
      }
      miniWindow.on('close', setPositionFunc)
      miniWindow.on('move', setPositionFunc)
      miniWindow.show()
      miniWindow.focus()
      settingWindow.hide()
    })

    ipcMain.on('updateMiniIcon', (_: IpcMainEvent, iconPath: string) => {
      const miniWindow = windowManager.get(IWindowList.MINI_WINDOW)!
      miniWindow.webContents.send('updateMiniIcon', iconPath)
    })

    ipcMain.on('miniWindowOntop', (_: IpcMainEvent, val: boolean) => {
      const miniWindow = windowManager.get(IWindowList.MINI_WINDOW)!
      miniWindow.setAlwaysOnTop(val)
    })

    ipcMain.on('refreshSettingWindow', () => {
      const settingWindow = windowManager.get(IWindowList.SETTING_WINDOW)!
      settingWindow.webContents.reloadIgnoringCache()
    })

    ipcMain.on(GET_PICBEDS, (evt: IpcMainEvent) => {
      const picBeds = getPicBeds()
      evt.sender.send(GET_PICBEDS, picBeds)
      evt.returnValue = picBeds
    })

    ipcMain.on(TOGGLE_SHORTKEY_MODIFIED_MODE, (_: IpcMainEvent, val: boolean) => {
      bus.emit(TOGGLE_SHORTKEY_MODIFIED_MODE, val)
    })

    ipcMain.on('updateServer', () => {
      server.restart()
    })
    ipcMain.on('stopWebServer', () => {
      webServer.stop()
    })
    ipcMain.on('restartWebServer', () => {
      webServer.restart()
    })
    ipcMain.on(OPEN_DEVTOOLS, (event: IpcMainEvent) => {
      event.sender.openDevTools()
    })
    // menu & window methods
    ipcMain.on(SHOW_MINI_PAGE_MENU, () => {
      const window = windowManager.get(IWindowList.MINI_WINDOW)!
      const menu = buildMiniPageMenu()
      menu.popup({
        window
      })
    })
    ipcMain.on(SHOW_MAIN_PAGE_MENU, () => {
      const window = windowManager.get(IWindowList.SETTING_WINDOW)!
      const menu = buildMainPageMenu(window)
      menu.popup({
        window
      })
    })
    ipcMain.on(SHOW_UPLOAD_PAGE_MENU, () => {
      const window = windowManager.get(IWindowList.SETTING_WINDOW)!
      const menu = buildPicBedListMenu()
      menu.popup({
        window
      })
    })
    ipcMain.on(SHOW_PLUGIN_PAGE_MENU, (_: IpcMainEvent, plugin: IPicGoPlugin) => {
      const window = windowManager.get(IWindowList.SETTING_WINDOW)!
      const menu = buildPluginPageMenu(plugin)
      menu.popup({
        window
      })
    })
    ipcMain.on(MINIMIZE_WINDOW, () => {
      const window = BrowserWindow.getFocusedWindow()
      window?.minimize()
    })
    ipcMain.on(CLOSE_WINDOW, () => {
      const window = BrowserWindow.getFocusedWindow()
      if (process.platform === 'linux') {
        window?.hide()
      } else {
        window?.close()
      }
    })
    ipcMain.on(OPEN_USER_STORE_FILE, (_: IpcMainEvent, filePath: string) => {
      const abFilePath = path.join(STORE_PATH, filePath)
      shell.openPath(abFilePath)
    })
    ipcMain.on(OPEN_URL, (_: IpcMainEvent, url: string) => {
      shell.openExternal(url)
    })
    ipcMain.on(RELOAD_APP, () => {
      app.relaunch()
      app.exit(0)
    })
    ipcMain.on(SET_MINI_WINDOW_POS, (_: IpcMainEvent, pos: IMiniWindowPos) => {
      const window = BrowserWindow.getFocusedWindow()
      window?.setBounds(pos)
    })
    ipcMain.on(HIDE_DOCK, (_: IpcMainEvent, val: boolean) => {
      if (val) {
        app.dock.hide()
      } else {
        app.dock.show()
      }
    })
  },
  dispose () {}
}
