export class ODBackgroundSheet extends ItemSheet {
    constructor(...args) {
        super(...args);
    }

    static get defaultOptions() {
        const defaults = super.defaultOptions;

        const overrides = {
            classes: ['od', 'sheet', 'item', 'background'],
            height: 'auto',
            width: 600,
            template: `/systems/other-dust/templates/items/background/background-sheet.html`,
            resizable: false,
            tabs: [
                {
                    navSelector: '.sheet-tabs',
                    contentSelector: '.sheet-body',
                    initial: 'skills',
                },
            ],
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

    activateListeners($html) {
        super.activateListeners($html);
    }
}
