// servizio per recuperare i dati necessari al portale pubblico
// scarica i post, gli utenti e i commenti dal database tramite api
import { apiFetch } from "../../../../shared/utils/api.js";
export const DataService = {
    // recupero la lista completa dei post pubblicati
    async getPosts() {
        return apiFetch("/posts");
    },
    // scarico l'elenco di tutti gli utenti registrati
    async getUsers() {
        return apiFetch("/users");
    },
    // cerco un singolo post usando il suo id univoco
    async getPostById(id) {
        return apiFetch(`/posts/${id}`);
    },
    // recupero tutti i commenti collegati a uno specifico post
    async getCommentsByPostId(id) {
        return apiFetch(`/comments?postId=${id}`);
    }
};
//# sourceMappingURL=data.service.js.map