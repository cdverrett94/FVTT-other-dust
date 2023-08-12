export class TrainingData extends foundry.abstract.DataModel {
    static defineSchema() {
        const fields = foundry.data.fields;

        return {
            description: new fields.StringField(),
            skillsText: new fields.StringField(),
            class: new fields.StringField(),
        };
    }
}
