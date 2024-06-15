import crypto from 'crypto'
import { clipboard } from 'electron'
import { EventEmitter } from 'events'

import logger from '@core/picgo/logger'

class ClipboardWatcher extends EventEmitter {
  timer: NodeJS.Timeout | null
  lastImageHash: string | null

  constructor() {
    super()
    this.lastImageHash = null
    this.timer = null
  }

  startListening(watchDelay = 500) {
    this.stopListening(false)

    this.timer = setInterval(() => {
      const image = clipboard.readImage()
      if (image.isEmpty()) return

      const currentImageHash = this.getImageHash(image)
      if (this.lastImageHash === null || this.lastImageHash === currentImageHash) {
        this.lastImageHash = currentImageHash
        return
      }

      this.lastImageHash = currentImageHash
      this.emit('change')
    }, watchDelay)
    logger.info('Start to watch clipboard')
  }

  stopListening(isLog = true) {
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = null
      this.lastImageHash = null
    }
    isLog && logger.info('Stop to watch clipboard')
  }

  getImageHash(image: Electron.NativeImage): string {
    const buffer = image.toBitmap()
    return crypto.createHash('md5').update(buffer).digest('hex')
  }
}

export default new ClipboardWatcher()
