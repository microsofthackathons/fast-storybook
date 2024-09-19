import type {
    Builder,
    CompatibleString,
    Options,
    StorybookConfig as StorybookConfigBase,
} from "@storybook/core/types";
import type { InlineConfig, UserConfig } from "vite";

// Storybook's Stats are optional Webpack related property
type ViteStats = {
    toJson: () => any;
};

export type ViteBuilder = Builder<UserConfig, ViteStats>;

export type ViteFinal = (
    config: InlineConfig,
    options: Options,
) => InlineConfig | Promise<InlineConfig>;

export type StorybookConfigVite = {
    viteFinal?: ViteFinal;
};

export type BuilderOptions = {
    /** Path to `vite.config` file, relative to `process.cwd()`. */
    viteConfigPath?: string;
};

type FrameworkName =
    CompatibleString<"@fast-sb/storybook-fast-components-vite">;
type BuilderName = CompatibleString<"@storybook/builder-vite">;

export type FrameworkOptions = {
    builder?: BuilderOptions;
};

type StorybookConfigFramework = {
    framework:
        | FrameworkName
        | {
              name: FrameworkName;
              options: FrameworkOptions;
          };
    core?: StorybookConfigBase["core"] & {
        builder?:
            | BuilderName
            | {
                  name: BuilderName;
                  options: BuilderOptions;
              };
    };
};

/** The interface for Storybook configuration in `main.ts` files. */
export type StorybookConfig = Omit<
    StorybookConfigBase,
    keyof StorybookConfigVite | keyof StorybookConfigFramework
> &
    StorybookConfigVite &
    StorybookConfigFramework;
