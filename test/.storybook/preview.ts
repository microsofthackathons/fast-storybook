/// <reference types="vite/client" />
import type { Preview } from "@microsoft/storybook-fast-components";

const modules = import.meta.glob(["../../**/define.ts"]);
for (const path in modules) {
    modules[path]();
}

export default {
    tags: ["autodocs"],
} as Preview;
