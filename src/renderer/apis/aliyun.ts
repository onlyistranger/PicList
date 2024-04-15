import OSS from 'ali-oss'

interface IConfigMap {
  fileName: string
  config: PartialKeys<IAliYunConfig, 'path'>
}

export default class AliyunApi {
  static #getKey (fileName: string, path?: string): string {
    return path && path !== '/'
      ? `${path.replace(/^\/+|\/+$/, '')}/${fileName}`
      : fileName
  }

  static async delete (configMap: IConfigMap): Promise<boolean> {
    const { fileName, config } = configMap
    try {
      const client = new OSS({ ...config, region: config.area })
      const key = AliyunApi.#getKey(fileName, config.path)
      const result = await client.delete(key)
      return result.res.status === 204
    } catch (error) {
      console.error(error)
      return false
    }
  }
}
