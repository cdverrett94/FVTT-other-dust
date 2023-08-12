import { attributes } from '../../../constants/attributes.js';

export class ODWeaponSheet extends ItemSheet {
    constructor(...args) {
        super(...args);
    }

    static get defaultOptions() {
        const defaults = super.defaultOptions;

        const overrides = {
            classes: ['od', 'sheet', 'item', 'weapon'],
            height: 'auto',
            width: 550,
            template: `/systems/other-dust/templates/items/weapon/weapon-sheet.html`,
            resizable: false,
        };

        return foundry.utils.mergeObject(defaults, overrides);
    }

    async getData() {
        const attributesText = {};

        for (const attribute of attributes) {
            attributesText[attribute] = {
                title: game.i18n.localize(`OD.Attributes.${attribute}.Title`),
                abbreviation: game.i18n.localize(`OD.Attributes.${attribute}.Abbreviation`),
            };
        }
        const data = {
            document: this.document,
            attributes,
            attributesText,
            enrichedDescription: await TextEditor.enrichHTML(this.document.system.description, { async: true }),
        };
        return data;
    }
}
