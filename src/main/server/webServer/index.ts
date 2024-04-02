import http from 'http'
import fs from 'fs-extra'
import path from 'path'
import picgo from '@core/picgo'
import logger from '../../apis/core/picgo/logger'

const defaultPath = process.platform === 'win32' ? 'C:/Users/' : '/'

function generateDirectoryListingHtml (files: any[], requestPath: any) {
  let html = '<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body><h1>Directory Listing</h1><ul>'
  files.forEach((file: string) => {
    html += `<li><a href="${path.join(requestPath, file)}">${file}</a></li>`
  })
  html += '</ul></body></html>'
  return html
}

class WebServer {
  private server: http.Server
  private config: IStringKeyMap

  constructor () {
    this.config = this.getConfigWithDefaults()
    this.server = this.getServer()
  }

  getConfigWithDefaults (): IStringKeyMap {
    const enableWebServer = picgo.getConfig<boolean>('settings.enableWebServer') || false
    const webServerHost = picgo.getConfig<string>('settings.webServerHost') || '0.0.0.0'
    const webServerPort = picgo.getConfig<number>('settings.webServerPort') || 37777
    const webServerPath = picgo.getConfig<string>('settings.webServerPath') || defaultPath
    return { enableWebServer, webServerHost, webServerPort, webServerPath }
  }

  getServer (): http.Server {
    return http.createServer((req, res) => {
      const requestPath = req.url?.split('?')[0]
      const filePath = path.join(this.config.webServerPath, decodeURIComponent(requestPath as string))

      fs.stat(filePath, (err, stats) => {
        if (err) {
          res.writeHead(404)
          res.end('404 Not Found')
          return
        }

        if (stats.isDirectory()) {
          fs.readdir(filePath, (err, files) => {
            if (err) {
              res.writeHead(500)
              res.end('Error listing directory contents')
            } else {
              res.writeHead(200, { 'Content-Type': 'text/html' })
              res.end(generateDirectoryListingHtml(files, requestPath))
            }
          })
        } else {
          fs.readFile(filePath, (err, data) => {
            if (err) {
              res.writeHead(404)
              res.end('404 Not Found')
            } else {
              res.end(data)
            }
          })
        }
      })
    })
  }

  start () {
    if (this.config.enableWebServer) {
      this.server.listen(this.config.webServerPort, this.config.webServerHost, () => {
        logger.info(`Web server is running, http://${this.config.webServerHost}:${this.config.webServerPort}, root path is ${this.config.webServerPath}`)
      }).on('error', (err) => {
        logger.error(err)
      })
    } else {
      logger.info('Web server is not enabled')
    }
  }

  stop () {
    this.server.close()
    logger.info('Web server is stopped')
  }

  restart () {
    this.stop()
    this.config = this.getConfigWithDefaults()
    this.server = this.getServer()
    this.start()
  }
}

export default new WebServer()
