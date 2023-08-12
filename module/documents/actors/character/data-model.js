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
                        nullable: false,
                    }),
                }),
                dexterity: new fields.SchemaField({
                    score: new fields.NumberField({
                        required: true,
                        initial: 0,
                        min: 0,
                        integer: true,
                        nullable: false,
                    }),
                }),
                constitution: new fields.SchemaField({
                    score: new fields.NumberField({
                        required: true,
                        initial: 0,
                        min: 0,
                        integer: true,
                        nullable: false,
                    }),
                }),
                wisdom: new fields.SchemaField({
                    score: new fields.NumberField({
                        required: true,
                        initial: 0,
                        min: 0,
                        integer: true,
                        nullable: false,
                    }),
                }),
                intelligence: new fields.SchemaField({
                    score: new fields.NumberField({
                        required: true,
                        initial: 0,
                        min: 0,
                        integer: true,
                        nullable: false,
                    }),
                }),
                charisma: new fields.SchemaField({
                    score: new fields.NumberField({
                        required: true,
                        initial: 0,
                        min: 0,
                        integer: true,
                        nullable: false,
                    }),
                }),
            }),
            hp: new fields.SchemaField({
                value: new fields.NumberField({
                    required: true,
                    initial: 1,
                    integer: true,
                    min: 0,
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
