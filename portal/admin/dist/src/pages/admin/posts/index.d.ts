import { Post } from "../../../../../shared/types/models.js";
export declare const PostsPage: {
    render(container: HTMLElement, state: {
        sezioneAttiva: string;
        ricerca: string;
        paginaCorrente: number;
        limite: number;
    }): Promise<void>;
    bindEvents(container: HTMLElement, posts: Post[], isTrash: boolean): void;
    openRead(id: string): Promise<void>;
    openEdit(id: string): Promise<void>;
    openCreate(): void;
};
