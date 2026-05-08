// servizio per gestire i commenti tramite api
// permette di leggere, creare, modificare e cancellare i commenti degli articoli

import { apiFetch } from "../../../../shared/utils/api.js";
import { Commento } from "../../../../shared/types/models.js";

export const CommentsService = {
    // recupero tutti i commenti salvati nel database
    async getAll(): Promise<Commento[]> {
        return apiFetch<Commento[]>("/comments");
    },

    // cerco un commento specifico tramite il suo id
    async getById(id: number | string): Promise<Commento> {
        return apiFetch<Commento>(`/comments/${id}`);
    },

    // aggiungo un nuovo commento al sistema
    async create(comment: Partial<Commento>): Promise<Commento> {
        return apiFetch<Commento>("/comments", {
            method: "POST",
            body: JSON.stringify(comment),
        });
    },

    // modifico i dati di un commento già esistente
    async update(id: number | string, comment: Partial<Commento>): Promise<Commento> {
        return apiFetch<Commento>(`/comments/${id}`, {
            method: "PATCH",
            body: JSON.stringify(comment),
        });
    },

    // elimino per sempre un commento dal database
    async delete(id: number | string): Promise<void> {
        return apiFetch<void>(`/comments/${id}`, {
            method: "DELETE",
        });
    },

    // attivo o disattivo un commento (spostandolo nel cestino)
    async setStatus(id: number | string, isActive: boolean): Promise<Commento> {
        return this.update(id, { isActive });
    }
};
