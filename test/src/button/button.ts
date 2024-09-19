import { BaseButton } from "@fluentui/web-components/button/index.js";
import { attr } from "@microsoft/fast-element";
import { ButtonAppearance, ButtonSize } from "./button.options.js";

export class Button extends BaseButton {
    /**
     * The stylistic appearance of the button.
     */
    @attr
    appearance: ButtonAppearance = ButtonAppearance.primary;

    /**
     * Updates the appearance state when the `appearance` property or attribute changes.
     */
    appearanceChanged(prev: ButtonAppearance, next: string): undefined {
        this.elementInternals.states.delete(`appearance-${prev}`);

        if (next in ButtonAppearance) {
            this.elementInternals.states.add(`appearance-${next}`);
        }
    }

    @attr
    size: ButtonSize = ButtonSize.medium;

    attributeChangedCallback(
        name: string,
        oldValue: string | null,
        newValue: string | null,
    ): void {
        super.attributeChangedCallback(name, oldValue, newValue);

        switch (name) {
            case "appearance":
            case "size": {
                this.elementInternals.states.delete(`${name}-${oldValue}`);
                this.elementInternals.states.add(`${name}-${newValue}`);
                break;
            }
        }
    }
}
