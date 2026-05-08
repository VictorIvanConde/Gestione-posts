import { Utente, Role } from "../../../../../shared/types/models.js";
import { AdminState } from "../../../types/state.js";
export declare const UsersPage: {
    roles: Role[];
    render(container: HTMLElement, state: AdminState): Promise<void>;
    bindEvents(container: HTMLElement, items: (Utente | Role)[], isRoles: boolean): void;
    openEdit(id: string, isRoles: boolean): Promise<void>;
    openCreate(isRoles: boolean): void;
};
