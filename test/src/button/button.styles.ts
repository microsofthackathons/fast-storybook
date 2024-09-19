import { css } from "@microsoft/fast-element";

/**
 * Styles for the Button component.
 */
export const styles = css`
    :host {
        display: inline-block;
        cursor: pointer;
        border: 0;
        border-radius: 3em;
        font-weight: 700;
        line-height: 1;
        font-family: 'Nunito Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
    }

    :host([hidden]) {
        display: none;
    }

    :host(:state(appearance-primary)) {
        background-color: #1ea7fd;
        color: white;
    }

    :host(:state(appearance-secondary)) {
        box-shadow: rgba(0, 0, 0, 0.15) 0px 0px 0px 1px inset;
        background-color: transparent;
        color: #333;
    }

    :host(:state(size-small)) {
        padding: 10px 16px;
        font-size: 12px;
    }

    :host(:state(size-medium)) {
        padding: 11px 20px;
        font-size: 14px;
    }

    :host(:state(size-large)) {
        padding: 12px 24px;
        font-size: 16px;
    }
`;
