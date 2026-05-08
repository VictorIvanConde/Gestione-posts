// servizio per gestire i commenti tramite api
// permette di leggere, creare, modificare e cancellare i commenti degli articoli
import { apiFetch } from "../../../../shared/utils/api.js";
export const CommentsService = {
    // recupero tutti i commenti salvati nel database
    async getAll() {
        return apiFetch("/comments");
    },
    // cerco un commento specifico tramite il suo id
    async getById(id) {
        return apiFetch(`/comments/${id}`);
    },
    // aggiungo un nuovo commento al sistema
    async create(comment) {
        return apiFetch("/comments", {
            method: "POST",
            body: JSON.stringify(comment),
        });
    },
    // modifico i dati di un commento già esistente
    async update(id, comment) {
        return apiFetch(`/comments/${id}`, {
            method: "PATCH",
            body: JSON.stringify(comment),
        });
    },
    // elimino per sempre un commento dal database
    async delete(id) {
        return apiFetch(`/comments/${id}`, {
            method: "DELETE",
        });
    },
    // attivo o disattivo un commento (spostandolo nel cestino)
    async setStatus(id, isActive) {
        return this.update(id, { isActive });
    }
};
//# sourceMappingURL=comments.service.js.map