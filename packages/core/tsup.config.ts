import { defineConfig } from 'tsup';
import { glob } from 'glob';

const entryPoints = glob.sync('src/**/index.ts', { posix: true });

export default defineConfig({
    entry: entryPoints,
    format: ['cjs', 'esm'],
    dts: true,
    clean: true,
    sourcemap: true,
    outDir: 'dist',
    external: ['axios'],
});