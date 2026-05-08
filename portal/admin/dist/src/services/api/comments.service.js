import { apiFetch } from "../../utilities/api.js";
export const CommentsService = {
    async getAll() {
        return apiFetch("/comments");
    },
    async getById(id) {
        return apiFetch(`/comments/${id}`);
    },
    async create(comment) {
        return apiFetch("/comments", {
            method: "POST",
            body: JSON.stringify(comment),
        });
    },
    async update(id, comment) {
        return apiFetch(`/comments/${id}`, {
            method: "PATCH",
            body: JSON.stringify(comment),
        });
    },
    async delete(id) {
        return apiFetch(`/comments/${id}`, {
            method: "DELETE",
        });
    },
    async setStatus(id, isActive) {
        return this.update(id, { isActive });
    }
};
//# sourceMappingURL=comments.service.js.map