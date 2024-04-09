import Upyun from 'upyun'

interface IConfigMap {
  fileName: string
  config: PartialKeys<IUpYunConfig, 'path'>
}

export default class UpyunApi {
  static async delete (configMap: IConfigMap): Promise<boolean> {
    const { fileName, config: { bucket, operator, password, path } } = configMap
    try {
      const service = new Upyun.Service(bucket, operator, password)
      const client = new Upyun.Client(service)
      let key
      if (path === '/' || !path) {
        key = fileName
      } else {
        key = `${path.replace(/^\/+|\/+$/, '')}/${fileName}`
      }
      return await client.deleteFile(key)
    } catch (error) {
      console.log(error)
      return false
    }
  }
}
