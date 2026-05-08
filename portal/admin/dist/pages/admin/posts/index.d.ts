import { Post } from "../../../../../shared/types/models.js";
import { AdminState } from "../../../types/state.js";
export declare const PostsPage: {
    render(container: HTMLElement, state: AdminState): Promise<void>;
    bindEvents(container: HTMLElement, posts: Post[]): void;
    openRead(id: string): Promise<void>;
    openEdit(id: string): Promise<void>;
    openCreate(): void;
};
