export const Header = {
    render(title, showSearch = true, searchQuery = "") {
        return `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px;">
                <h2>${title}</h2>
                ${showSearch ? `
                    <div style="display:flex; gap:10px; align-items:center;">
                        <input 
                            type="text" 
                            id="inputRicerca" 
                            placeholder="Cerca..." 
                            value="${searchQuery}"
                            style="padding:8px; background:#222; border:1px solid #444; color:white;"
                        >
                        <button id="btnSearch" class="modal-btn btn-save" title="Avvia ricerca">🔍</button>
                        <button id="btnCreate" class="modal-btn btn-save" title="Crea nuovo elemento">➕</button>
                    </div>
                ` : ""}
            </div>
        `;
    }
};
//# sourceMappingURL=header.js.map