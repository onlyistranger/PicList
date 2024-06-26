import { ipcRenderer } from 'electron'
import { isReactive, isRef, toRaw, unref } from 'vue'

import { RPC_ACTIONS, RPC_ACTIONS_INVOKE } from '#/events/constants'
import { IRPCActionType } from '#/types/enum'

const isDevelopment = process.env.NODE_ENV !== 'production'

export const handleTalkingDataEvent = (data: ITalkingDataOptions) => {
  const { EventId, Label = '', MapKv = {} } = data
  MapKv.from = window.location.href
  try {
    window.TDAPP.onEvent(EventId, Label, MapKv)
  } catch (e) {
    console.error(e)
  }
  if (isDevelopment) {
    console.log('talkingData', data)
  }
}

/**
 * get raw data from reactive or ref
 */
export const getRawData = (args: any): any => {
  if (isRef(args)) return unref(args)
  if (isReactive(args)) return toRaw(args)
  if (Array.isArray(args)) return args.map(getRawData)
  if (typeof args === 'object' && args !== null) {
    const data = {} as Record<string, any>
    for (const key in args) {
      data[key] = getRawData(args[key])
    }
    return data
  }
  return args
}

export function sendToMain(channel: string, ...args: any[]) {
  const data = getRawData(args)
  ipcRenderer.send(channel, ...data)
}

/**
 * send a rpc request & do not need to wait for the response
 *
 * or the response will be handled by other listener
 */
export function sendRPC(action: IRPCActionType, ...args: any[]): void {
  const data = getRawData(args)
  ipcRenderer.send(RPC_ACTIONS, action, data)
}

export function sendRpcSync(action: IRPCActionType, ...args: any[]) {
  const data = getRawData(args)
  return ipcRenderer.sendSync(RPC_ACTIONS, action, data)
}

/**
 * trigger RPC action
 * TODO: create an isolate rpc handler
 */
export async function triggerRPC<T>(action: IRPCActionType, ...args: any[]): Promise<T | undefined> {
  const data = getRawData(args)
  return await ipcRenderer.invoke(RPC_ACTIONS_INVOKE, action, data)
}
