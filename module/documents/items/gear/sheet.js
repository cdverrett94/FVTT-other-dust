import { attributes } from '../../../constants/attributes.js';

export class ODGearSheet extends ItemSheet {
    constructor(...args) {
        super(...args);
    }

    static get defaultOptions() {
        const defaults = super.defaultOptions;

        const overrides = {
            classes: ['od', 'sheet', 'item', 'gear'],
            height: 'auto',
            width: 550,
            template: `/systems/other-dust/templates/items/gear/gear-sheet.html`,
            resizable: false,
        };

        return foundry.utils.mergeObject(defaults, overrides);
    }

    async getData() {
        const data = {
            document: this.document,
            attributes,
        };
        return data;
    }
}
