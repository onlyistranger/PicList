type IGetLatestVersionArgs = [isCheckBetaVersion: boolean]
type IToolboxCheckArgs = [type: import('./enum').IToolboxItemType]
type IShowDockIconArgs = [visible: boolean]

interface IRPCServer {
  start: () => void
  stop: () => void
  use: (routes: IRPCRoutes) => void
}

type IRPCRoutes = Map<import('./enum').IRPCActionType, {
  handler: IRPCHandler<any>,
  type: import('./enum').IRPCType
}>

type IIPCEvent = import('electron').IpcMainEvent | import('electron').IpcMainInvokeEvent

type IRPCHandler<T> = (event: IIPCEvent, args: any, ) => Promise<T>

interface IRPCRouter {
  add<T>(action: import('./enum').IRPCActionType, handler: IRPCHandler<T>, type: import('./enum').IRPCType):IRPCRouter
  routes: () => IRPCRoutes
}

type IToolboxChecker<T = any> = (event: import('electron').IpcMainEvent) => Promise<T>

type IToolboxCheckerMap<T extends import('./enum').IToolboxItemType> = {
  [type in T]: IToolboxChecker
}

type IToolboxFixMap<T extends import('./enum').IToolboxItemType> = {
  [type in T]: IToolboxChecker<IToolboxCheckRes>
}

type IToolboxCheckRes = {
  type: import('./enum').IToolboxItemType
  status: import('./enum').IToolboxItemCheckStatus,
  msg?: string
  value?: any
}
