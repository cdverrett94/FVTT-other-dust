export class AbilityData extends foundry.abstract.DataModel {
    static defineSchema() {
        const fields = foundry.data.fields;

        return {
            description: new fields.HTMLField({
                required: false,
                nullable: true,
                blank: true,
            }),
        };
    }
}
