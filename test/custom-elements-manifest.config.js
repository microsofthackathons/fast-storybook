import { cemFASTAddDefinitions } from "@microsoft/cem-fast-extended-plugin";

export default {
    globs: ["src/**/*.ts"],
    outdir: "dist",
    fast: true,
    dependencies: true,
    plugins: [
        cemFASTAddDefinitions(),
    ],
};
