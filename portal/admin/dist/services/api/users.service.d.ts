import { Utente, Role } from "../../../../shared/types/models.js";
export declare const UsersService: {
    getAll(): Promise<Utente[]>;
    getById(id: number | string): Promise<Utente>;
    create(user: Partial<Utente>): Promise<Utente>;
    update(id: number | string, user: Partial<Utente>): Promise<Utente>;
    delete(id: number | string): Promise<void>;
    setStatus(id: number | string, isActive: boolean): Promise<Utente>;
    getRoles(): Promise<Role[]>;
    createRole(role: Partial<Role>): Promise<Role>;
    updateRole(id: number | string, role: Partial<Role>): Promise<Role>;
    deleteRole(id: number | string): Promise<void>;
};
