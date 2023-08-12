import { attributes } from '../../../constants/attributes.js';
import { saves } from '../../../constants/saves.js';
import { simplifyRollFormula } from '../../../helpers/simplifyRollFormula.js';

export class ODCharacterSheet extends ActorSheet {
    constructor(...args) {
        super(...args);
    }

    static get defaultOptions() {
        const defaults = super.defaultOptions;

        const overrides = {
            classes: ['od', 'sheet', 'actor', 'character'],
            height: 800,
            width: 950,
            template: `/systems/other-dust/templates/actors/character/sheet.html`,
            resizable: false,
            tabs: [
                {
                    navSelector: '.sheet-tabs',
                    contentSelector: '.sheet-body',
                    initial: 'skills',
                },
            ],
            scrollY: ['.equipment-list', '.skills-container'],
        };

        return foundry.utils.mergeObject(defaults, overrides);
    }

    async getData() {
        const attributesText = {};

        for (const attribute of attributes) {
            attributesText[attribute] = {
                title: game.i18n.localize(`OD.Attributes.${attribute}.Title`),
                abbreviation: game.i18n.localize(`OD.Attributes.${attribute}.Abbreviation`),
            };
        }

        const savesText = {};
        const savesCopy = [...saves];

        for (const save of savesCopy) {
            savesText[save] = game.i18n.localize(`OD.Saves.${save}`);
        }

        const data = {
            document: this.actor,
            attributes: attributesText,
            saves: savesCopy,
            savesText,
            enrichedBiography: await TextEditor.enrichHTML(this.document.system.details.biography, { async: true }),
            encumbranceStatuses: {
                readied: game.i18n.localize(`OD.Equipment.Encumbrance.${this.actor.system.encumbrance.readied.status}`),
                stowed: game.i18n.localize(`OD.Equipment.Encumbrance.${this.actor.system.encumbrance.stowed.status}`),
            },
        };

        return data;
    }

    // TODO: CHAT CARD
    async rollInitialAttribute(attribute) {
        const roll = await Roll.create('3d6').evaluate({ async: true });
        const localizedName = game.i18n.localize(`OD.Attributes.${attribute}.Title`);

        await roll.toMessage({
            flavor: `Initial ${localizedName} Score`,
        });
        await this.actor.update({
            [`system.attributes.${attribute}.score`]: roll._total,
        });
    }

    async rollAttributeCheck(attribute) {
        const attributeModifier = this.actor.system.attributes[attribute].mod;
        const formula = simplifyRollFormula(`2d6 + ${attributeModifier}`);
        const roll = await Roll.create(formula).evaluate({ async: true });

        const tooltip = await roll.getTooltip();
        const localizedName = game.i18n.localize(`OD.Attributes.${attribute}.Title`);

        await roll.toMessage({
            content: await renderTemplate('systems/other-dust/templates/rolls/attribute-check.html', {
                roll,
                attribute: localizedName,
                tooltip,
            }),
        });
    }

    async rollSkillCheck(skillId) {
        const skillItem = this.actor.skills.find((skill) => skill.id === skillId);
        if (!skillItem) return ui.notifications.error(`Unable to find a skill with id ${skillId}`);

        const attributeModifier = this.actor.system.attributes[skillItem.attribute].mod;
        const skillRank = skillItem.rank;
        const formula = simplifyRollFormula(`2d6 + ${attributeModifier} + ${skillRank}`);
        const roll = await Roll.create(formula).evaluate({ async: true });

        const tooltip = await roll.getTooltip();
        await roll.toMessage({
            content: await renderTemplate('systems/other-dust/templates/rolls/skill-check.html', {
                roll,
                skill: skillItem.name,
                tooltip,
            }),
        });
    }

    async rollSave(save) {
        const saveTarget = this.actor.system.saves[save];
        const roll = await Roll.create('1d20').evaluate({ async: true });
        const saveResult = roll._total >= saveTarget ? 'Success' : 'Failure';
        const localizedResult = game.i18n.localize(`OD.Saves.${saveResult}`);

        roll.toMessage({
            content: await renderTemplate('systems/other-dust/templates/rolls/saving-throw.html', {
                roll,
                save: {
                    title: game.i18n.localize(`OD.Saves.${save}`),
                    result: localizedResult,
                    target: saveTarget,
                },
            }),
        });
    }

