import { readFileSync } from "node:fs";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import esbuild from "rollup-plugin-esbuild";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import postcss from "rollup-plugin-postcss";
import url from "postcss-url"

const packageJson = JSON.parse(readFileSync("./package.json", "utf8"));

export default [
    {
        input: "src/index.ts",
        output:[
            {
                file: packageJson.main,
                format: "cjs",
                sourcemap: true,
            },
            {
                file: packageJson.module,
                format: "esm",
                sourcemap: true,
            },
        ],
        plugins:[
            peerDepsExternal(),
            resolve({extensions: [".js", ".jsx", ".ts", ".tsx"]}),
            commonjs(),
            postcss({inject: true, minimize: true, plugins: [url({url: "inline", maxSize: 100})]}),
            esbuild({tsconfig:'./tsconfig.json', jsx: 'automatic', target: 'es2022', minify: true,}),
        ],
        external:['react', 'react-dom', "react/jsx-runtime"],
    },
]