export interface Post {
    userId: number | string;
    id: number | string;
    title: string;
    body: string;
    isActive?: boolean;
}
export interface User {
    id: number | string;
    name: string;
    username?: string;
    email: string;
    roleId: number | string;
    isActive?: boolean;
}
export interface Role {
    id: number | string;
    name: string;
    isActive?: boolean;
}
export interface Comment {
    postId?: number | string;
    id: number | string;
    name?: string;
    email: string;
    body: string;
    isActive?: boolean;
}
