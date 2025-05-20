import type {
  IncomingHttpHeaders, OutgoingHttpHeaders, Server
} from 'node:http'
import type { ServerOptions } from 'node:https'

interface TypeMap {[key: string]: string[]}

export interface RollupServeOptions {
  /**
   * Choose which browser to open in.
   * Will not do anything if `open = false`.
   * Will use system default browser if not set.
   */
  browser?: 'firefox' | 'google chrome' | 'opera' | 'safari' | 'vivaldi' | 'edge' | 'brave'

  /**
   * Serve static files from the specified folder(s).
   */
  contentBase?: string | string[]

  /**
   * Set custom response headers.
   */
  headers?:
    | IncomingHttpHeaders
    | OutgoingHttpHeaders
    | {
      // i.e. Parameters<OutgoingMessage["setHeader"]>
      [name: string]: number | string | readonly string[]
    }

  /**
   * Set to `true` to return index.html (200) instead of error page (404)
   * or path to fallback page.
   */
  historyApiFallback?: boolean | string

  /**
   * Change the host of the server (default: `'localhost'`).
   */
  host?: string

  /**
   * By default server will be served over HTTP (https: `false`). It can optionally be served over HTTPS.
   */
  https?: ServerOptions | false

  /**
   * Set custom mime types, usage https://github.com/broofa/mime#mimedefinetypemap-force--false.
   */
  mimeTypes?: TypeMap

  /**
   * Execute function after server has begun listening.
   */
  onListening?: (server: Server) => void

  /**
   * Launch the browser after the first bundle is generated (default: `false`).
   */
  open?: boolean

  /**
   * Change the page that is opened when the browser is launched.
   * Will not do anything if `open = false`.
   * Remember to start with a slash, e.g. `'/different/page'`.
   */
  openPage?: string

  /**
   * Change the port that the server will listen on (default: `10001`).
   */
  port?: number | string

  /**
   * Show server address in console (default: `true`).
   */
  verbose?: boolean
}
