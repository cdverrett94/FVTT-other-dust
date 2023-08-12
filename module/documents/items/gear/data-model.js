export class GearData extends foundry.abstract.DataModel {
    static defineSchema() {
        const fields = foundry.data.fields;

        return {
            description: new fields.StringField(),
            encumbrance: new fields.NumberField({
                initial: 1,
            }),
            cost: new fields.NumberField(),
            status: new fields.StringField({
                choices: ['readied', 'stowed', 'dropped'],
                initial: 'stowed',
            }),
        };
    }
}
