import type { IncomingHttpHeaders, OutgoingHttpHeaders, Server } from 'node:http';
import type { ServerOptions } from 'node:https';
interface TypeMap {
    [key: string]: string[];
}
export interface RollupServeOptions {
    browser?: 'firefox' | 'google chrome' | 'opera' | 'safari' | 'vivaldi' | 'edge' | 'brave';
    contentBase?: string | string[];
    headers?: IncomingHttpHeaders | OutgoingHttpHeaders | {
        [name: string]: number | string | readonly string[];
    };
    historyApiFallback?: boolean | string;
    host?: string;
    https?: ServerOptions | false;
    mimeTypes?: TypeMap;
    onListening?: (server: Server) => void;
    open?: boolean;
    openPage?: string;
    port?: number | string;
    verbose?: boolean;
}
export {};
