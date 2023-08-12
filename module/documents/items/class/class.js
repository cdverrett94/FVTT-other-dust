import { ODItem } from '../base.js';

export class ODClassItem extends ODItem {
    get skills() {
        const skillsArray = [];
        for (const skill of this.system.skills) {
            skillsArray.push(skill());
        }
        return skillsArray;
    }
}
