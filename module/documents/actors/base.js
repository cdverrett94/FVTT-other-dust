import { attributeModifiers } from '../../constants.js';
import { findHighestValue } from '../../helpers.js';

export class ODActor extends Actor {
    prepareData() {
        super.prepareData();
    }

    prepareDerivedData() {
        this.computeAttributeModifiers();
    }

    computeAttributeModifiers() {
        const modifiers = attributeModifiers;

        for (const attribute in this.system.attributes) {
            const score = this.system.attributes[attribute].score;
            this.system.attributes[attribute].mod = modifiers[findHighestValue(modifiers, score)];
        }
    }

    async _preUpdate(changed, options, user) {
        await super._preUpdate(changed, options, user);

        if ('hp' in (changed.system || {})) {
            const currentHp = this.system.hp.value;
            const changedHp = changed.system.hp.value;
            const newHp = Math.clamped(changedHp, 0, this.system.hp.max);
            const hpDelta = newHp - currentHp;
            changed.system.hp.value = newHp;

            options.dhp = hpDelta;
        }
    }

    _onUpdate(data, options, userId) {
        super._onUpdate(data, options, userId);
        this._displayScrollingDamage(options.dhp);
    }

    _displayScrollingDamage(dhp) {
        if (!dhp) return;
        dhp = Number(dhp);
        const tokens = this.isToken ? [this.token?.object] : this.getActiveTokens(true);
        for (const t of tokens) {
            if (!t.visible || !t.renderable) continue;
            const pct = Math.clamped(Math.abs(dhp) / this.system.hp.max, 0, 1);
            canvas.interface.createScrollingText(t.center, dhp.signedString(), {
                anchor: CONST.TEXT_ANCHOR_POINTS.TOP,
                fontSize: 16 + 32 * pct, // Range between [16, 48]
                fill: dhp < 0 ? 'red' : 'green',
                stroke: 0x000000,
                strokeThickness: 4,
                jitter: 0.25,
            });
        }
    }
}
