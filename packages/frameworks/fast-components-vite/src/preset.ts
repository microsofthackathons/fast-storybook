import { dirname, join } from "node:path";
import type { PresetProperty } from "@storybook/core/types";

const getAbsolutePath = <I extends string>(input: I): I =>
    dirname(require.resolve(join(input, "package.json"))) as any;

export const core: PresetProperty<"core"> = {
    builder: getAbsolutePath("@storybook/builder-vite"),
    renderer: getAbsolutePath("@fast-sb/storybook-fast-components"),
};
