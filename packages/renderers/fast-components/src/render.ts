import {
    FASTElement,
    type FASTElementDefinition,
    ViewTemplate,
    html,
    repeat,
} from "@microsoft/fast-element";
import {
    simulateDOMContentLoaded,
    simulatePageLoad,
} from "@storybook/core/preview-api";
import type { ArgsStoryFn, RenderContext } from "@storybook/core/types";
import dedent from "ts-dedent";
import type {
    FASTComponentsRenderer,
    StoryFnHtmlReturnType,
} from "./types.mjs";

function getComponentName(
    component: FASTComponentsRenderer["component"],
): string {
    return (component as FASTElementDefinition)?.name ?? component;
}

export const render: ArgsStoryFn<FASTComponentsRenderer> = (args, context) => {
    const { argTypes, id, component } = context;
    // biome-ignore lint/style/noNonNullAssertion: <explanation>
    const componentName = getComponentName(component!);

    if (!componentName) {
        throw new Error(
            `Unable to render story ${id} as the component annotation is missing from the default export`,
        );
    }

    const tagName = html.partial(componentName);

    const argsValues = html.partial(
        ` ${Object.entries(args)
            .map(([key, val]) => {
                switch (typeof val) {
                    case "boolean":
                    case "string":
                        return val !== ""
                            ? `${argTypes[key]?.name ?? key}="${val}"`
                            : false;
                    case "number":
                        return `${argTypes[key]?.name ?? key}="${val}"`;
                    default:
                        return "";
                }
            })
            .filter(Boolean)
            .join(" ")}`,
    );

    const slottedFunctionArgs = Object.entries(args).reduce(
        (acc, [key, arg]) => {
            if (typeof arg === "function") {
                acc.push(arg);
            }
            return acc;
        },
        [] as Array<() => StoryFnHtmlReturnType>,
    );

    let template: ViewTemplate;
    if (slottedFunctionArgs.length > 0) {
        template = html`
            <${tagName}${argsValues}>${repeat(slottedFunctionArgs, html`${arg => arg()}`)}</${tagName}>
        `;
    } else {
        template = html`<${tagName}${argsValues}></${tagName}>`;
    }

    return template;
};

export function renderToCanvas(
    renderContext: RenderContext<FASTComponentsRenderer>,
    canvasElement: FASTComponentsRenderer["canvasElement"],
) {
    const {
        storyFn,
        kind,
        name,
        showMain,
        showError,
        forceRemount,
        storyContext,
    } = renderContext;

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
            '[id="root-inner"]',
        ) as HTMLElement;

        const oldElement = renderTo.querySelector(
            (storyContext.component as FASTElementDefinition)?.name ??
                storyContext.component,
        );

        if (oldElement) {
            oldElement.replaceWith(firstChild);
        } else {
            renderTo.append(firstChild);
        }

        // element.render(element, renderTo);
        simulatePageLoad(canvasElement);
    } else if (typeof element === "string") {
        const elementPartial = html.partial(element);
        const renderedElement = html`${elementPartial}`;
        renderedElement.render(renderedElement, canvasElement);
        simulatePageLoad(canvasElement);
    } else if (element instanceof Node) {
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
