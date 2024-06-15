import { ipcRenderer } from 'electron'

import { sendRPC, triggerRPC } from '@/utils/common'

import { RPC_ACTIONS } from '#/events/constants'
import { IRPCActionType } from 'root/src/universal/types/enum'

export function saveConfig(config: IObj | string, value?: any) {
  const configObject = typeof config === 'string' ? { [config]: value } : config
  sendRPC(IRPCActionType.PICLIST_SAVE_CONFIG, configObject)
}

export async function getConfig<T>(key?: string): Promise<T | undefined> {
  return await triggerRPC<T>(IRPCActionType.PICLIST_GET_CONFIG, key)
}

export async function getConfigSync<T>(key?: string): Promise<T | undefined> {
  return await ipcRenderer.sendSync(RPC_ACTIONS, IRPCActionType.PICLIST_GET_CONFIG_SYNC, [key])
}
