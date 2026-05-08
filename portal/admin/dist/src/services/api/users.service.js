import { apiFetch } from "../../utilities/api.js";
export const UsersService = {
    async getAll() {
        return apiFetch("/users");
    },
    async getById(id) {
        return apiFetch(`/users/${id}`);
    },
    async create(user) {
        return apiFetch("/users", {
            method: "POST",
            body: JSON.stringify(user),
        });
    },
    async update(id, user) {
        return apiFetch(`/users/${id}`, {
            method: "PATCH",
            body: JSON.stringify(user),
        });
    },
    async delete(id) {
        return apiFetch(`/users/${id}`, {
            method: "DELETE",
        });
    },
    async setStatus(id, isActive) {
        return this.update(id, { isActive });
    },
    async getRoles() {
        return apiFetch("/roles");
    },
    async createRole(role) {
        // Logica specifica per gestire ID manuali se forniti
        const method = role.id ? "PUT" : "POST";
        const url = role.id ? `/roles/${role.id}` : "/roles";
        return apiFetch(url, {
            method,
            body: JSON.stringify(role),
        });
    },
    async deleteRole(id) {
        return apiFetch(`/roles/${id}`, {
            method: "DELETE",
        });
    }
};
//# sourceMappingURL=users.service.js.map