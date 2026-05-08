export const Pagination = {
    render(currentPage, totalPages) {
        return `
            <div class="paginazione" style="${totalPages === 0 ? 'display:none' : 'display:flex; align-items:center; gap:10px; margin-top:20px;'}">
                <button 
                    ${currentPage === 1 ? 'disabled style="opacity:0.5; cursor:not-allowed;"' : ''} 
                    id="prevPage">
                    Indietro
                </button>

                <span style="font-weight:bold;">Pagina ${currentPage} di ${totalPages || 1}</span>

                <button 
                    ${currentPage >= totalPages ? 'disabled style="opacity:0.5; cursor:not-allowed;"' : ''} 
                    id="nextPage">
                    Avanti
                </button>
            </div>
        `;
    }
};
//# sourceMappingURL=pagination.js.map