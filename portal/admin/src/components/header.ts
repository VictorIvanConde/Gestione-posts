// componente per generare l'header delle pagine admin
// mostro il titolo della sezione, la barra di ricerca e il tasto per creare nuovi elementi

import { SearchBar } from "../../../shared/components/search_bar.js";

export const Header = {
    render(title: string, showSearch: boolean = true, searchQuery: string = ""): string {
        return `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px;">
                <h2>${title}</h2>
                ${showSearch ? `
                    <div style="display:flex; gap:15px; align-items:center;">
                        ${SearchBar.render("Cerca...", searchQuery)}
                        <button id="btnCreate" class="modal-btn btn-save" style="border-radius:30px; width:45px; height:45px; padding:0;" title="Crea nuovo elemento">➕</button>
                    </div>
                ` : ""}
            </div>
        `;
    }
};
