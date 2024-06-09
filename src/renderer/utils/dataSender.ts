import { ipcRenderer, IpcRendererEvent } from 'electron'
import { v4 as uuid } from 'uuid'

import { getRawData } from '@/utils/common'

import { PICGO_SAVE_CONFIG, PICGO_GET_CONFIG, RPC_ACTIONS, PICGO_GET_CONFIG_SYNC } from '#/events/constants'
import { IRPCActionType } from '#/types/enum'

export function saveConfig (config: IObj | string, value?: any) {
  const configObject = typeof config === 'string' ? { [config]: value } : getRawData(config)
  ipcRenderer.send(PICGO_SAVE_CONFIG, configObject)
}

export async function getConfig<T> (key?: string): Promise<T | undefined> {
  return await ipcRenderer.invoke(PICGO_GET_CONFIG, key)
}

export async function getConfigSync<T> (key?: string): Promise<T | undefined> {
  return await ipcRenderer.sendSync(PICGO_GET_CONFIG_SYNC, key)
}

/**
   * trigger RPC action
   * TODO: create an isolate rpc handler
   */
export function triggerRPC<T> (action: IRPCActionType, ...args: any[]): Promise<T | null> {
  return new Promise((resolve) => {
    const callbackId = uuid()
    const callback = (_event: IpcRendererEvent, data: T | null, returnActionType: IRPCActionType, returnCallbackId: string) => {
      if (returnCallbackId === callbackId && returnActionType === action) {
        resolve(data)
        ipcRenderer.removeListener(RPC_ACTIONS, callback)
      }
    }
    const data = getRawData(args)
    ipcRenderer.on(RPC_ACTIONS, callback)
    ipcRenderer.send(RPC_ACTIONS, action, data, callbackId)
  })
}

/**
 * send a rpc request & do not need to wait for the response
 *
 * or the response will be handled by other listener
 */
export function sendRPC (action: IRPCActionType, ...args: any[]): void {
  const data = getRawData(args)
  ipcRenderer.send(RPC_ACTIONS, action, data)
}
