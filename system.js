import { ODActorProxy } from './module/documents/actors/actor-proxy.js';
import { CharacterData } from './module/documents/actors/character/data-model.js';
import { ODCharacterSheet } from './module/documents/actors/character/sheet.js';
import { AbilityData } from './module/documents/items/ability/data-model.js';
import { ODAbilitySheet } from './module/documents/items/ability/sheet.js';
import { ArmorData } from './module/documents/items/armor/data-model.js';
import { ODArmorSheet } from './module/documents/items/armor/sheet.js';
import { BackgroundData } from './module/documents/items/background/data-model.js';
import { ODBackgroundSheet } from './module/documents/items/background/sheet.js';
import { ClassData } from './module/documents/items/class/data-model.js';
import { ODClassSheet } from './module/documents/items/class/sheet.js';
import { GearData } from './module/documents/items/gear/data-model.js';
import { ODGearSheet } from './module/documents/items/gear/sheet.js';
import { ODItemProxy } from './module/documents/items/item-proxy.js';
import { SkillData } from './module/documents/items/skill/data-model.js';
import { ODSkillSheet } from './module/documents/items/skill/sheet.js';
import { TrainingData } from './module/documents/items/training/data-model.js';
import { ODTrainingSheet } from './module/documents/items/training/sheet.js';
import { WeaponData } from './module/documents/items/weapon/data-model.js';
import { ODWeaponSheet } from './module/documents/items/weapon/sheet.js';

Hooks.on('init', () => {
    // System Data Models
    CONFIG.Actor.systemDataModels.character = CharacterData;
    CONFIG.Item.systemDataModels.skill = SkillData;
    CONFIG.Item.systemDataModels.class = ClassData;
    CONFIG.Item.systemDataModels.background = BackgroundData;
    CONFIG.Item.systemDataModels.weapon = WeaponData;
    CONFIG.Item.systemDataModels.armor = ArmorData;
    CONFIG.Item.systemDataModels.training = TrainingData;
    CONFIG.Item.systemDataModels.gear = GearData;
    CONFIG.Item.systemDataModels.ability = AbilityData;

    // Load templates
    const templatePaths = [
        // CHARACTER
        'systems/other-dust/templates/actors/character/sheet.html',
        'systems/other-dust/templates/actors/character/partials/details.html',
        'systems/other-dust/templates/actors/character/partials/attributes.html',
        'systems/other-dust/templates/actors/character/partials/character-skills.html',
        'systems/other-dust/templates/actors/character/partials/character-saves.html',
        'systems/other-dust/templates/actors/character/partials/equipment-list.html',
        'systems/other-dust/templates/actors/character/partials/equipment-sidebar.html',

        //SKILL
        'systems/other-dust/templates/items/skill/skill-sheet.html',

        //CLASS
        'systems/other-dust/templates/items/class/class-sheet.html',
        'systems/other-dust/templates/items/class/partials/class-saves.html',
        'systems/other-dust/templates/items/class/partials/class-hd.html',

        // ABILITY
        'systems/other-dust/templates/items/ability/ability-sheet.html',

        // PACKAGE
        'systems/other-dust/templates/items/training/training-sheet.html',

        // BACKGROUND
        'systems/other-dust/templates/items/background/background-sheet.html',

        // WEAPON
        'systems/other-dust/templates/items/weapon/weapon-sheet.html',

        // GEAR
        'systems/other-dust/templates/items/gear/gear-sheet.html',

        // ROLLS
        'systems/other-dust/templates/rolls/attribute-check.html',
        'systems/other-dust/templates/rolls/skill-check.html',
        'systems/other-dust/templates/rolls/saving-throw.html',
        'systems/other-dust/templates/rolls/attack.html',
        'systems/other-dust/templates/rolls/damage.html',
    ];
    loadTemplates(templatePaths);

    Handlebars.registerHelper('add', function (a, b) {
        return parseInt(a) + parseInt(b);
    });

    // Register Document Sheets
    Actors.unregisterSheet('core', ActorSheet);
    Actors.registerSheet('other-dust', ODCharacterSheet, {
        types: ['character'],
        makeDefault: true,
        label: 'Character Sheet',
    });
    Items.unregisterSheet('core', ItemSheet);
    Items.registerSheet('other-dust', ODSkillSheet, {
        types: ['skill'],
        makeDefault: true,
        label: 'Skill Sheet',
    });
    Items.registerSheet('other-dust', ODClassSheet, {
        types: ['class'],
        makeDefault: true,
        label: 'Class Sheet',
    });
    Items.registerSheet('other-dust', ODBackgroundSheet, {
        types: ['background'],
        makeDefault: true,
        label: 'Background Sheet',
    });
    Items.registerSheet('other-dust', ODWeaponSheet, {
        types: ['weapon'],
        makeDefault: true,
        label: 'Weapon Sheet',
    });
    Items.registerSheet('other-dust', ODArmorSheet, {
        types: ['armor'],
        makeDefault: true,
        label: 'Armor Sheet',
    });
    Items.registerSheet('other-dust', ODAbilitySheet, {
        types: ['ability'],
        makeDefault: true,
        label: 'Ability Sheet',
    });
    Items.registerSheet('other-dust', ODTrainingSheet, {
        types: ['training'],
        makeDefault: true,
        label: 'Training Sheet',
    });
    Items.registerSheet('other-dust', ODGearSheet, {
        types: ['gear'],
        makeDefault: true,
        label: 'Gear Sheet',
    });

    CONFIG.Actor.documentClass = ODActorProxy;
    CONFIG.Item.documentClass = ODItemProxy;

    CONFIG.Combat.initiative = {
        formula: '1d8 + @attributes.dexterity.mod',
    };
});

Hooks.on('renderChatMessage', async (document, $html) => {
    const html = $html[0];
    const rollDamageButton = html.querySelector('.roll-damage');
    const damageTargetButton = html.querySelector('.damage-target');

    if (rollDamageButton) {
        rollDamageButton.addEventListener('click', async (event) => {
            let actor = await fromUuid(rollDamageButton.dataset.actorUuid);
            if (actor.constructor.name === 'TokenDocument') actor = actor.actor;
            const targetUuid = rollDamageButton.dataset.targetUuid;
            const weaponId = rollDamageButton.dataset.weaponId;
            actor?.sheet.rollWeaponDamage(weaponId, {
                target: {
                    uuid: targetUuid,
                },
            });
        });
    }
    if (damageTargetButton) {
        damageTargetButton.addEventListener('click', async (event) => {
            const actorId = damageTargetButton.dataset.targetUuid ?? canvas.tokens.controlled[0]?.actor.uuid;
            if (!actorId) return ui.notifications.error('No target selected');
            let actor = await fromUuid(actorId);
            if (actor.constructor.name === 'TokenDocument') actor = actor.actor;

            const oldHp = actor.system.hp.value;
            const damage = document.rolls[0].total;
            const newHp = oldHp - damage;

            actor.update({ 'system.hp.value': newHp });
        });
    }
});
