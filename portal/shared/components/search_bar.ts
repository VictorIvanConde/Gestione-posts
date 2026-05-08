// componente per mostrare la barra di ricerca in stile google
// viene usato sia nella dashboard che nel portale pubblico

export const SearchBar = {
    render(placeholder: string = "Cerca...", value: string = ""): string {
        return `
            <div class="campo-ricerca-condiviso">
                <div class="barra-stile-google">
                    <span class="icona-ricerca-condivisa">🔍</span>
                    <input type="text" id="barraRicerca" placeholder="${placeholder}" value="${value}">
                    <button id="cercaBtn" type="button">Cerca</button>
                </div>
            </div>
        `;
    }
};
