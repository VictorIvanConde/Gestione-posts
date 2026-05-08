import { Comment } from "../../types/comment.type.js";
export declare const CommentsService: {
    getAll(): Promise<Comment[]>;
    getById(id: number | string): Promise<Comment>;
    create(comment: Omit<Comment, "id">): Promise<Comment>;
    update(id: number | string, comment: Partial<Comment>): Promise<Comment>;
    delete(id: number | string): Promise<void>;
    setStatus(id: number | string, isActive: boolean): Promise<Comment>;
};
