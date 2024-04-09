import db from '~/main/apis/core/datastore'
import { i18nManager } from '~/main/i18n'
import { II18nLanguage } from '~/universal/types/enum'
import { configPaths } from '~/universal/utils/configPaths'

export const initI18n = () => {
  const currentLanguage = db.get(configPaths.settings.language) || II18nLanguage.ZH_CN
  i18nManager.setCurrentLanguage(currentLanguage)
}
