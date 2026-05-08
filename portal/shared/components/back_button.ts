// componente per mostrare il tasto home e tornare alla scelta del profilo
export const BackButton = {
    render(): string {
        return `
            <a href="../../index.html" class="btn-back-home" title="Torna alla scelta profilo">
                <span class="icon-home">🏠</span>
            </a>
        `;
    }
};