    // TODO: CHAT CARD
    async rollHP() {
        const hitDie = this.actor.system.hp.hd;
        const roll = await Roll.create(`${hitDie}`).evaluate({ async: true });
        const oldHP = this.actor.system.hp.max;
        const newHP = roll._total;
        const isHigherRoll = oldHP <= newHP;
        await roll.toMessage({
            flavor: `New HP Roll of ${newHP} is ${isHigherRoll ? 'greater than' : 'less than or equal to'} the old HP of ${oldHP}.`,
        });
        if (this.actor.system.hp.max < roll._total) await this.actor.update({ 'system.hp.max': roll._total });
    }

    async rollWeaponAttack(weaponId) {
        const weapon = this.actor.weapons.find((weapon) => weapon.id === weaponId);
        if (!weapon) return;

        if (game.user.targets.size !== 1) ui.notifications.warn('Please target a token.');

        const skill = this.actor.skills.find((skill) => skill.name === weapon.system.skill);
        const skillRank = skill?.system.rank ?? -1;
        const untrainedPenalty = skillRank === -1 ? -2 : 0;
        const attributeModifier = this.actor.system.attributes[weapon.system.attribute].mod ?? -2;
        const target = [...game.user.targets][0];
        const targetAC = target?.actor.system.combat.ac ?? 0;
        const formula = simplifyRollFormula(`1d20 + ${skillRank} + ${untrainedPenalty} + ${attributeModifier} + ${targetAC}`);

        const roll = await Roll.create(formula).evaluate({ async: true });
        const isNatural20 = roll.dice[0].total === 20;
        const isNatural1 = roll.dice[0].total === 1;
        const doesRollHit = (roll._total >= 20 && !isNatural1) || isNatural20;
        await roll.toMessage({
            content: await renderTemplate('systems/other-dust/templates/rolls/attack.html', {
                roll,
                weapon,
                result: doesRollHit,
                isCritical: isNatural1 || isNatural20,
                target: {
                    uuid: target?.actor.uuid,
                    name: target?.actor.name ?? null,
                    ac: targetAC,
                },
                actor: this.actor,
            }),
        });

        if (doesRollHit) {
            this.rollWeaponDamage(weaponId, {
                target: {
                    uuid: target?.actor.uuid,
                },
            });
        }
    }

    async rollWeaponDamage(weaponId, { target } = {}) {
        const weapon = this.actor.weapons.find((weapon) => weapon.id === weaponId);
        if (!weapon) return;

        const skill = this.actor.skills.find((skill) => skill.name === weapon.system.skill);
        const skillRank = skill?.system.rank ?? -1;
        const unarmedDamage = skill?.name === 'Combat/Unarmed' && skillRank > 0 ? skillRank : 0;
        const weaponDamage = simplifyRollFormula(`${weapon.system.damage} + ${unarmedDamage}`);
        const roll = await Roll.create(weaponDamage).evaluate({ async: true });

        roll.toMessage({
            content: await renderTemplate('systems/other-dust/templates/rolls/damage.html', {
                weapon: weapon,
                roll,
                target,
            }),
        });
    }

