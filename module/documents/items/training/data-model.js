import { attributes } from '../../../constants/attributes.js';

export class TrainingData extends foundry.abstract.DataModel {
    static defineSchema() {
        const fields = foundry.data.fields;

        return {
            description: new fields.StringField(),
            skillsText: new fields.StringField(),
        };
    }
}
