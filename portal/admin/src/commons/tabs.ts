// componente per creare dei menu a schede (tabs)
// riceve la lista dei bottoni e evidenzia quello selezionato

export const Tabs = {
    render(activeTab: string, tabs: { id: string, label: string }[]): string {
        return `
            <nav class="menu">
                ${tabs.map((tab: { id: string, label: string }): string => `
                    <button class="menu-btn ${activeTab === tab.id ? 'attivo' : ''}" data-sezione="${tab.id}">
                        ${tab.label}
                    </button>
                `).join("")}
            </nav>
        `;
    }
};
