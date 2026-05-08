// utilità generali condivise tra la parte pubblica e quella admin
// gestisco l'evidenziazione del testo e le attese temporizzate
// evidenzio le parole cercate aggiungendo uno span con classe highlight
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
// creo una pausa nell'esecuzione del codice (es. per simulare caricamenti)
export function attendi(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
