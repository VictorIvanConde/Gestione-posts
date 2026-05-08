import { Post, Utente, Commento } from "../../../../shared/types/models.js";
export declare const DataService: {
    getPosts(): Promise<Post[]>;
    getUsers(): Promise<Utente[]>;
    getPostById(id: number): Promise<Post>;
    getCommentsByPostId(id: number): Promise<Commento[]>;
};
