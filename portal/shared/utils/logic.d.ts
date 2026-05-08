import { Post, Utente, Role, Commento } from "../types/models.js";
interface Namable {
    id: number | string;
    name?: string;
    title?: string;
}
export declare const Logic: {
    filtraPost(posts: Post[], query: string): Post[];
    trovaNomeInLista(lista: Namable[], id: number | string, fallback?: string): string;
};
export declare function isUtente(item: Post | Utente | Role | Commento): item is Utente;
export declare function isCommento(item: Post | Utente | Role | Commento): item is Commento;
export {};
