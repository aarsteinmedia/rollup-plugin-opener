import type { RollupServeOptions } from './types';
export declare function serve(optionsFromProps?: RollupServeOptions): {
    generateBundle(): Promise<void>;
    name: string;
};
