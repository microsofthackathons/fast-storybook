import { html } from "@microsoft/fast-element";
import type { Meta, StoryArgs, StoryObj } from "@microsoft/storybook-fast-components";
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
        "": "Button",
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
            mapping: { "": null, ...ButtonSize },
            options: ["", ...Object.values(ButtonSize)],
            table: {
                category: "attributes",
                type: { summary: Object.values(ButtonSize).join("|") },
            },
        },
        type: {
            control: "select",
            description: "The type of the button.",
            mapping: { "": null, ...ButtonType },
            options: ["", ...Object.values(ButtonType)],
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
        "": {
            control: "text",
            description: "The default slot",
            name: "",
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
        "": "Disabled",
    },
};

export const PrimaryAppearance: Story = {
    args: {
        appearance: ButtonAppearance.primary,
        "": "Primary",
    },
};

export const SecondaryAppearance: Story = {
    args: {
        appearance: ButtonAppearance.secondary,
        "": "Secondary",
    },
};

export const SmallSize: Story = {
    args: {
        size: ButtonSize.small,
        "": "Small",
    },
};

export const MediumSize: Story = {
    args: {
        size: ButtonSize.medium,
        "": "Medium",
    },
};

export const LargeSize: Story = {
    args: {
        size: ButtonSize.large,
        "": "Large",
    },
};

export const LongText: Story = {
    args: {
        "": () =>
            "This story's canvas has a max-width of 280px, applied with a Story Decorator. Long text wraps after it hits the max width of the component.",
    },
    decorators: [
        (Story, context) => {
            return html<StoryArgs<Button>>`
                <div style="max-width: 280px">${Story()}</div>
            `;
        },
    ],
    // render: (args, context) => html<StoryArgs<Button>>`
    //     <div style="max-width: 280px">
    //         ${storyTemplate(args, context)}
    //     </div>
    // `,
};
