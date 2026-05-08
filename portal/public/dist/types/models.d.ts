export interface Post {
    userId: number;
    id: number;
    title: string;
    body: string;
}
export interface Utente {
    id: number;
    name: string;
    username: string;
    email: string;
}
export interface Commento {
    postId: number;
    id: number;
    name: string;
    email: string;
    body: string;
}
