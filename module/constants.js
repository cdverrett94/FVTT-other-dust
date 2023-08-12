const attributes = ['strength', 'constitution', 'dexterity', 'wisdom', 'intelligence', 'charisma'];

const attributeModifiers = {
    0: -2,
    3: -2,
    4: -1,
    8: 0,
    14: 1,
    18: 2,
};

const saves = ['physical', 'mental', 'evasion', 'tech', 'luck'];

const encumbranceStatuses = {
    0: 'unencumbered',
    1: 'lightly',
    2: 'heavily',
    3: 'over',
};

const classSaveAndAttackLevels = [1, 4, 7, 10, 13, 16];

export { attributeModifiers, attributes, classSaveAndAttackLevels, encumbranceStatuses, saves };
