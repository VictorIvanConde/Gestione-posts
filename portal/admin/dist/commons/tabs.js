// componente per creare dei menu a schede (tabs)
// riceve la lista dei bottoni e evidenzia quello selezionato
export const Tabs = {
    render(activeTab, tabs) {
        return `
            <nav class="menu">
                ${tabs.map((tab) => `
                    <button class="menu-btn ${activeTab === tab.id ? 'attivo' : ''}" data-sezione="${tab.id}">
                        ${tab.label}
                    </button>
                `).join("")}
            </nav>
        `;
    }
};
//# sourceMappingURL=tabs.js.map