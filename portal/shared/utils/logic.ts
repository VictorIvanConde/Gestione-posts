// utilità per gestire la logica di filtraggio e ricerca dati
// serve per pulire il codice delle pagine da calcoli ripetitivi

import { Post } from "../types/models.js";

interface Namable {
    id: number | string;
    name?: string;
    title?: string;
}

export const Logic = {
    
    // filtro i post in base al testo cercato dall'utente
    // la ricerca parte solo dopo i 3 caratteri inseriti
    filtraPost(posts: Post[], query: string): Post[] {
        const q: string = query.trim().toLowerCase();
        if (q.length < 3) return posts;

        const parole: string[] = q.split(/\s+/).filter((p: string) => p.length > 0);

        return posts.filter((p: Post) => {
            const title: string = p.title.toLowerCase();
            const body: string = p.body.toLowerCase();
            
            // il post deve contenere tutte le parole cercate
            return parole.every((parola: string) => title.includes(parola) || body.includes(parola));
        });
    },

    // recupero il nome di un elemento (utente, ruolo, ecc) partendo dall'id
    // se non trovo nulla restituisco un valore di default (N/D)
    trovaNomeInLista(lista: Namable[], id: number | string, fallback: string = "N/D"): string {
        const trovato: Namable | undefined = lista.find((item: Namable) => String(item.id) === String(id));
        return trovato ? (trovato.name || trovato.title || fallback) : fallback;
    }
};
