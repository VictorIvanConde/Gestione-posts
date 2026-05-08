import { Commento } from "../../../../../shared/types/models.js";
import { AdminState } from "../../../types/state.js";
export declare const CommentsPage: {
    render(container: HTMLElement, state: AdminState): Promise<void>;
    bindEvents(container: HTMLElement, comments: Commento[]): void;
    openRead(id: string): Promise<void>;
    openEdit(id: string): Promise<void>;
    openCreate(): void;
};
