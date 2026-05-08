export interface Comment {
    postId?: number | string;
    id: number | string;
    name?: string;
    email: string;
    body: string;
    isActive?: boolean;
}
