// gestisco il cestino nella dashboard admin
// qui posso recuperare o eliminare per sempre post, utenti e commenti
import { PostsService } from "../../../services/api/posts.service.js";
import { UsersService } from "../../../services/api/users.service.js";
import { CommentsService } from "../../../services/api/comments.service.js";
import { Table } from "../../../../../shared/components/table.js";
import { Header } from "../../../components/header.js";
import { Modal } from "../../../commons/modal.js";
import { Pagination } from "../../../../../shared/components/pagination.js";
import { Tabs } from "../../../commons/tabs.js";
function isUtente(item) {
    return item.email !== undefined && item.roleId !== undefined;
}
function isCommento(item) {
    return item.postId !== undefined && item.body !== undefined;
}
// gestisco il cestino del portale
// posso ripristinare gli elementi o eliminarli per sempre
export const TrashPage = {
    subSezioneAttiva: "trash-posts",
    async render(container, state) {
        // definisco le schede per navigare nel cestino
        const tabs = [
            { id: "trash-posts", label: "Post" },
            { id: "trash-users", label: "Utenti" },
            { id: "trash-comments", label: "Commenti" }
        ];
        let items = [];
        let headers = [];
        let title = "Cestino";
        // carico i dati in base alla scheda selezionata
        if (this.subSezioneAttiva === "trash-posts") {
            const all = await PostsService.getAll();
            items = all.filter((p) => p.isActive === false);
            headers = ["ID", "Titolo"];
            title = "Cestino POST";
        }
        else if (this.subSezioneAttiva === "trash-users") {
            const all = await UsersService.getAll();
            items = all.filter((u) => u.isActive === false);
            headers = ["ID", "Nome", "Email"];
            title = "Cestino UTENTI";
        }
        else if (this.subSezioneAttiva === "trash-roles") {
            const all = await UsersService.getRoles();
            items = all.filter((r) => r.isActive === false);
            headers = ["ID", "Nome Ruolo"];
            title = "Cestino RUOLI";
        }
        else if (this.subSezioneAttiva === "trash-comments") {
            const all = await CommentsService.getAll();
            items = all.filter((c) => c.isActive === false);
            headers = ["ID", "Nome", "Body"];
            title = "Cestino COMMENTI";
        }
        // applico il filtro di ricerca se l'utente sta scrivendo
        if (state.ricerca.length >= 3) {
            const q = state.ricerca.toLowerCase();
            items = items.filter((item) => {
                const title = ("title" in item) ? item.title : "";
                const name = ("name" in item) ? item.name : "";
                const body = ("body" in item) ? item.body : "";
                const email = ("email" in item) ? item.email : "";
                return (title.toLowerCase().includes(q) ||
                    name.toLowerCase().includes(q) ||
                    body.toLowerCase().includes(q) ||
                    email.toLowerCase().includes(q));
            });
        }
        // calcolo la paginazione del cestino
        const totalPages = Math.max(1, Math.ceil(items.length / state.limite));
        if (state.paginaCorrente > totalPages)
            state.paginaCorrente = totalPages;
        // prendo gli elementi da visualizzare subito
        const start = (state.paginaCorrente - 1) * state.limite;
        const currentItems = items.slice(start, start + state.limite);
        // genero l'header e le tabs di navigazione
        let html = Header.render(title, false, state.ricerca);
        html += Tabs.render(this.subSezioneAttiva, tabs);
        // costruisco le righe della tabella in base al tipo di dato
        const rows = currentItems.map((item) => {
            if (this.subSezioneAttiva === "trash-posts") {
                return [item.id, Table.highlight(item.title, state.ricerca)];
            }
            else if (isUtente(item)) {
                return [item.id, Table.highlight(item.name, state.ricerca), Table.highlight(item.email, state.ricerca)];
            }
            else if (isCommento(item)) {
                return [item.id, Table.highlight(item.name, state.ricerca), Table.highlight(item.body.slice(0, 50), state.ricerca)];
            }
            else {
                return [item.id, Table.highlight(item.name || "", state.ricerca)];
            }
        });
        // aggiungo la tabella con i bottoni ripristina ed elimina
        html += Table.render(headers, rows, (index) => {
            const item = currentItems[index];
            return `
                <button class="btn-azione btn-read ripristina-btn" data-id="${item.id}" title="Ripristina elemento">🔄</button>
                <button class="btn-azione btn-delete elimina-def-btn" data-id="${item.id}" title="Elimina definitivamente">❌</button>
            `;
        });
        // aggiungo i numeretti per cambiare pagina
        html += Pagination.render(state.paginaCorrente, totalPages);
        // metto tutto nel dom e attivo i click
        container.innerHTML = html;
        this.bindEvents(container, currentItems);
    },
    // gestisco i click sui bottoni del cestino
    bindEvents(container, items) {
        // cambio scheda del cestino
        container.querySelectorAll(".menu-btn").forEach((btn) => {
            btn.addEventListener("click", () => {
                this.subSezioneAttiva = btn.getAttribute("data-sezione");
                window.dispatchEvent(new CustomEvent("refresh-data"));
            });
        });
        // riporto l'elemento tra quelli attivi
        container.querySelectorAll(".ripristina-btn").forEach((btn) => {
            btn.addEventListener("click", async () => {
                const id = btn.getAttribute("data-id");
                if (this.subSezioneAttiva === "trash-posts")
                    await PostsService.setStatus(id, true);
                else if (this.subSezioneAttiva === "trash-users")
                    await UsersService.setStatus(id, true);
                else if (this.subSezioneAttiva === "trash-comments")
                    await CommentsService.setStatus(id, true);
                window.dispatchEvent(new CustomEvent("refresh-data"));
            });
        });
        // cancello l'elemento per sempre dal database
        container.querySelectorAll(".elimina-def-btn").forEach((btn) => {
            btn.addEventListener("click", async () => {
                const id = btn.getAttribute("data-id");
                const confirmed = await Modal.confirm("Sei sicuro di voler eliminare definitivamente questo elemento?");
                if (confirmed) {
                    if (this.subSezioneAttiva === "trash-posts")
                        await PostsService.delete(id);
                    else if (this.subSezioneAttiva === "trash-users")
                        await UsersService.delete(id);
                    else if (this.subSezioneAttiva === "trash-comments")
                        await CommentsService.delete(id);
                    window.dispatchEvent(new CustomEvent("refresh-data"));
                }
            });
        });
    }
};
//# sourceMappingURL=index.js.map