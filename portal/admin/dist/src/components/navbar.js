import { Tabs } from "../commons/tabs.js";
export const Navbar = {
    render(activeTab) {
        const tabs = [
            { id: "posts", label: "Post" },
            { id: "comments", label: "Commenti" },
            { id: "users", label: "Utenti" },
            { id: "roles", label: "Ruoli" },
            { id: "trash-posts", label: "♻️" }
        ];
        return Tabs.render(activeTab, tabs);
    }
};
//# sourceMappingURL=navbar.js.map