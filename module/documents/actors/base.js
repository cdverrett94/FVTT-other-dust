export class ODActor extends Actor {
    prepareData() {
        super.prepareData();
    }

    prepareDerivedData() {
        this.computeAttributeModifiers();
    }

    computeAttributeModifiers() {
        for (const attribute in this.system.attributes) {
            const score = this.system.attributes[attribute].score;
            if (score === 18) {
                this.system.attributes[attribute].mod = 2;
                continue;
            } else if (score >= 14 && score <= 17) {
                this.system.attributes[attribute].mod = 1;
                continue;
            } else if (score >= 8 && score <= 13) {
                this.system.attributes[attribute].mod = 0;
                continue;
            } else if (score >= 4 && score <= 7) {
                this.system.attributes[attribute].mod = -1;
                continue;
            } else {
                this.system.attributes[attribute].mod = -2;
                continue;
            }
        }
    }

    // Implemented by subclasses
    calculateHitDie() {}

    // Implemented by sublcasses
    calculateSaves() {}

    rollHP() {
        // TODO: roll new level HP
    }

    rollSkill(skill) {
        // TODO: roll skill
    }
}
