// componente per generare la barra di navigazione della dashboard
// definisco le voci del menu e uso il componente Tabs per mostrarle

import { Tabs } from "../commons/tabs.js";

export const Navbar = {
    render(activeTab: string): string {
        const tabs = [
            { id: "posts", label: "Post" },
            { id: "comments", label: "Commenti" },
            { id: "users", label: "Utenti" },
            { id: "roles", label: "Ruoli" },
            { id: "trash", label: "♻️" }
        ];
        return Tabs.render(activeTab, tabs);
    }
};
