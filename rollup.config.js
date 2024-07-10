import pkg from './package.json' assert { type: 'json' };
import { babel } from '@rollup/plugin-babel';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';
import postcss from 'rollup-plugin-postcss';
import tailwindcss from 'tailwindcss';
import image from '@rollup/plugin-image';
import typescript from '@rollup/plugin-typescript';
import tsConfigPaths from "rollup-plugin-tsconfig-paths"

const config = [{
    input: 'src/index.tsx',
    output: [
        { file: pkg.main, format: 'cjs' },
        { file: pkg.module, format: 'esm' },
    ],
    plugins: [
        tsConfigPaths(),
        typescript(),
        commonjs(),
        babel({
            babelHelpers: 'bundled',
            exclude: 'node_modules/**',
            presets: ['@babel/preset-env', '@babel/preset-react'],
        }),
        postcss({
            plugins: [tailwindcss()],
            extensions: ['.css'],
            minimize: true,
            inject: {
                insertAt: 'top',
            },
        }),
        image(),
        nodeResolve(),
        terser(),
    ],
    external: Object.keys(pkg.peerDependencies),
}]

export default config