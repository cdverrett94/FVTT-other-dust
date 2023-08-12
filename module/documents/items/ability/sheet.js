export class ODAbilitySheet extends ItemSheet {
    constructor(...args) {
        super(...args);
    }

    static get defaultOptions() {
        const defaults = super.defaultOptions;

        const overrides = {
            classes: ['od', 'sheet', 'item', 'ability'],
            height: 'auto',
            width: 600,
            template: `/systems/other-dust/templates/items/ability/ability-sheet.html`,
            resizable: false,
        };

        return foundry.utils.mergeObject(defaults, overrides);
    }

    async getData() {
        const data = {
            document: this.document,
            enrichedDescription: await TextEditor.enrichHTML(this.document.system.description, { async: true }),
        };
        return data;
    }
}
