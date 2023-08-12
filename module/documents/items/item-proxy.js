import { ODItem } from './base.js';
import { ODClassItem } from './class/class.js';
import { ODSkillItem } from './skill/skill.js';
import { ODAbilityItem } from './ability/ability.js';
import { ODWeaponItem } from './weapon/weapon.js';
import { ODArmorItem } from './armor/armor.js';
import { ODBackgroundItem } from './background/background.js';
import { ODGearItem } from './gear/gear.js';

const itemTypes = {
    skill: ODSkillItem,
    class: ODClassItem,
    ability: ODAbilityItem,
    weapon: ODWeaponItem,
    armor: ODArmorItem,
    background: ODBackgroundItem,
    gear: ODGearItem,
};

export const ODItemProxy = new Proxy(ODItem, {
    construct(target, args) {
        const ItemClass = itemTypes[args[0]?.type] ?? ODItem;
        return new ItemClass(...args);
    },
});