    activateListeners($html) {
        super.activateListeners($html);
        const html = $html[0];

        // Roll HP
        html.querySelector('.hit-die span').addEventListener('click', (event) => {
            this.rollHP();
        });

        // Roll Initial Attribute Score or Roll Attribute Check
        html.querySelectorAll('.roll-attribute').forEach((element) => {
            element.addEventListener('click', (event) => {
                const attribute = element.dataset.attribute;
                if (this.actor.system.attributes[attribute].score === 0) this.rollInitialAttribute(attribute);
                else this.rollAttributeCheck(attribute);
            });
        });

        // Roll Skill
        html.querySelectorAll('.character-skill .roll-skill').forEach((element) => {
            element.addEventListener('click', (event) => {
                const skillId = element.closest('.character-skill').dataset.itemId;
                this.rollSkillCheck(skillId);
            });
        });

        // Roll Weapon
        html.querySelectorAll('.roll-weapon').forEach((element) => {
            element.addEventListener('click', (event) => {
                const weaponId = element.closest('.weapon-item').dataset.itemId;
                this.rollWeaponAttack(weaponId);
            });
        });

        // Roll Save
        html.querySelectorAll('.roll-save').forEach((element) => {
            element.addEventListener('click', (event) => {
                const save = element.closest('.saving-throw').dataset.save;
                this.rollSave(save);
            });
        });

        // Delete Item
        html.querySelectorAll('.delete-item').forEach((element) => {
            element.addEventListener('click', (event) => {
                const itemId = element.closest('.item').dataset.itemId;
                const item = this.actor.items.find((item) => item.id === itemId);
                if (item) this.actor.deleteEmbeddedDocuments('Item', [item.id]);
            });
        });

        // Edit Item
        html.querySelectorAll('.edit-item').forEach((element) => {
            element.addEventListener('click', (event) => {
                const itemId = element.closest('.item').dataset.itemId;
                const item = this.actor.items.find((item) => item.id === itemId);
                item?.sheet?.render(true);
            });
        });

        // Equip Equipment Item
        html.querySelectorAll('.equip-item').forEach((element) => {
            element.addEventListener('click', (event) => {
                const itemId = element.closest('.item').dataset.itemId;
                const item = this.actor.items.find((item) => item.id === itemId);
                if (item) {
                    const newStatus = item.system.status === 'readied' ? 'stowed' : 'readied';
                    this.actor.updateEmbeddedDocuments('Item', [{ '_id': itemId, 'system.status': newStatus }]);
                }
            });
        });

        // Drop Equipment Item
        html.querySelectorAll('.drop-item').forEach((element) => {
            element.addEventListener('click', (event) => {
                const itemId = element.closest('.item').dataset.itemId;
                const item = this.actor.items.find((item) => item.id === itemId);
                if (item) {
                    const newStatus = item.system.status === 'dropped' ? 'stowed' : 'dropped';
                    this.actor.updateEmbeddedDocuments('Item', [{ '_id': itemId, 'system.status': newStatus }]);
                }
            });
        });
    }

    async _onDropSkill(item) {
        const isDuplicateSkill = !!this.actor.items.find((i) => i.name == item.name && i.type === 'skill');
        if (isDuplicateSkill) return ui.notifications.error("You can't have multiple skills of the same name.");

        await this._onDropItemCreate(item.toObject());
    }

    async _onDropClass(item) {
        const currentClass = this.actor.class;
        if (currentClass) await this.actor.deleteEmbeddedDocuments('Item', [currentClass.id]);

        await this._onDropItemCreate(item.toObject());
    }

    async _onDropBackground(item) {
        const currentBackground = this.actor.background;
        if (currentBackground) await this.actor.deleteEmbeddedDocuments('Item', [currentBackground.id]);

        await this._onDropItemCreate(item.toObject());
    }

    async _onDropTraining(item) {
        const currentTraining = this.actor.training;
        if (currentTraining) await this.actor.deleteEmbeddedDocuments('Item', [currentTraining.id]);

        await this._onDropItemCreate(item.toObject());
    }

    async _onDropItem(event, data) {
        if (!this.actor.isOwner) return false;

        const item = await Item.implementation.fromDropData(data);

        await this._onDropItem2(item);
    }

    async _onDropItem2(item) {
        switch (item.type) {
            case 'skill':
                await this._onDropSkill(item);
                break;
            case 'class':
                await this._onDropClass(item);
                break;
            case 'background':
                await this._onDropBackground(item);
                break;
            case 'training':
                this._onDropTraining(item);
                break;
            default:
                await super._onDropItemCreate(item.toObject());
                break;
        }
    }

    async _onDropFolder(event, data) {
        if (!this.actor.isOwner) return [];
        if (data.documentName !== 'Item') return [];
        const folder = await Folder.implementation.fromDropData(data);
        if (!folder) return [];

        for (const item of folder.contents) {
            await this._onDropItem2(item);
        }
    }
}
