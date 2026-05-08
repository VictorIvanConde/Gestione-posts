import { apiFetch } from "../../utilities/api.js";
export const PostsService = {
    async getAll() {
        return apiFetch("/posts");
    },
    async getById(id) {
        return apiFetch(`/posts/${id}`);
    },
    async create(post) {
        return apiFetch("/posts", {
            method: "POST",
            body: JSON.stringify(post),
        });
    },
    async update(id, post) {
        return apiFetch(`/posts/${id}`, {
            method: "PATCH",
            body: JSON.stringify(post),
        });
    },
    async delete(id) {
        return apiFetch(`/posts/${id}`, {
            method: "DELETE",
        });
    },
    async setStatus(id, isActive) {
        return this.update(id, { isActive });
    }
};
//# sourceMappingURL=posts.service.js.map