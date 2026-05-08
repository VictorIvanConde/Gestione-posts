// servizio per gestire le operazioni sui post tramite api
// permette di leggere, creare, modificare e cancellare i post
import { apiFetch } from "../../../../shared/utils/api.js";
export const PostsService = {
    // recupero la lista completa di tutti i post
    async getAll() {
        return apiFetch("/posts");
    },
    // cerco un singolo post usando il suo id
    async getById(id) {
        return apiFetch(`/posts/${id}`);
    },
    // invio i dati per creare un nuovo post sul server
    async create(post) {
        const payload = { ...post };
        // se l'id è un numero lo converto per compatibilità con json-server
        if (post.id && !isNaN(Number(post.id))) {
            payload.id = Number(post.id);
        }
        return apiFetch("/posts", {
            method: "POST",
            body: JSON.stringify(payload),
        });
    },
    // aggiorno solo alcuni campi di un post esistente
    async update(id, post) {
        return apiFetch(`/posts/${id}`, {
            method: "PATCH",
            body: JSON.stringify(post),
        });
    },
    // elimino definitivamente un post dal database
    async delete(id) {
        return apiFetch(`/posts/${id}`, {
            method: "DELETE",
        });
    },
    // cambio lo stato (attivo/nel cestino) di un post
    async setStatus(id, isActive) {
        return this.update(id, { isActive });
    }
};
//# sourceMappingURL=posts.service.js.map