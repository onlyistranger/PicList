import { sendRPC, triggerRPC } from '@/utils/common'

import { IRPCActionType } from '#/types/enum'

export function saveConfig(config: IObj | string, value?: any) {
  const configObj = typeof config === 'string' ? { [config]: value } : config
  sendRPC(IRPCActionType.MANAGE_SAVE_CONFIG, configObj)
}

export async function getConfig<T>(key?: string): Promise<T | undefined> {
  return await triggerRPC<T>(IRPCActionType.MANAGE_GET_CONFIG, key)
}

export function removeConfig(key: string, propName: string) {
  sendRPC(IRPCActionType.MANAGE_REMOVE_CONFIG, key, propName)
}
