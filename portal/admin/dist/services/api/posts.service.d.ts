import { Post } from "../../../../shared/types/models.js";
export declare const PostsService: {
    getAll(): Promise<Post[]>;
    getById(id: number | string): Promise<Post>;
    create(post: Partial<Post>): Promise<Post>;
    update(id: number | string, post: Partial<Post>): Promise<Post>;
    delete(id: number | string): Promise<void>;
    setStatus(id: number | string, isActive: boolean): Promise<Post>;
};
