// utilità per gestire la logica di filtraggio e ricerca dati
// serve per pulire il codice delle pagine da calcoli ripetitivi
export const Logic = {
    // filtro i post in base al testo cercato dall'utente
    // la ricerca parte solo dopo i 3 caratteri inseriti
    filtraPost(posts, query) {
        const q = query.trim().toLowerCase();
        if (q.length < 3)
            return posts;
        const parole = q.split(/\s+/).filter((p) => p.length > 0);
        return posts.filter((p) => {
            const title = p.title.toLowerCase();
            const body = p.body.toLowerCase();
            // il post deve contenere tutte le parole cercate
            return parole.every((parola) => title.includes(parola) || body.includes(parola));
        });
    },
    // recupero il nome di un elemento (utente, ruolo, ecc) partendo dall'id
    // se non trovo nulla restituisco un valore di default (N/D)
    trovaNomeInLista(lista, id, fallback = "N/D") {
        const trovato = lista.find((item) => String(item.id) === String(id));
        return trovato ? (trovato.name || trovato.title || fallback) : fallback;
    }
};
