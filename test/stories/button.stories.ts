import { html } from "@microsoft/fast-element";
import type {
    Meta,
    StoryArgs,
    StoryObj,
} from "@microsoft/storybook-fast-components";
import { definition } from "../src/button/button.definition.js";
import type { Button } from "../src/button/button.js";
import {
    ButtonAppearance,
    ButtonSize,
    ButtonType,
} from "../src/button/button.options.js";

type Story = StoryObj<Button>;

export default {
    title: "Components/Button",
    component: definition,
    args: {
        slottedContent: () => "Button",
    },
    argTypes: {
        appearance: {
            control: "select",
            description: "Indicates the styled appearance of the button.",
            options: ["", ...Object.values(ButtonAppearance)],
            table: {
                category: "attributes",
                type: { summary: Object.values(ButtonAppearance).join("|") },
            },
        },
        disabled: {
            control: "boolean",
            description: "Sets the button's disabled state.",
            table: { category: "attributes", type: { summary: "boolean" } },
        },
        size: {
            control: "select",
            description: "The size of the button.",
            options: ["", ...Object.values(ButtonSize)],
            table: {
                category: "attributes",
                type: { summary: Object.values(ButtonSize).join("|") },
            },
        },
        type: {
            control: "select",
            description: "The type of the button.",
            options: ["", Object.values(ButtonType)],
            table: {
                category: "attributes",
                type: { summary: Object.values(ButtonType).join("|") },
            },
        },
        value: {
            control: "text",
            description: "The initial value of the button.",
            table: { category: "attributes", type: { summary: "string" } },
        },
        slottedContent: {
            control: "text",
            description: "The default slot",
            name: "default slot",
            type: {
                name: "other",
                value: "string | (() => string) | ViewTemplate",
            },
            table: {
                category: "slots",
                type: {},
            },
        },
    },
} as Meta<Button>;

export const Default: Story = {};

export const Disabled: Story = {
    args: {
        disabled: true,
        slottedContent: () => "Disabled",
    },
};

export const PrimaryAppearance: Story = {
    args: {
        appearance: ButtonAppearance.primary,
        slottedContent: () => "Primary",
    },
};

export const SecondaryAppearance: Story = {
    args: {
        appearance: ButtonAppearance.secondary,
        slottedContent: () => "Secondary",
    },
};

export const SmallSize: Story = {
    args: {
        size: ButtonSize.small,
        slottedContent: () => "Small",
    },
};

export const MediumSize: Story = {
    args: {
        size: ButtonSize.medium,
        slottedContent: () => "Medium",
    },
};

export const LargeSize: Story = {
    args: {
        size: ButtonSize.large,
        slottedContent: () => "Large",
    },
};

export const LongText: Story = {
    args: {
        slottedContent: () =>
            "This story's canvas has a max-width of 280px, applied with a Story Decorator. Long text wraps after it hits the max width of the component.",
    },
    decorators: [
        (Story, context) => {
            return html<StoryArgs<Button>>`
                <div style="max-width: 280px">
                    ${Story()}
                </div>
            `;
        },
    ],
    // render: (args, context) => html<StoryArgs<Button>>`
    //     <div style="max-width: 280px">
    //         ${storyTemplate(args, context)}
    //     </div>
    // `,
};
