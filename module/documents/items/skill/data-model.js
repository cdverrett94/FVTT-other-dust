import { attributes } from '../../../constants/attributes.js';

export class SkillData extends foundry.abstract.DataModel {
    static defineSchema() {
        const fields = foundry.data.fields;

        return {
            rank: new fields.NumberField({
                required: true,
                initial: -1,
                min: -1,
            }),
            attribute: new fields.StringField({
                initial: 'strength',
                choices: attributes,
            }),
            combat: new fields.BooleanField({
                required: true,
                initial: false,
            }),
            description: new fields.HTMLField(),
        };
    }
}
