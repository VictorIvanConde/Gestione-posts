export declare const CommentsPage: {
    render(container: HTMLElement, state: any): Promise<void>;
    bindEvents(container: HTMLElement, comments: any[], isTrash: boolean): void;
    openRead(id: string): Promise<void>;
    openEdit(id: string): Promise<void>;
    openCreate(): void;
};
