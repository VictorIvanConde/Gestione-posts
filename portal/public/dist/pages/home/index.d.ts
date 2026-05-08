import { Post, Utente } from "../../../../shared/types/models.js";
export declare const HomePage: {
    tuttiPost: Post[];
    tuttiUtenti: Utente[];
    testoRicerca: string;
    init(): Promise<void>;
    trovaNomeUtente(userId: number): string;
    renderLista(posts: Post[], container: HTMLElement, activeId: number | string | null): void;
    renderDettaglio(postId: number, container: HTMLElement): Promise<void>;
};
