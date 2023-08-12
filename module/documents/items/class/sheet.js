import { attributes } from '../../../constants/attributes.js';
import { saves } from '../../../constants/saves.js';
import { ODSkillItem } from '../skill/skill.js';

export class ODClassSheet extends ItemSheet {
    static get defaultOptions() {
        const defaults = super.defaultOptions;

        const overrides = {
            classes: ['od', 'sheet', 'item', 'class'],
            height: 'auto',
            width: 750,
            template: `/systems/other-dust/templates/items/class/class-sheet.html`,
            resizable: false,
            dragDrop: [{ dragSelector: null, dropSelector: null }],
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
        const savesText = {};
        const savesCopy = [...saves];

        for (const save of savesCopy) {
            savesText[save] = game.i18n.localize(`OD.Saves.${save}`);
        }

        const data = {
            document: this.document,
            saves: savesCopy,
            savesText,
            attributes,
            attributesText,
            enrichedDescription: await TextEditor.enrichHTML(this.document.system.description, { async: true }),
            enrichedAbilityDescription: await TextEditor.enrichHTML(this.document.system.ability.system.description, { async: true }),
        };
        return data;
    }

    async _onDropSkill(droppedItem) {
        const skillIds = [];
        for (const skill of this.document.skills) {
            console.log(skill);
            skillIds.push(skill.id);
        }
        skillIds.push(droppedItem.id);

        await this.document.update({ 'system.skills': skillIds });
    }

    async _onDropAbility(droppedItem) {
        await this.document.update({ 'system.ability': droppedItem.id });
        console.log(this.document.system.ability);
    }

    async _onDrop(event) {
        const data = TextEditor.getDragEventData(event);
        const droppedItem = await Item.implementation.fromDropData(data);

        switch (droppedItem.type) {
            case 'skill':
                this._onDropSkill(droppedItem);
                break;
            case 'ability':
                this._onDropAbility(droppedItem);
                break;
            default:
                break;
        }
    }
}
