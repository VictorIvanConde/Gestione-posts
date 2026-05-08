// funzioni di aiuto generiche usate in tutto il portale
// serve per gestire le notifiche, l'evidenziazione e le attese

// evidenzio il testo che corrisponde alla ricerca aggiungendo uno span
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

// creo una pausa nell'esecuzione del codice
export function attendi(ms: number): Promise<void> {
    return new Promise((resolve: (value: void | PromiseLike<void>) => void) => setTimeout(resolve, ms));
}

// gestisco la comparsa dei messaggi toast in alto a destra
export const Toast = {
    show(message: string, type: "success" | "error" = "success"): void {
        let container: Element | null = document.querySelector(".toast-container");
        if (!container) {
            container = document.createElement("div");
            container.className = "toast-container";
            document.body.appendChild(container);
        }

        const toast: HTMLDivElement = document.createElement("div");
        toast.className = `toast ${type === "error" ? "error" : ""}`;
        toast.innerHTML = `
            <span>${type === "success" ? "✅" : "❌"}</span>
            <span>${message}</span>
        `;

        container.appendChild(toast);

        // il messaggio scompare da solo dopo 3 secondi
        setTimeout((): void => {
            toast.remove();
            if (container?.childNodes.length === 0) {
                container.remove();
            }
        }, 3000);
    }
};
