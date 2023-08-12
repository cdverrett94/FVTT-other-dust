import { attributes } from '../../../constants/attributes.js';

export class WeaponData extends foundry.abstract.DataModel {
    static defineSchema() {
        const fields = foundry.data.fields;

        return {
            damage: new fields.StringField(),
            range: new fields.StringField(),
            magazine: new fields.NumberField(),
            techLevel: new fields.NumberField(),
            attribute: new fields.StringField({
                initial: 'strength',
                choices: attributes,
            }),
            skill: new fields.StringField(),
            status: new fields.StringField({
                choices: ['readied', 'stowed', 'dropped'],
                initial: 'stowed',
            }),
            encumbrance: new fields.NumberField({
                initial: 1,
            }),
            cost: new fields.NumberField(),
        };
    }
}
