import { checkClipboardUploadMap, fixClipboardUploadMap } from '~/events/rpc/routes/toolbox/checkClipboardUpload'
import { checkFileMap, fixFileMap } from '~/events/rpc/routes/toolbox/checkFile'
import { checkProxyMap } from '~/events/rpc/routes/toolbox/checkProxy'
import { RPCRouter } from '~/events/rpc/router'

import { IRPCActionType, IToolboxItemType } from '#/types/enum'

const toolboxRouter = new RPCRouter()

const toolboxCheckMap: Partial<IToolboxCheckerMap<IToolboxItemType>> = {
  ...checkFileMap,
  ...checkClipboardUploadMap,
  ...checkProxyMap
}

const toolboxFixMap: Partial<IToolboxFixMap<IToolboxItemType>> = {
  ...fixFileMap,
  ...fixClipboardUploadMap
}

toolboxRouter
  .add(IRPCActionType.TOOLBOX_CHECK, async (args, event) => {
    const [type] = args as IToolboxCheckArgs
    if (type) {
      const handler = toolboxCheckMap[type]
      if (handler) {
        handler(event)
      }
    } else {
      // do check all
      for (const key in toolboxCheckMap) {
        const handler = toolboxCheckMap[key as IToolboxItemType]
        if (handler) {
          handler(event)
        }
      }
    }
  })
  .add(IRPCActionType.TOOLBOX_CHECK_FIX, async (args, event) => {
    const [type] = args as IToolboxCheckArgs
    const handler = toolboxFixMap[type]
    if (handler) {
      return await handler(event)
    }
  })

export {
  toolboxRouter
}
