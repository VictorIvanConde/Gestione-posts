import { Commento } from "../../../../shared/types/models.js";
export declare const CommentsService: {
    getAll(): Promise<Commento[]>;
    getById(id: number | string): Promise<Commento>;
    create(comment: Partial<Commento>): Promise<Commento>;
    update(id: number | string, comment: Partial<Commento>): Promise<Commento>;
    delete(id: number | string): Promise<void>;
    setStatus(id: number | string, isActive: boolean): Promise<Commento>;
};
