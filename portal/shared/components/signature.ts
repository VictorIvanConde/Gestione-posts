// componente per mostrare la firma d'autore in basso a destra
// include l'immagine manga e le iniziali V.I.C.

export const Signature = {
    render(): string {
        return `
            <div class="signature-container">
                <span class="signature-text">V.I.C.</span>
                <img src="immagini/manga_vic.png" alt="Manga V.I.C." class="signature-image">
            </div>
        `;
    }
};
