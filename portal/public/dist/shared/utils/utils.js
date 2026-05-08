/** Evidenzia testo (usata sia in Admin che Public) */
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
/** Helper per attesa simulata */
export function attendi(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
//# sourceMappingURL=utils.js.map