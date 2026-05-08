import { Post } from "../types/models.js";
interface Namable {
    id: number | string;
    name?: string;
    title?: string;
}
export declare const Logic: {
    filtraPost(posts: Post[], query: string): Post[];
    trovaNomeInLista(lista: Namable[], id: number | string, fallback?: string): string;
};
export {};
