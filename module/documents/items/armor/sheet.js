import { attributes } from '../../../constants/attributes.js';

export class ODArmorSheet extends ItemSheet {
    constructor(...args) {
        super(...args);
    }

    static get defaultOptions() {
        const defaults = super.defaultOptions;

        const overrides = {
            classes: ['od', 'sheet', 'item', 'armor'],
            height: 'auto',
            width: 550,
            template: `/systems/other-dust/templates/items/armor/armor-sheet.html`,
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
