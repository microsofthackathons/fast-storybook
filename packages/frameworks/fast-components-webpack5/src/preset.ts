import { dirname, join } from "node:path";

import type { PresetProperty } from "@storybook/core/types";

const getAbsolutePath = <I extends string>(input: I): I =>
    dirname(require.resolve(join(input, "package.json"))) as any;

export const core: PresetProperty<"core"> = async (config, options) => {
    const framework = await options.presets.apply("framework");

    return {
        ...config,
        builder: {
            name: getAbsolutePath("@storybook/builder-webpack5"),
            options:
                typeof framework === "string"
                    ? {}
                    : framework.options.builder || {},
        },
        renderer: getAbsolutePath("@fast-sb/storybook-fast-components"),
    };
};
