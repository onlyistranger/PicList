import crypto from 'crypto'
import picgo from '@core/picgo'
import { DEFAULT_AES_PASSWORD } from '~/universal/utils/static'
import { configPaths } from '~/universal/utils/configPaths'

export class AESHelper {
  key: Buffer

  constructor () {
    const userPassword = picgo.getConfig<string>(configPaths.settings.aesPassword) || DEFAULT_AES_PASSWORD
    const fixedSalt = Buffer.from('a8b3c4d2e4f5098712345678feedc0de', 'hex')
    const fixedIterations = 100000
    const keyLength = 32
    this.key = crypto.pbkdf2Sync(userPassword, fixedSalt, fixedIterations, keyLength, 'sha512')
  }

  encrypt (plainText: string) {
    const iv = crypto.randomBytes(16)
    const cipher = crypto.createCipheriv('aes-256-cbc', this.key, iv)
    let encrypted = cipher.update(plainText, 'utf8', 'hex')
    encrypted += cipher.final('hex')
    return `${iv.toString('hex')}:${encrypted}`
  }

  decrypt (encryptedData: string) {
    const [ivHex, encryptedText] = encryptedData.split(':')
    if (!ivHex || !encryptedText) {
      return '{}'
    }
    const iv = Buffer.from(ivHex, 'hex')
    const decipher = crypto.createDecipheriv('aes-256-cbc', this.key, iv)
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8')
    decrypted += decipher.final('utf8')
    return decrypted
  }
}
