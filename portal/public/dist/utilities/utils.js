// Funzione generica per le chiamate API
export async function api(url) {
    const res = await fetch(url);
    if (!res.ok) {
        throw new Error("Errore nella richiesta");
    }
    return res.json();
}
/** Evidenzia testo */
export function evidenziaTesto(testo, query) {
    if (!testo)
        return "";
    if (!query || !query.trim())
        return testo;
    const queryProtetta = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const parole = queryProtetta.trim().split(/\s+/).filter((p) => p.length > 0);
    let testoRisultante = testo;
    parole.forEach((parola) => {
        const regex = new RegExp(`(${parola})`, "gi");
        testoRisultante = testoRisultante.replace(regex, '<span class="highlight">$1</span>');
    });
    return testoRisultante;
}
/** Helper per attesa */
export function attendi(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
//# sourceMappingURL=utils.js.map