import { Post, Utente, Role, Commento } from "../../../../../shared/types/models.js";
import { AdminState } from "../../../types/state.js";
type TrashItem = Post | Utente | Role | Commento;
export declare const TrashPage: {
    subSezioneAttiva: string;
    render(container: HTMLElement, state: AdminState): Promise<void>;
    bindEvents(container: HTMLElement, items: TrashItem[]): void;
};
export {};
