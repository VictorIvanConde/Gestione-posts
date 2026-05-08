import { Utente, Role } from "../../../../../shared/types/models.js";
export declare const UsersPage: {
    roles: Role[];
    render(container: HTMLElement, state: {
        sezioneAttiva: string;
        ricerca: string;
        paginaCorrente: number;
        limite: number;
    }): Promise<void>;
    bindEvents(container: HTMLElement, items: (Utente | Role)[], isTrash: boolean, isRoles: boolean): void;
    openEdit(id: string, isRoles: boolean): Promise<void>;
    openCreate(isRoles: boolean): void;
};
