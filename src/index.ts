import { Mime } from 'mime/lite'
import otherTypes from 'mime/types/other.js'
import standardTypes from 'mime/types/standard.js'
import { readFile } from 'node:fs'
import {
  createServer,
  type IncomingMessage,
  type Server,
  type ServerResponse,
} from 'node:http'
import { createServer as createHttpsServer } from 'node:https'
import { resolve, posix } from 'node:path'
import open from 'open'

import type { RollupServeOptions } from '@/types'

let server: Server | undefined

export default function serve(optionsFromProps: RollupServeOptions = { contentBase: '' }) {
  let options = optionsFromProps
  const mime = new Mime(standardTypes, otherTypes)

  if (Array.isArray(options) || typeof options === 'string') {
    options = { contentBase: options }
  }
  options.contentBase = Array.isArray(options.contentBase) ? options.contentBase : [options.contentBase || '']
  options.port = options.port ?? 10001
  options.headers = options.headers ?? {}
  options.https = options.https ?? false
  options.openPage = options.openPage || ''
  options.onListening = options.onListening ?? (() => { /** Noop. */ })

  if (options.mimeTypes) {
    mime.define(options.mimeTypes, true)
  }

  const requestListener = (request: IncomingMessage, response: ServerResponse) => {
    if (!request.url) {
      return
    }

    // Remove querystring
    const unsafePath = decodeURI(request.url.split('?')[0]),

      /**
       * Don't allow path traversal.
       */
      urlPath = posix.normalize(unsafePath),
      keys = Object.keys(options.headers ?? {}),
      { length } = keys

    for (let i = 0; i < length; i++) {
      const header = options.headers?.[keys[i]]

      if (!header) {
        continue
      }
      response.setHeader(keys[i], header)
    }

    readFileFromContentBase(
      options.contentBase as string[], urlPath, (
        error: null | NodeJS.ErrnoException, content: NonSharedBuffer, filePath: string
      ) => {
        if (!error) {
          found(
            response, mime.getType(filePath), content
          )

          return
        }
        if (error.code !== 'ENOENT') {
          response.writeHead(500)
          response.end('500 Internal Server Error' +
            `\n\n${  filePath
            }\n\n${  Object.values(error).join('\n')
            }\n\n(rollup-plugin-opener)`, 'utf-8')

          return
        }
        if (options.historyApiFallback) {
          const fallbackPath = typeof options.historyApiFallback === 'string' ? options.historyApiFallback : '/index.html'

          readFileFromContentBase(
            options.contentBase as string[], fallbackPath, (
              err: unknown, baseContent: NonSharedBuffer, basFilePath: string
            ) => {
              if (err) {
                notFound(response, basFilePath)

                return
              }
              found(
                response, mime.getType(basFilePath), baseContent
              )
            }
          )

          return
        }
        notFound(response, filePath)
      }
    )
  }

  // release previous server instance if rollup is reloading configuration in watch mode
  if (server) {
    server.close()
  } else {
    closeServerOnTermination()
  }

  // If HTTPS options are available, create an HTTPS server
  server = options.https
    ? createHttpsServer(options.https, requestListener)
    : createServer(requestListener)
  server.listen(
    Number(options.port), options.host, 511, () => {
      if (server) {
        options.onListening?.(server)
      }

    }
  )

  // Assemble url for error and info messages
  const url = `${options.https ? 'https' : 'http'}://${options.host || 'localhost'}:${options.port}`

  // Handle common server errors
  server.on('error', (e: NodeJS.ErrnoException) => {
    if (e.code === 'EADDRINUSE') {
      console.error(`${url} is in use, either stop the other server or use a different port.`)
      process.exit()
    } else {
      throw e
    }
  })

  let isFirst = true

  return {
    async generateBundle() {
      if (!isFirst) {
        return
      }
      isFirst = false

      // Log which url to visit
      if (options.verbose !== false) {

        const { length } = options.contentBase ?? []

        for (let i = 0; i < length; i++) {
          const base = options.contentBase?.[i]

          if (!base) {
            continue
          }
          console.info(`${green(url)} -> ${resolve(base)}`)
        }
      }

      // Open browser
      if (options.open) {
        const path = /https?:\/\/.+/.test(options.openPage as string) ? `${options.openPage}` : `${url}${options.openPage}`,
          args = options.browser ? { app: { name: options.browser } } : undefined

        await open(path, args)
      }
    },
    name: 'serve'
  }
}

function readFileFromContentBase(
  contentBase: string[], urlPath: string, callback: (error: null | NodeJS.ErrnoException, content: NonSharedBuffer, filePath: string) => void
) {
  let filePath = resolve(contentBase[0] || '.', `.${  urlPath}`)

  // Load index.html in directories
  if (urlPath.endsWith('/')) {
    filePath = resolve(filePath, 'index.html')
  }

  readFile(filePath, (error, content) => {
    if (error && contentBase.length > 1) {
      // Try to read from next contentBase
      readFileFromContentBase(
        contentBase.slice(1), urlPath, callback
      )

      return
    }
    // We know enough
    callback(
      error, content, filePath
    )
  })
}

function notFound(response: ServerResponse, filePath: string) {
  response.writeHead(404)
  response.end(`404 Not Found\n\n${filePath}\n\n(rollup-plugin-opener)`, 'utf-8')
}

function found(
  response: ServerResponse, mimeType: null | string, content: NonSharedBuffer
) {
  response.writeHead(200, { 'Content-Type': mimeType || 'text/plain' })
  response.end(content, 'utf-8')
}

function green(text: string) {
  return `\u001b[1m\u001b[32m${text}\u001b[39m\u001b[22m`
}

function closeServerOnTermination() {
  const terminationSignals = [
    'SIGINT',
    'SIGTERM',
    'SIGQUIT',
    'SIGHUP'
  ] as const

  const closeServer = (signal: (typeof terminationSignals)[number]) => {

    process.on(signal, () => {
      if (!server) {
        return
      }

      server.close()
      process.exit()
    })
  }

  for (let i = 0; i < 4; i++) {
    closeServer(terminationSignals[i])
  }
}
