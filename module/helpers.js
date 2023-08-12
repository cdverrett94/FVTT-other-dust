const findHighestValue = (table, value) => {
    if (!Array.isArray(table)) table = Object.keys(table);
    let closest = table.reduce(function (prev, curr) {
        curr = Number(curr);
        prev = Number(prev);
        return value >= curr && curr >= prev ? curr : prev;
    }, 0);
    return closest;
};

const simplifyRollFormula = (formula) => {
    const parts = /(?<die>\d+d\d+)?(?<mods>[\d\+\-\s]*)/gm.exec(formula);
    const die = parts.groups.die ?? '';
    const modifiers = Roll.safeEval(parts.groups.mods || '0');
    const sign = Math.sign(modifiers) === -1 ? '-' : '+';

    return `${die} ${sign} ${Math.abs(modifiers)}`;
};

export { findHighestValue, simplifyRollFormula };
