/// <reference types="vite/client" />
import {
    type Preview,
    setCustomElementsManifest,
    setCustomElements,
} from "@microsoft/storybook-fast-components";
import CustomElementsManifest from "../dist/custom-elements.json";

const modules = import.meta.glob(["../../**/define.ts"]);
for (const path in modules) {
    modules[path]();
}

setCustomElements(CustomElementsManifest);

export default {
    tags: ["autodocs"],
    parameters: {
        controls: {
            disableSaveFromUI: true,
        },
    },
} as Preview;
