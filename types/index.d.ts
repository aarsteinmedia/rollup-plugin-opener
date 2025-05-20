import type { RollupServeOptions } from './types';
export default function serve(optionsFromProps?: RollupServeOptions): {
    generateBundle(): Promise<void>;
    name: string;
};
