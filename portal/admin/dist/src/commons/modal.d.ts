export declare const Modal: {
    open(id: string, content: string, onOverlayClick?: () => void): void;
    close(): void;
    confirm(message: string): Promise<boolean>;
};
