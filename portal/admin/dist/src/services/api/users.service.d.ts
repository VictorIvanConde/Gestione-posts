import { Utente, Role } from "../../../../shared/types/models.js";
export declare const UsersService: {
    getAll(): Promise<Utente[]>;
    getById(id: number | string): Promise<Utente>;
    create(user: Omit<Utente, "id">): Promise<Utente>;
    update(id: number | string, user: Partial<Utente>): Promise<Utente>;
    delete(id: number | string): Promise<void>;
    setStatus(id: number | string, isActive: boolean): Promise<Utente>;
    getRoles(): Promise<Role[]>;
    createRole(role: Role): Promise<Role>;
    deleteRole(id: number | string): Promise<void>;
};
