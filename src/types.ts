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
  browser?: undefined | 'firefox' | 'google chrome' | 'opera' | 'safari' | 'vivaldi' | 'edge' | 'brave'

  /**
   * Serve static files from the specified folder(s).
   */
  contentBase?: undefined | string | string[]

  /**
   * Set custom response headers.
   */
  headers?:
    | undefined
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
  historyApiFallback?: undefined | boolean | string

  /**
   * Change the host of the server (default: `'localhost'`).
   */
  host?: undefined | string

  /**
   * By default server will be served over HTTP (https: `false`). It can optionally be served over HTTPS.
   */
  https?: undefined |  ServerOptions | false

  /**
   * Set custom mime types, usage https://github.com/broofa/mime#mimedefinetypemap-force--false.
   */
  mimeTypes?: undefined | TypeMap

  /**
   * Execute function after server has begun listening.
   */
  onListening?: undefined |  ((server: Server) => void)

  /**
   * Launch the browser after the first bundle is generated (default: `false`).
   */
  open?: undefined | boolean

  /**
   * Change the page that is opened when the browser is launched.
   * Will not do anything if `open = false`.
   * Remember to start with a slash, e.g. `'/different/page'`.
   */
  openPage?: undefined | string

  /**
   * Change the port that the server will listen on (default: `10001`).
   */
  port?: undefined | number | string

  /**
   * Show server address in console (default: `true`).
   */
  verbose?: undefined | boolean
}
