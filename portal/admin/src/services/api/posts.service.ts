// servizio per gestire le operazioni sui post tramite api
// permette di leggere, creare, modificare e cancellare i post

import { apiFetch } from "../../../../shared/utils/api.js";
import { Post } from "../../../../shared/types/models.js";

export const PostsService = {
    // recupero la lista completa di tutti i post
    async getAll(): Promise<Post[]> {
        return apiFetch<Post[]>("/posts");
    },

    // cerco un singolo post usando il suo id
    async getById(id: number | string): Promise<Post> {
        return apiFetch<Post>(`/posts/${id}`);
    },

    // invio i dati per creare un nuovo post sul server
    async create(post: Partial<Post>): Promise<Post> {
        const payload: Partial<Post> = { ...post };
        
        // se l'id è un numero lo converto per compatibilità con json-server
        if (post.id && !isNaN(Number(post.id))) {
            payload.id = Number(post.id); 
        }

        return apiFetch<Post>("/posts", {
            method: "POST",
            body: JSON.stringify(payload),
        });
    },

    // aggiorno solo alcuni campi di un post esistente
    async update(id: number | string, post: Partial<Post>): Promise<Post> {
        return apiFetch<Post>(`/posts/${id}`, {
            method: "PATCH",
            body: JSON.stringify(post),
        });
    },

    // elimino definitivamente un post dal database
    async delete(id: number | string): Promise<void> {
        return apiFetch<void>(`/posts/${id}`, {
            method: "DELETE",
        });
    },

    // cambio lo stato (attivo/nel cestino) di un post
    async setStatus(id: number | string, isActive: boolean): Promise<Post> {
        return this.update(id, { isActive });
    }
};
