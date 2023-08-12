import { ODActor } from './base.js';
import { ODCharacterActor } from './character/character.js';

const actorTypes = {
    character: ODCharacterActor,
};

export const ODActorProxy = new Proxy(ODActor, {
    construct(target, args) {
        const ActorClass = actorTypes[args[0]?.type] ?? ODActor;
        return new ActorClass(...args);
    },
});
