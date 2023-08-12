export class ODTrainingSheet extends ItemSheet {
    constructor(...args) {
        super(...args);
    }

    static get defaultOptions() {
        const defaults = super.defaultOptions;

        const overrides = {
            classes: ['od', 'sheet', 'item', 'training'],
            height: 'auto',
            width: 600,
            template: `/systems/other-dust/templates/items/training/training-sheet.html`,
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
