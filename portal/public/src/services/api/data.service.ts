// servizio per recuperare i dati necessari al portale pubblico
// scarica i post, gli utenti e i commenti dal database tramite api

import { apiFetch } from "../../../../shared/utils/api.js";
import { Post, Utente, Commento } from "../../../../shared/types/models.js";

export const DataService = {
    // recupero la lista completa dei post pubblicati
    async getPosts(): Promise<Post[]> {
        return apiFetch<Post[]>("/posts");
    },

    // scarico l'elenco di tutti gli utenti registrati
    async getUsers(): Promise<Utente[]> {
        return apiFetch<Utente[]>("/users");
    },

    // cerco un singolo post usando il suo id univoco
    async getPostById(id: number | string): Promise<Post> {
        return apiFetch<Post>(`/posts/${id}`);
    },

    // recupero tutti i commenti collegati a uno specifico post
    async getCommentsByPostId(id: number | string): Promise<Commento[]> {
        return apiFetch<Commento[]>(`/comments?postId=${id}`);
    }
};
