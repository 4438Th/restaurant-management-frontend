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
    banner: {
        js: "'use client';",
    },
    external: [
        'react',
        'react-dom',
        'next',
        'next/navigation',
        'lucide-react',
        'clsx',
        'tailwind-merge',
    ],
});