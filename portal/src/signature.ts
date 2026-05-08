// componente firma d'autore esclusivo della home del portale
// mostra l'immagine manga e le iniziali V.I.C. in basso a destra

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
