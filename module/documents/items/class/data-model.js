import { attributes } from '../../../constants/attributes.js';
import { ODAbilityItem } from '../ability/ability.js';
import { ODSkillItem } from '../skill/skill.js';

export class ClassData extends foundry.abstract.DataModel {
    static defineSchema() {
        const fields = foundry.data.fields;

        return {
            primeAttributes: new fields.SchemaField({
                first: new fields.StringField({
                    initial: 'strength',
                    required: false,
                    choices: attributes,
                    nullable: true,
                    blank: true,
                }),
                second: new fields.StringField({
                    initial: 'constitution',
                    required: false,
                    choices: attributes,
                    nullable: true,
                    blank: true,
                }),
            }),
            description: new fields.StringField(),
            skillsText: new fields.StringField(),
            skills: new fields.ArrayField(
                new fields.ForeignDocumentField(ODSkillItem, {
                    required: false,
                    type: 'skill',
                })
            ),
            hd: new fields.SchemaField({
                1: new fields.StringField({ initial: '1d6' }),
                2: new fields.StringField({ initial: '2d6' }),
                3: new fields.StringField({ initial: '3d6' }),
                4: new fields.StringField({ initial: '4d6' }),
                5: new fields.StringField({ initial: '5d6' }),
                6: new fields.StringField({ initial: '6d6' }),
                7: new fields.StringField({ initial: '7d6' }),
                8: new fields.StringField({ initial: '8d6' }),
                9: new fields.StringField({ initial: '9d6' }),
                10: new fields.StringField({ initial: '9d6+2' }),
                11: new fields.StringField({ initial: '+2' }),
            }),
            savesAndAttack: new fields.SchemaField({
                1: new fields.SchemaField({
                    attack: new fields.NumberField({
                        initial: 1,
                        required: true,
                    }),
                    physical: new fields.NumberField({
                        initial: 20,
                        required: true,
                    }),
                    mental: new fields.NumberField({
                        initial: 20,
                        required: true,
                    }),
                    evasion: new fields.NumberField({
                        initial: 20,
                        required: true,
                    }),
                    tech: new fields.NumberField({
                        initial: 20,
                        required: true,
                    }),
                    luck: new fields.NumberField({
                        initial: 20,
                        required: true,
                    }),
                }),
                4: new fields.SchemaField({
                    attack: new fields.NumberField({
                        initial: 1,
                        required: true,
                    }),
                    physical: new fields.NumberField({
                        initial: 20,
                        required: true,
                    }),
                    mental: new fields.NumberField({
                        initial: 20,
                        required: true,
                    }),
                    evasion: new fields.NumberField({
                        initial: 20,
                        required: true,
                    }),
                    tech: new fields.NumberField({
                        initial: 20,
                        required: true,
                    }),
                    luck: new fields.NumberField({
                        initial: 20,
                        required: true,
                    }),
                }),
                7: new fields.SchemaField({
                    attack: new fields.NumberField({
                        initial: 1,
                        required: true,
                    }),
                    physical: new fields.NumberField({
                        initial: 20,
                        required: true,
                    }),
                    mental: new fields.NumberField({
                        initial: 20,
                        required: true,
                    }),
                    evasion: new fields.NumberField({
                        initial: 20,
                        required: true,
                    }),
                    tech: new fields.NumberField({
                        initial: 20,
                        required: true,
                    }),
                    luck: new fields.NumberField({
                        initial: 20,
                        required: true,
                    }),
                }),
                10: new fields.SchemaField({
                    attack: new fields.NumberField({
                        initial: 1,
                        required: true,
                    }),
                    physical: new fields.NumberField({
                        initial: 20,
                        required: true,
                    }),
                    mental: new fields.NumberField({
                        initial: 20,
                        required: true,
                    }),
                    evasion: new fields.NumberField({
                        initial: 20,
                        required: true,
                    }),
                    tech: new fields.NumberField({
                        initial: 20,
                        required: true,
                    }),
                    luck: new fields.NumberField({
                        initial: 20,
                        required: true,
                    }),
                }),
                13: new fields.SchemaField({
                    attack: new fields.NumberField({
                        initial: 1,
                        required: true,
                    }),
                    physical: new fields.NumberField({
                        initial: 20,
                        required: true,
                    }),
                    mental: new fields.NumberField({
                        initial: 20,
                        required: true,
                    }),
                    evasion: new fields.NumberField({
                        initial: 20,
                        required: true,
                    }),
                    tech: new fields.NumberField({
                        initial: 20,
                        required: true,
                    }),
                    luck: new fields.NumberField({
                        initial: 20,
                        required: true,
                    }),
                }),
                16: new fields.SchemaField({
                    attack: new fields.NumberField({
                        initial: 1,
                        required: true,
                    }),
                    physical: new fields.NumberField({
                        initial: 20,
                        required: true,
                    }),
                    mental: new fields.NumberField({
                        initial: 20,
                        required: true,
                    }),
                    evasion: new fields.NumberField({
                        initial: 20,
                        required: true,
                    }),
                    tech: new fields.NumberField({
                        initial: 20,
                        required: true,
                    }),
                    luck: new fields.NumberField({
                        initial: 20,
                        required: true,
                    }),
                }),
            }),
            ability: new fields.ForeignDocumentField(ODAbilityItem, {
                required: false,
                type: 'ability',
            }),
        };
    }
}
