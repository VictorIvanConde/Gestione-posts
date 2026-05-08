// utilità per gestire la logica di filtraggio e ricerca dati
// serve per pulire il codice delle pagine da calcoli ripetitivi

import { Post, Utente, Role, Commento } from "../types/models.js";

// interfaccia interna per trovare un nome o titolo partendo dall'id
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

// type guard per verificare se un elemento è un utente
// usata nel cestino e nella pagina utenti per discriminare i tipi
export function isUtente(item: Post | Utente | Role | Commento): item is Utente {
    return (item as Utente).email !== undefined && (item as Utente).roleId !== undefined;
}

// type guard per verificare se un elemento è un commento
// usata nel cestino per distinguere i commenti dai post e dai ruoli
export function isCommento(item: Post | Utente | Role | Commento): item is Commento {
    return (item as Commento).postId !== undefined && (item as Commento).body !== undefined;
}
