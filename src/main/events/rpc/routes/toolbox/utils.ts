import { IpcMainEvent } from 'electron'
import { IRPCActionType, IToolboxItemType } from '#/types/enum'

export const sendToolboxResWithType = (type: IToolboxItemType) => (event: IpcMainEvent, res?: Omit<IToolboxCheckRes, 'type'>) => {
  return event.sender.send(IRPCActionType.TOOLBOX_CHECK_RES, {
    ...res,
    type
  })
}
