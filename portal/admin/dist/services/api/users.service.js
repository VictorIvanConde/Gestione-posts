// servizio per gestire utenti e ruoli tramite api
// permette di amministrare chi può accedere al portale e i loro permessi
import { apiFetch } from "../../../../shared/utils/api.js";
export const UsersService = {
    // recupero la lista di tutti gli utenti registrati
    async getAll() {
        return apiFetch("/users");
    },
    // cerco un utente specifico usando il suo id
    async getById(id) {
        return apiFetch(`/users/${id}`);
    },
    // creo un nuovo profilo utente nel database
    async create(user) {
        const payload = { ...user };
        // converto l'id in numero se necessario per json-server
        if (user.id && !isNaN(Number(user.id))) {
            payload.id = Number(user.id);
        }
        return apiFetch("/users", {
            method: "POST",
            body: JSON.stringify(payload),
        });
    },
    // modifico i dati di un utente esistente
    async update(id, user) {
        return apiFetch(`/users/${id}`, {
            method: "PATCH",
            body: JSON.stringify(user),
        });
    },
    // rimuovo definitivamente un utente dal sistema
    async delete(id) {
        return apiFetch(`/users/${id}`, {
            method: "DELETE",
        });
    },
    // abilito o disabilito un utente (cestino)
    async setStatus(id, isActive) {
        return this.update(id, { isActive });
    },
    // recupero l'elenco di tutti i ruoli disponibili (es. admin, user)
    async getRoles() {
        return apiFetch("/roles");
    },
    // aggiungo un nuovo ruolo al sistema
    async createRole(role) {
        const payload = { ...role };
        // gestisco l'id numerico per il nuovo ruolo
        if (payload.id && !isNaN(Number(payload.id))) {
            payload.id = Number(payload.id);
        }
        return apiFetch("/roles", {
            method: "POST",
            body: JSON.stringify(payload),
        });
    },
    // cambio il nome o le proprietà di un ruolo
    async updateRole(id, role) {
        return apiFetch(`/roles/${id}`, {
            method: "PATCH",
            body: JSON.stringify(role),
        });
    },
    // elimino definitivamente un ruolo (attenzione ai collegamenti)
    async deleteRole(id) {
        return apiFetch(`/roles/${id}`, {
            method: "DELETE",
        });
    }
};
//# sourceMappingURL=users.service.js.map