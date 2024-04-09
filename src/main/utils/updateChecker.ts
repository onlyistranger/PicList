import db from '~/main/apis/core/datastore'
import { autoUpdater } from 'electron-updater'
import { configPaths } from '~/universal/utils/configPaths'

const updateChecker = async () => {
  let showTip = db.get(configPaths.settings.showUpdateTip)
  if (showTip === undefined) {
    db.set(configPaths.settings.showUpdateTip, true)
    showTip = true
  }
  if (showTip) {
    try {
      await autoUpdater.checkForUpdatesAndNotify()
    } catch (err) {}
  }
}

export default updateChecker
