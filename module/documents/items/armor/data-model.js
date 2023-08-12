import { attributes } from '../../../constants/attributes.js';

export class ArmorData extends foundry.abstract.DataModel {
    static defineSchema() {
        const fields = foundry.data.fields;

        return {
            description: new fields.StringField(),
            ac: new fields.NumberField(),
            encumbrance: new fields.NumberField(),
            shield: new fields.BooleanField({
                initial: false,
            }),
            cost: new fields.NumberField(),
            status: new fields.StringField({
                choices: ['readied', 'stowed', 'dropped'],
                initial: 'stowed',
            }),
        };
    }
}
