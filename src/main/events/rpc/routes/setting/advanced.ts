import { IRPCActionType } from '#/types/enum'
import server from '~/server'
import webServer from '~/server/webServer'

export default [
  {
    action: IRPCActionType.ADVANCED_UPDATE_SERVER,
    handler: async () => {
      server.restart()
    }
  },
  {
    action: IRPCActionType.ADVANCED_STOP_WEB_SERVER,
    handler: async () => {
      webServer.stop()
    }
  },
  {
    action: IRPCActionType.ADVANCED_RESTART_WEB_SERVER,
    handler: async () => {
      webServer.restart()
    }
  }
]
