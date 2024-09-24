import { nodeResolve } from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";

export default [
    {
        input: "src/index.ts",
        output: [
            { file: "dist/index.cjs", format: "cjs", sourcemap: true },
            { file: "dist/index.mjs", sourcemap: true },
        ],
        plugins: [
            nodeResolve(),
            typescript({
                tsconfig: "./tsconfig.build.json",
                sourceMap: true,
            }),
        ],
    },
];
