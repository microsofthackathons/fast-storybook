import {
    FASTElement,
    type FASTElementDefinition,
    InlineTemplateDirective,
    type TemplateValue,
    ViewTemplate,
    html,
    repeat,
} from "@microsoft/fast-element";
import { simulateDOMContentLoaded, simulatePageLoad } from "@storybook/core/preview-api";
import type { RenderContext } from "@storybook/core/types";
import dedent from "ts-dedent";
import type { StoryFn } from "./public-types.js";
import type { FASTComponentsRenderer } from "./types.mjs";

function getComponentName(component?: FASTComponentsRenderer["component"]): string {
    return (component as FASTElementDefinition)?.name ?? component;
}

export const render: StoryFn<FASTComponentsRenderer> = (args, context) => {
    const { argTypes, id, component } = context;
    const componentName = getComponentName(component);

    if (!componentName) {
        throw new Error(
            `Unable to render story ${id} as the component annotation is missing from the default export`
        );
    }

    const tagName = html.partial(componentName);

    const argsValues = html.partial(
        ` ${Object.entries(args)
            .map(([key, val]) => {
                const type =
                    argTypes[key]?.table?.type?.summary ??
                    argTypes[key]?.type ??
                    typeof val;
                const attribute = argTypes[key]?.name ?? key;

                if (key === "") {
                    return "";
                }

                switch (typeof val) {
                    case "boolean": {
                        return val ? attribute : "";
                    }

                    case "string": {
                        return `${attribute}="${val}"`;
                    }

                    case "number": {
                        return `${attribute}="${val}"`;
                    }

                    default: {
                        return "";
                    }
                }
            })
            .filter(Boolean)
            .join(" ")}`
    );

    const viewTemplateArgs = Object.entries(args).reduce((acc, [key, val]) => {
        if (argTypes[key]?.table?.category === "slots") {
            acc.push(html`
                ${val}
            `);
        }

        return acc;
    }, [] as ViewTemplate[]);

    let template: ViewTemplate;
    if (viewTemplateArgs.length > 0) {
        template = html`
            <${tagName}${argsValues}>${repeat(
                viewTemplateArgs,
                html`
                    ${arg => arg}
                `
            )}</${tagName}>
        `;
    } else {
        template = html`<${tagName}${argsValues}></${tagName}>`;
    }

    return template;
};

export function renderToCanvas(
    renderContext: RenderContext<FASTComponentsRenderer>,
    canvasElement: FASTComponentsRenderer["canvasElement"]
) {
    const { storyFn, kind, name, showMain, showError, forceRemount, storyContext } =
        renderContext;

    const element = storyFn(render);

    showMain();

    if (element instanceof ViewTemplate) {
        if (forceRemount || !canvasElement.querySelector('[id="root-inner"]')) {
            canvasElement.innerHTML = '<div id="root-inner"></div>';
        }

        const storyFragment = new DocumentFragment();

        element.render(element, storyFragment);

        const firstChild: Node =
            storyFragment.childElementCount === 1 &&
            storyFragment.firstElementChild instanceof FASTElement
                ? storyFragment.firstElementChild
                : storyFragment;
        // if (storyFragment.childElementCount === 1) {
        //     if (storyFragment.firstElementChild instanceof FASTElement) {
        //         firstChild = storyFragment.firstElementChild;
        //     }
        // }

        const renderTo = canvasElement.querySelector<HTMLElement>(
            '[id="root-inner"]'
        ) as HTMLElement;

        const oldElement = renderTo.querySelector(
            (storyContext.component as FASTElementDefinition)?.name ??
                storyContext.component
        );

        // canvasElement.innerHTML = "";
        // canvasElement.appendChild(storyFragment);

        oldElement?.replaceWith(firstChild) ?? renderTo.append(firstChild);

        // render(element, storyContext);
        simulatePageLoad(canvasElement);
    } else if (typeof element === "string") {
        const elementPartial = html.partial(element);
        const renderedElement = html`
            ${elementPartial}
        `;
        renderedElement.render(renderedElement, canvasElement);
        simulatePageLoad(canvasElement);
    } else if (element instanceof Node) {
        // console.log("element", element);
        // Don't re-mount the element if it didn't change and neither did the story
        if (canvasElement.firstChild === element && !forceRemount) {
            return;
        }

        canvasElement.innerHTML = "";
        canvasElement.appendChild(element);
        simulateDOMContentLoaded();
    } else {
        showError({
            title: `Expecting an HTML snippet or DOM node from the story: "${name}" of "${kind}".`,
            description: dedent`
                Did you forget to return the HTML snippet from the story?
                Use "() => <your snippet or node>" or when defining the story.
            `,
        });
    }
}
