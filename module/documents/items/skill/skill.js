import { ODItem } from '../base.js';

export class ODSkillItem extends ODItem {
    get rank() {
        return this.system.rank;
    }

    get attribute() {
        return this.system.attribute;
    }

    get combat() {
        return this.system.combat;
    }
}
