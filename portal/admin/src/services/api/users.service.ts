// servizio per gestire utenti e ruoli tramite api
// permette di amministrare chi può accedere al portale e i loro permessi

import { apiFetch } from "../../../../shared/utils/api.js";
import { Utente, Role } from "../../../../shared/types/models.js";

export const UsersService = {
    // recupero la lista di tutti gli utenti registrati
    async getAll(): Promise<Utente[]> {
        return apiFetch<Utente[]>("/users");
    },

    // cerco un utente specifico usando il suo id
    async getById(id: number | string): Promise<Utente> {
        return apiFetch<Utente>(`/users/${id}`);
    },

    // creo un nuovo profilo utente nel database
    async create(user: Partial<Utente>): Promise<Utente> {
        const payload: Partial<Utente> = { ...user };
        
        // converto l'id in numero se necessario per json-server
        if (user.id && !isNaN(Number(user.id))) {
            payload.id = Number(user.id);
        }

        return apiFetch<Utente>("/users", {
            method: "POST",
            body: JSON.stringify(payload),
        });
    },

    // modifico i dati di un utente esistente
    async update(id: number | string, user: Partial<Utente>): Promise<Utente> {
        return apiFetch<Utente>(`/users/${id}`, {
            method: "PATCH",
            body: JSON.stringify(user),
        });
    },

    // rimuovo definitivamente un utente dal sistema
    async delete(id: number | string): Promise<void> {
        return apiFetch<void>(`/users/${id}`, {
            method: "DELETE",
        });
    },

    // abilito o disabilito un utente (cestino)
    async setStatus(id: number | string, isActive: boolean): Promise<Utente> {
        return this.update(id, { isActive });
    },

    // recupero l'elenco di tutti i ruoli disponibili (es. admin, user)
    async getRoles(): Promise<Role[]> {
        return apiFetch<Role[]>("/roles");
    },

    // aggiungo un nuovo ruolo al sistema
    async createRole(role: Partial<Role>): Promise<Role> {
        const payload: Partial<Role> = { ...role };
        
        // gestisco l'id numerico per il nuovo ruolo
        if (payload.id && !isNaN(Number(payload.id))) {
            payload.id = Number(payload.id);
        }

        return apiFetch<Role>("/roles", {
            method: "POST",
            body: JSON.stringify(payload),
        });
    },

    // cambio il nome o le proprietà di un ruolo
    async updateRole(id: number | string, role: Partial<Role>): Promise<Role> {
        return apiFetch<Role>(`/roles/${id}`, {
            method: "PATCH",
            body: JSON.stringify(role),
        });
    },

    // elimino definitivamente un ruolo (attenzione ai collegamenti)
    async deleteRole(id: number | string): Promise<void> {
        return apiFetch<void>(`/roles/${id}`, {
            method: "DELETE",
        });
    }
};
