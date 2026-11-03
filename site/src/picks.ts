import { reactive } from 'vue';
import type { Pick } from './install';

// Module level, so a selection survives opening a skill page and coming back.
export const picks = reactive(new Map<string, Pick>());

export const pickKey = (pick: Pick) => `${pick.from}#${pick.name}`;
