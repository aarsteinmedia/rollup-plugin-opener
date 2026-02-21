import type { IncomingHttpHeaders, OutgoingHttpHeaders, Server } from 'node:http';
import type { ServerOptions } from 'node:https';
interface TypeMap {
    [key: string]: string[];
}
export interface RollupServeOptions {
    browser?: undefined | 'firefox' | 'google chrome' | 'opera' | 'safari' | 'vivaldi' | 'edge' | 'brave';
    contentBase?: undefined | string | string[];
    headers?: undefined | IncomingHttpHeaders | OutgoingHttpHeaders | {
        [name: string]: number | string | readonly string[];
    };
    historyApiFallback?: undefined | boolean | string;
    host?: undefined | string;
    https?: undefined | ServerOptions | false;
    mimeTypes?: undefined | TypeMap;
    onListening?: undefined | ((server: Server) => void);
    open?: undefined | boolean;
    openPage?: undefined | string;
    port?: undefined | number | string;
    verbose?: undefined | boolean;
}
export {};
