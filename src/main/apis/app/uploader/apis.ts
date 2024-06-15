import { Notification, WebContents } from 'electron'
import fs from 'fs-extra'
import { cloneDeep } from 'lodash'

import picgo from '@core/picgo'
import db, { GalleryDB } from '@core/datastore'

import uploader from 'apis/app/uploader'
import windowManager from 'apis/app/window/windowManager'

import { T } from '~/i18n/index'
import { handleCopyUrl, handleUrlEncodeWithSetting } from '~/utils/common'
import pasteTemplate from '~/utils/pasteTemplate'

import { IPasteStyle, IWindowList } from '#/types/enum'
import { configPaths } from '#/utils/configPaths'

const handleClipboardUploading = async (): Promise<false | ImgInfo[]> => {
  const useBuiltinClipboard =
    db.get(configPaths.settings.useBuiltinClipboard) === undefined
      ? true
      : !!db.get(configPaths.settings.useBuiltinClipboard)
  const win = windowManager.getAvailableWindow()
  if (useBuiltinClipboard) {
    return await uploader.setWebContents(win!.webContents).uploadWithBuildInClipboard()
  }
  return await uploader.setWebContents(win!.webContents).upload()
}

export const uploadClipboardFiles = async (): Promise<IStringKeyMap> => {
  const img = await handleClipboardUploading()
  if (img !== false) {
    if (img.length > 0) {
      const trayWindow = windowManager.get(IWindowList.TRAY_WINDOW)
      const pasteStyle = db.get(configPaths.settings.pasteStyle) || IPasteStyle.MARKDOWN
      handleCopyUrl(await pasteTemplate(pasteStyle, img[0], db.get(configPaths.settings.customLink)))
      const isShowResultNotification =
        db.get(configPaths.settings.uploadResultNotification) === undefined
          ? true
          : !!db.get(configPaths.settings.uploadResultNotification)
      if (isShowResultNotification) {
        const notification = new Notification({
          title: T('UPLOAD_SUCCEED'),
          body: img[0].imgUrl!
          // icon: img[0].imgUrl
        })
        setTimeout(() => {
          notification.show()
        }, 100)
      }
      await GalleryDB.getInstance().insert(img[0])
      // trayWindow just be created in mac/windows, not in linux
      trayWindow?.webContents?.send('clipboardFiles', [])
      trayWindow?.webContents?.send('uploadFiles', img)
      if (windowManager.has(IWindowList.SETTING_WINDOW)) {
        windowManager.get(IWindowList.SETTING_WINDOW)!.webContents?.send('updateGallery')
      }
      return {
        url: handleUrlEncodeWithSetting(img[0].imgUrl as string),
        fullResult: img[0]
      }
    } else {
      const notification = new Notification({
        title: T('UPLOAD_FAILED'),
        body: T('TIPS_UPLOAD_NOT_PICTURES')
      })
      notification.show()
      return {
        url: '',
        fullResult: {}
      }
    }
  } else {
    return {
      url: '',
      fullResult: {}
    }
  }
}

export const uploadChoosedFiles = async (
  webContents: WebContents,
  files: IFileWithPath[]
): Promise<IStringKeyMap[]> => {
  const input = files.map(item => item.path)
  const rawInput = cloneDeep(input)
  const imgs = await uploader.setWebContents(webContents).upload(input)
  const result = []
  if (imgs !== false) {
    const pasteStyle = db.get(configPaths.settings.pasteStyle) || IPasteStyle.MARKDOWN
    const deleteLocalFile = db.get(configPaths.settings.deleteLocalFile) || false
    const pasteText: string[] = []
    for (let i = 0; i < imgs.length; i++) {
      if (deleteLocalFile) {
        fs.remove(rawInput[i])
          .then(() => {
            picgo.log.info(`delete local file: ${rawInput[i]}`)
          })
          .catch((err: Error) => {
            picgo.log.error(err)
          })
      }
      pasteText.push(await pasteTemplate(pasteStyle, imgs[i], db.get(configPaths.settings.customLink)))
      const isShowResultNotification =
        db.get(configPaths.settings.uploadResultNotification) === undefined
          ? true
          : !!db.get(configPaths.settings.uploadResultNotification)
      if (isShowResultNotification) {
        const notification = new Notification({
          title: T('UPLOAD_SUCCEED'),
          body: imgs[i].imgUrl!
          // icon: files[i].path
        })
        setTimeout(() => {
          notification.show()
        }, i * 100)
      }
      await GalleryDB.getInstance().insert(imgs[i])
      result.push({
        url: handleUrlEncodeWithSetting(imgs[i].imgUrl!),
        fullResult: imgs[i]
      })
    }
    handleCopyUrl(pasteText.join('\n'))
    // trayWindow just be created in mac/windows, not in linux
    windowManager.get(IWindowList.TRAY_WINDOW)?.webContents?.send('uploadFiles', imgs)
    if (windowManager.has(IWindowList.SETTING_WINDOW)) {
      windowManager.get(IWindowList.SETTING_WINDOW)!.webContents?.send('updateGallery')
    }
    return result
  } else {
    return []
  }
}
