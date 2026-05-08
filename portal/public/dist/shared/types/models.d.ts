export interface Post {
    userId: number;
    id: number | string;
    title: string;
    body: string;
    isActive?: boolean;
}
export interface Utente {
    id: number | string;
    name: string;
    username?: string;
    email: string;
    roleId?: number;
    isActive?: boolean;
}
export interface Role {
    id: number | string;
    name: string;
    isActive: boolean;
}
export interface Commento {
    postId: number;
    id: number | string;
    name: string;
    email: string;
    body: string;
    isActive?: boolean;
}
