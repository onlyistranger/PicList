import { IObject, IResult, IGetResult, IFilter } from '@picgo/store/dist/types'

interface IGalleryDB {
  get<T>(filter?: IFilter): Promise<IGetResult<T> | undefined>
  insert<T> (value: T): Promise<IResult<T> | undefined>
  insertMany<T> (value: T[]): Promise<IResult<T>[] | undefined>
  updateById (id: string, value: IObject): Promise<boolean>
  getById<T> (id: string): Promise<IResult<T> | undefined>
  removeById (id: string): Promise<void>
}

declare module 'vue/types/vue' {
  interface Vue {
  }
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $$db: IGalleryDB
    $T: typeof import('@/i18n/index').T
    setDefaultPicBed(picBed: string): void
    triggerRPC<T> (action: import('#/types/enum').IRPCActionType, ...args: any[]): Promise<T | undefined>
    sendRPC (action: import('#/types/enum').IRPCActionType, ...args: any[]): void
    defaultPicBed: string
    sendToMain(channel: string, ...args: any[]): void
  }
  interface GlobalComponents {
    PhotoProvider: typeof import('vue3-photo-preview').PhotoProvider
    PhotoConsumer: typeof import('vue3-photo-preview').PhotoConsumer
    PhotoSlider: typeof import('vue3-photo-preview').PhotoSlider
  }
}
