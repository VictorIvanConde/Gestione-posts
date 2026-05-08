// componente per gestire la navigazione tra le pagine della tabella
// mostro i bottoni avanti/indietro e il numero di pagina attuale

export const Pagination = {
    render(currentPage: number, totalPages: number): string {
        // controllo se sono all'inizio o alla fine per disattivare i tasti
        const isFirstPage: boolean = currentPage === 1;
        const isLastPage: boolean = currentPage >= (totalPages || 1);

        return `
            <div class="paginazione" style="${totalPages <= 1 ? 'display:none' : 'display:flex; align-items:center; gap:10px; margin-top:20px;'}">
                <button 
                    ${isFirstPage ? 'disabled style="opacity:0.5; cursor:not-allowed;"' : ''} 
                    id="prevBtn">
                    Indietro
                </button>

                <span style="font-weight:bold;">Pagina ${currentPage} di ${totalPages || 1}</span>

                <button 
                    ${isLastPage ? 'disabled style="opacity:0.5; cursor:not-allowed;"' : ''} 
                    id="nextBtn">
                    Avanti
                </button>
            </div>
        `;
    }
};
