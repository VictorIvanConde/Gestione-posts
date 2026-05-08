// gestisco il cestino nella dashboard admin
// qui posso recuperare o eliminare per sempre post, utenti e commenti

import { PostsService } from "../../../services/api/posts.service.js";
import { UsersService } from "../../../services/api/users.service.js";
import { CommentsService } from "../../../services/api/comments.service.js";
import { Post, Utente, Role, Commento } from "../../../../../shared/types/models.js";
import { Table } from "../../../../../shared/components/table.js";
import { Header } from "../../../components/header.js";
import { Modal } from "../../../commons/modal.js";
import { Pagination } from "../../../../../shared/components/pagination.js";
import { Logic } from "../../../../../shared/utils/logic.js";
import { Tabs } from "../../../commons/tabs.js";
import { AdminState } from "../../../types/state.js";

function isUtente(item: Post | Utente | Role | Commento): item is Utente {
    return (item as Utente).email !== undefined && (item as Utente).roleId !== undefined;
}

function isCommento(item: Post | Utente | Role | Commento): item is Commento {
    return (item as Commento).postId !== undefined && (item as Commento).body !== undefined;
}

type TrashItem = Post | Utente | Role | Commento;

// gestisco il cestino del portale
// posso ripristinare gli elementi o eliminarli per sempre

export const TrashPage = {
    subSezioneAttiva: "trash-posts",

    async render(container: HTMLElement, state: AdminState): Promise<void> {
        
        // definisco le schede per navigare nel cestino
        const tabs: { id: string, label: string }[] = [
            { id: "trash-posts", label: "Post" },
            { id: "trash-users", label: "Utenti" },
            { id: "trash-comments", label: "Commenti" }
        ];

        let items: TrashItem[] = [];
        let headers: string[] = [];
        let title: string = "Cestino";

        // carico i dati in base alla scheda selezionata
        if (this.subSezioneAttiva === "trash-posts") {
            const all: Post[] = await PostsService.getAll();
            items = all.filter((p: Post) => p.isActive === false);
            headers = ["ID", "Titolo"];
            title = "Cestino POST";
        } else if (this.subSezioneAttiva === "trash-users") {
            const all: Utente[] = await UsersService.getAll();
            items = all.filter((u: Utente) => u.isActive === false);
            headers = ["ID", "Nome", "Email"];
            title = "Cestino UTENTI";
        } else if (this.subSezioneAttiva === "trash-roles") {
            const all: Role[] = await UsersService.getRoles();
            items = all.filter((r: Role) => r.isActive === false);
            headers = ["ID", "Nome Ruolo"];
            title = "Cestino RUOLI";
        } else if (this.subSezioneAttiva === "trash-comments") {
            const all: Commento[] = await CommentsService.getAll();
            items = all.filter((c: Commento) => c.isActive === false);
            headers = ["ID", "Nome", "Body"];
            title = "Cestino COMMENTI";
        }

        // applico il filtro di ricerca se l'utente sta scrivendo
        if (state.ricerca.length >= 3) {
            const q: string = state.ricerca.toLowerCase();
            items = items.filter((item: TrashItem) => {
                const title: string = ("title" in item) ? (item as Post).title : "";
                const name: string = ("name" in item) ? (item as Utente | Role | Commento).name : "";
                const body: string = ("body" in item) ? (item as Post | Commento).body : "";
                const email: string = ("email" in item) ? (item as Utente | Commento).email : "";

                return (
                    title.toLowerCase().includes(q) ||
                    name.toLowerCase().includes(q) ||
                    body.toLowerCase().includes(q) ||
                    email.toLowerCase().includes(q)
                );
            });
        }

        // calcolo la paginazione del cestino
        const totalPages: number = Math.max(1, Math.ceil(items.length / state.limite));
        if (state.paginaCorrente > totalPages) state.paginaCorrente = totalPages;

        // prendo gli elementi da visualizzare subito
        const start: number = (state.paginaCorrente - 1) * state.limite;
        const currentItems: TrashItem[] = items.slice(start, start + state.limite);

        // genero l'header e le tabs di navigazione
        let html: string = Header.render(title, false, state.ricerca);
        html += Tabs.render(this.subSezioneAttiva, tabs);

        // costruisco le righe della tabella in base al tipo di dato
        const rows: (string | number)[][] = currentItems.map((item: TrashItem) => {
            if (this.subSezioneAttiva === "trash-posts") {
                return [item.id, Table.highlight((item as Post).title, state.ricerca)];
            } else if (isUtente(item)) {
                return [item.id, Table.highlight(item.name, state.ricerca), Table.highlight(item.email, state.ricerca)];
            } else if (isCommento(item)) {
                return [item.id, Table.highlight(item.name, state.ricerca), Table.highlight(item.body.slice(0, 50), state.ricerca)];
            } else {
                return [item.id, Table.highlight((item as Role).name || "", state.ricerca)];
            }
        });

        // aggiungo la tabella con i bottoni ripristina ed elimina
        html += Table.render(headers, rows, (index: number) => {
            const item: TrashItem = currentItems[index];
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
    bindEvents(container: HTMLElement, items: TrashItem[]): void {
        
        // cambio scheda del cestino
        container.querySelectorAll(".menu-btn").forEach((btn: Element): void => {
            btn.addEventListener("click", (): void => {
                this.subSezioneAttiva = btn.getAttribute("data-sezione")!;
                window.dispatchEvent(new CustomEvent("refresh-data"));
            });
        });

        // riporto l'elemento tra quelli attivi
        container.querySelectorAll(".ripristina-btn").forEach((btn: Element): void => {
            btn.addEventListener("click", async (): Promise<void> => {
                const id: string = btn.getAttribute("data-id")!;
                if (this.subSezioneAttiva === "trash-posts") await PostsService.setStatus(id, true);
                else if (this.subSezioneAttiva === "trash-users") await UsersService.setStatus(id, true);
                else if (this.subSezioneAttiva === "trash-comments") await CommentsService.setStatus(id, true);
                
                window.dispatchEvent(new CustomEvent("refresh-data"));
            });
        });

        // cancello l'elemento per sempre dal database
        container.querySelectorAll(".elimina-def-btn").forEach((btn: Element): void => {
            btn.addEventListener("click", async (): Promise<void> => {
                const id: string = btn.getAttribute("data-id")!;
                const confirmed: boolean = await Modal.confirm("Sei sicuro di voler eliminare definitivamente questo elemento?");
                if (confirmed) {
                    if (this.subSezioneAttiva === "trash-posts") await PostsService.delete(id);
                    else if (this.subSezioneAttiva === "trash-users") await UsersService.delete(id);
                    else if (this.subSezioneAttiva === "trash-comments") await CommentsService.delete(id);
                    window.dispatchEvent(new CustomEvent("refresh-data"));
                }
            });
        });
    }
};
