import type { RollupServeOptions } from './types';
export default function serve(optionsFromProps?: RollupServeOptions): {
    generateBundle(): void;
    name: string;
};
