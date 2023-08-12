import { attributes } from '../../../constants/attributes.js';
import { ODSkillItem } from '../skill/skill.js';

export class BackgroundData extends foundry.abstract.DataModel {
    static defineSchema() {
        const fields = foundry.data.fields;

        return {
            description: new fields.StringField(),
            skillsText: new fields.StringField(),
        };
    }
}
