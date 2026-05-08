// utilità generali condivise tra la parte pubblica e quella admin
// gestisco l'evidenziazione del testo e le attese temporizzate

// evidenzio le parole cercate aggiungendo uno span con classe highlight
export function evidenziaTesto(testo: string, query: string): string {
    if (!testo) return "";
    if (!query || !query.trim()) return testo;

    const queryProtetta: string = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const parole: string[] = queryProtetta.trim().split(/\s+/).filter((p: string) => p.length > 0);
    let testoRisultante: string = testo;

    parole.forEach((parola: string): void => {
        const regex: RegExp = new RegExp(`(${parola})`, "gi");
        testoRisultante = testoRisultante.replace(regex, '<span class="highlight">$1</span>');
    });

    return testoRisultante;
}

// creo una pausa nell'esecuzione del codice (es. per simulare caricamenti)
export function attendi(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}
