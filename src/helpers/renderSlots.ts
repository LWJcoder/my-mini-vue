import { createVnode } from "../runtime-core/vnode";

export function renderSlots(slots: any) {
    return createVnode('div', {}, slots)
}