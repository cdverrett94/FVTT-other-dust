class ODRoll extends Roll {
    static simplifyRollFormula = (formula) => {
        const parts = /(\d+d\d+)([\d\+\-\s]*)/gm.exec(formula);
        const die = parts[1];
        const modifiers = Roll.safeEval(parts[2] || '0');
        const sign = Math.sign(modifiers) === -1 ? '-' : '+';

        return `${die} ${sign} ${Math.abs(modifiers)}`;
    };
}

class ODAttributeRoll extends ODRoll {}

export { ODRoll, ODAttributeRoll };
