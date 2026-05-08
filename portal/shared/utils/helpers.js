// funzioni di aiuto generiche usate in tutto il portale
// serve per gestire le notifiche, l'evidenziazione e le attese
// evidenzio il testo che corrisponde alla ricerca aggiungendo uno span
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
// creo una pausa nell'esecuzione del codice
export function attendi(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
// gestisco la comparsa dei messaggi toast in alto a destra
export const Toast = {
    show(message, type = "success") {
        let container = document.querySelector(".toast-container");
        if (!container) {
            container = document.createElement("div");
            container.className = "toast-container";
            document.body.appendChild(container);
        }
        const toast = document.createElement("div");
        toast.className = `toast ${type === "error" ? "error" : ""}`;
        toast.innerHTML = `
            <span>${type === "success" ? "✅" : "❌"}</span>
            <span>${message}</span>
        `;
        container.appendChild(toast);
        // il messaggio scompare da solo dopo 3 secondi
        setTimeout(() => {
            toast.remove();
            if (container?.childNodes.length === 0) {
                container.remove();
            }
        }, 3000);
    }
};
