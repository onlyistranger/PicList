import { IObject, IResult, IGetResult, IFilter } from '@picgo/store/dist/types'

import { triggerRPC } from '@/utils/common'

import { IRPCActionType } from '#/types/enum'
import { IGalleryDB } from '#/types/extra-vue'

export class GalleryDB implements IGalleryDB {
  async get<T> (filter?: IFilter): Promise<IGetResult<T> | undefined> {
    const res = await this.#msgHandler<IGetResult<T>>(IRPCActionType.GALLERY_GET_DB, filter)
    return res
  }

  async insert<T> (value: T): Promise<IResult<T> | undefined> {
    const res = await this.#msgHandler<IResult<T>>(IRPCActionType.GALLERY_INSERT_DB, value)
    return res
  }

  async insertMany<T> (value: T[]): Promise<IResult<T>[] | undefined> {
    const res = await this.#msgHandler<IResult<T>[]>(IRPCActionType.GALLERY_INSERT_DB_BATCH, value)
    return res
  }

  async updateById (id: string, value: IObject): Promise<boolean> {
    const res = await this.#msgHandler<boolean>(IRPCActionType.GALLERY_UPDATE_BY_ID_DB, id, value) || false
    return res
  }

  async getById<T> (id: string): Promise<IResult<T> | undefined> {
    const res = await this.#msgHandler<IResult<T> | undefined>(IRPCActionType.GALLERY_GET_BY_ID_DB, id)
    return res
  }

  async removeById (id: string): Promise<void> {
    const res = await this.#msgHandler<void>(IRPCActionType.GALLERY_REMOVE_BY_ID_DB, id)
    return res
  }

  async #msgHandler<T> (method: IRPCActionType, ...args: any[]): Promise<T | undefined> {
    return await triggerRPC<T>(method, ...args)
  }
}

export default new GalleryDB()
