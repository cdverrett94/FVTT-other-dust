export class CharacterData extends foundry.abstract.DataModel {
    static defineSchema() {
        const fields = foundry.data.fields;
        return {
            attributes: new fields.SchemaField({
                strength: new fields.SchemaField({
                    score: new fields.NumberField({
                        required: true,
                        initial: 0,
                        min: 0,
                        integer: true,
                    }),
                }),
                dexterity: new fields.SchemaField({
                    score: new fields.NumberField({
                        required: true,
                        initial: 0,
                        min: 0,
                        integer: true,
                    }),
                }),
                constitution: new fields.SchemaField({
                    score: new fields.NumberField({
                        required: true,
                        initial: 0,
                        min: 0,
                        integer: true,
                    }),
                }),
                wisdom: new fields.SchemaField({
                    score: new fields.NumberField({
                        required: true,
                        initial: 0,
                        min: 0,
                        integer: true,
                    }),
                }),
                intelligence: new fields.SchemaField({
                    score: new fields.NumberField({
                        required: true,
                        initial: 0,
                        min: 0,
                        integer: true,
                    }),
                }),
                charisma: new fields.SchemaField({
                    score: new fields.NumberField({
                        required: true,
                        initial: 0,
                        min: 0,
                        integer: true,
                    }),
                }),
            }),
            hp: new fields.SchemaField({
                value: new fields.NumberField({
                    required: true,
                    initial: 1,
                    integer: true,
                }),
                min: new fields.NumberField({
                    required: true,
                    initial: 0,
                    integer: true,
                }),
                max: new fields.NumberField({
                    required: true,
                    initial: 1,
                    integer: true,
                }),
            }),
            details: new fields.SchemaField({
                level: new fields.NumberField({
                    required: true,
                    initial: 1,
                    min: 1,
                    integer: true,
                }),
                xp: new fields.NumberField({
                    required: true,
                    initial: 0,
                    min: 0,
                    integer: true,
                }),
                biography: new fields.HTMLField(),
                faction: new fields.StringField(),
            }),
            credits: new fields.NumberField({
                initial: 0,
            }),
            currency: new fields.SchemaField({
                held: new fields.NumberField({
                    initial: 0,
                }),
                bank: new fields.NumberField({
                    initial: 0,
                }),
            }),
        };
    }
}
