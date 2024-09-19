import { dirname, join } from "node:path";
import type { StorybookConfig } from "@microsoft/storybook-fast-components-vite";

/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 */
function getAbsolutePath(value: string): string {
    return dirname(require.resolve(join(value, "package.json")));
}

export default {
    stories: ["../stories/*.stories.ts"],
    addons: [getAbsolutePath("@storybook/addon-essentials")],
    framework: {
        name: getAbsolutePath("@microsoft/storybook-fast-components-vite"),
        options: {},
    },
    core: {
        enableCrashReports: false,
        disableTelemetry: true,
        disableWhatsNewNotifications: true,
    },
    // Allows watching for changes in dev dependencies
    viteFinal: async config =>
        (await import("vite")).mergeConfig(config, {
            optimizeDeps: { force: true },
        }),
} as StorybookConfig;
