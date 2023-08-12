import { simplifyRollFormula } from '../../../helpers.js';
import { ODActor } from '../base.js';

export class ODCharacterActor extends ODActor {
    prepareDerivedData() {
        super.prepareDerivedData();

        this.system.skills = this.items.filter((item) => item.type === 'skill').sort((a, b) => a.name.localeCompare(b.name));
        this.system.details.class = this.items.find((item) => item.type === 'class') ?? null;
        this.system.details.background = this.items.find((item) => item.type === 'background') ?? null;
        this.system.details.ability = this.system.details.class?.ability ?? null;
        this.system.details.training = this.items.find((item) => item.type === 'training') ?? null;
        this.system.combat = {};

        this.calculateHitDie();
        this.calculateSavesAndBonus();
        this.calculateAC();
        this.calculateEncumbrance();
        this.calculateMovement();
    }

    get skills() {
        return this.system.skills;
    }

    get class() {
        return this.system.details.class;
    }

    get ability() {
        return this.class.system.ability;
    }

    get training() {
        return this.system.details.training;
    }

    get background() {
        return this.system.details.background;
    }

    get weapons() {
        return this.items.filter((item) => item.type === 'weapon');
    }

    get armor() {
        return this.items.filter((item) => item.type === 'armor');
    }

    get gear() {
        return this.items.filter((item) => item.type === 'gear');
    }

    calculateHitDie() {
        if (this.class) {
            const level = this.system.details.level;
            let hd;
            if (level <= 9) {
                hd = simplifyRollFormula(`${this.class.system.hd[level]} + ${level * this.system.attributes.constitution.mod}`);
            } else if (level <= 10) {
                hd = simplifyRollFormula(this.class.system.hd[level]);
            } else {
                const levelsOver10 = level - 10;
                hd = simplifyRollFormula(`${this.class.system.hd[10]} + ${levelsOver10 * parseInt(this.class.system.hd[11])}`);
            }
            this.system.hp.hd = hd;
        }
    }

    calculateSavesAndBonus() {
        if (this.class) {
            const level = this.system.details.level;
            let saveAndAttackLevel = Math.ceil(level / 3) * 3 - 2;
            const savesForLevel = this.class.system.savesAndAttack[saveAndAttackLevel];

            this.system.saves = {};
            for (const save in savesForLevel) {
                if (save === 'attack') continue;
                this.system.saves[save] = savesForLevel[save];
            }
            this.system.combat.attack = savesForLevel.attack;
        } else {
            this.system.saves = {
                physical: 0,
                mental: 0,
                evasion: 0,
                tech: 0,
                luck: 0,
            };
            this.system.combat.attack = 0;
        }
    }

    calculateAC() {
        const defaultAC = 9;

        const readiedArmor = this.armor.find((armor) => armor.system.status === 'readied' && !armor.system.shield);
        const readiedShield = this.armor.find((armor) => armor.system.status === 'readied' && armor.system.shield);
        const armorAC = readiedArmor?.system.ac ?? defaultAC;
        const shieldAC = readiedShield?.system.ac ?? 0;
        const dexMod = this.system.attributes.dexterity.mod;
        const totalAC = armorAC + shieldAC - dexMod;

        this.system.combat.ac = totalAC;
    }

    calculateEncumbrance() {
        const equipmentList = [...this.weapons, ...this.armor, ...this.gear];
        const readiedItems = equipmentList.filter((item) => item.system.status === 'readied');
        const stowedItems = equipmentList.filter((item) => item.system.status === 'stowed');

        const readiedEncumbrance = readiedItems.reduce((accumulator, current) => {
            return accumulator + current.system.encumbrance;
        }, 0);

        const stowedEncumbrance = stowedItems.reduce((accumulator, current) => {
            return accumulator + current.system.encumbrance;
        }, 0);

        const maxReadiedEncumbrance = Math.floor(this.system.attributes.strength.score / 2);
        const maxStowedEncumbrance = this.system.attributes.strength.score;

        const encumbranceStatus = (type, currentEncumbrance, maxEncumbrance) => {
            const extraEncumbrance = type === 'readied' ? 2 : 4;
            const difference = currentEncumbrance - maxEncumbrance;
            if (difference <= 0) return 'unencumbered';
            if (Math.ceil(difference / extraEncumbrance) < 3) {
                return Math.ceil(difference / extraEncumbrance) === 1 ? 'lightly' : 'heavily';
            }
            return 'over';
        };

        const readiedEncumbranceStatus = encumbranceStatus('readied', readiedEncumbrance, maxReadiedEncumbrance);
        const stowedEncumbranceStatus = encumbranceStatus('stowed', stowedEncumbrance, maxStowedEncumbrance);
        let totalEncumbranceStatus;
        if (readiedEncumbranceStatus === 'over' || stowedEncumbranceStatus === 'over') {
            totalEncumbranceStatus = 'over';
        } else if (readiedEncumbranceStatus === 'heavily' || stowedEncumbranceStatus === 'heavily') {
            totalEncumbranceStatus = 'heavily';
        } else if (readiedEncumbranceStatus === 'lightly' || stowedEncumbranceStatus === 'lightly') {
            totalEncumbranceStatus = 'lightly';
        } else {
            totalEncumbranceStatus = 'unencumbered';
        }

        this.system.encumbrance = {
            readied: {
                value: readiedEncumbrance,
                max: maxReadiedEncumbrance,
                status: readiedEncumbranceStatus,
            },
            stowed: {
                value: stowedEncumbrance,
                max: maxStowedEncumbrance,
                status: stowedEncumbranceStatus,
            },
            status: totalEncumbranceStatus,
        };
    }

    calculateMovement() {
        if (this.system.encumbrance.status === 'lightly') this.system.movement = 15;
        else if (this.system.encumbrance.status === 'heavily') this.system.movement = 10;
        else if (this.system.encumbrance.status === 'over') this.system.movement = 0;
        else this.system.movement = 20;
    }
}
