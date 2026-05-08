// gestisco la pagina dei post nella dashboard admin
// permette di visualizzare la lista, creare nuovi post e gestire quelli esistenti

import { PostsService } from "../../../services/api/posts.service.js";
import { Post } from "../../../../../shared/types/models.js";
import { Table } from "../../../../../shared/components/table.js";
import { Header } from "../../../components/header.js";
import { Modal } from "../../../commons/modal.js";
import { Form } from "../../../commons/form.js";
import { Pagination } from "../../../../../shared/components/pagination.js";
import { Logic } from "../../../../../shared/utils/logic.js";
import { Toast } from "../../../../../shared/utils/helpers.js";
import { AdminState } from "../../../types/state.js";

// logica per la gestione della pagina dei post
// recupero i dati dal server e genero la tabella

export const PostsPage = {
    async render(container: HTMLElement, state: AdminState): Promise<void> {
        
        // recupero tutti i post disponibili
        const allPosts: Post[] = await PostsService.getAll();
        
        // filtro i post che non sono nel cestino
        let posts: Post[] = allPosts.filter((p: Post) => p.isActive !== false);

        // applico il filtro di ricerca se presente
        posts = Logic.filtraPost(posts, state.ricerca);

        // calcolo il numero totale di pagine per la paginazione
        const totalPages: number = Math.max(1, Math.ceil(posts.length / state.limite));
        if (state.paginaCorrente > totalPages) state.paginaCorrente = totalPages;

        // estraggo solo i post della pagina attuale
        const start: number = (state.paginaCorrente - 1) * state.limite;
        const currentPosts: Post[] = posts.slice(start, start + state.limite);

        // genero l'header della pagina
        let html: string = Header.render("Gestione POST", true, state.ricerca);

        // definisco le colonne della tabella
        const headers: string[] = ["ID", "Titolo", "User ID"];
        
        // preparo le righe con i dati dei post
        const rows: (string | number)[][] = currentPosts.map((p: Post) => [
            p.id,
            Table.highlight(p.title, state.ricerca),
            Table.highlight(p.userId, state.ricerca)
        ]);

        // aggiungo la tabella al markup
        html += Table.render(headers, rows, (index: number) => {
            const post: Post = currentPosts[index];
            return `
                <button class="btn-azione btn-read leggi-btn" data-id="${post.id}" title="Leggi post">👁️</button>
                <button class="btn-azione btn-edit modifica-btn" data-id="${post.id}" title="Modifica post">✏️</button>
                <button class="btn-azione btn-delete cestino-btn" data-id="${post.id}" title="Sposta nel cestino">🗑️</button>
            `;
        });

        // aggiungo i controlli di paginazione
        html += Pagination.render(state.paginaCorrente, totalPages);

        // inserisco tutto nel contenitore e collego gli eventi
        container.innerHTML = html;
        this.bindEvents(container, currentPosts);
    },

    // collego i click dei bottoni alle relative funzioni
    bindEvents(container: HTMLElement, posts: Post[]): void {
        
        // bottone per leggere il dettaglio
        container.querySelectorAll(".leggi-btn").forEach((btn: Element): void => {
            btn.addEventListener("click", (): void => { this.openRead(btn.getAttribute("data-id")!); });
        });

        // bottone per aprire la modifica
        container.querySelectorAll(".modifica-btn").forEach((btn: Element): void => {
            btn.addEventListener("click", (): void => { this.openEdit(btn.getAttribute("data-id")!); });
        });

        // bottone per spostare nel cestino
        container.querySelectorAll(".cestino-btn").forEach((btn: Element): void => {
            btn.addEventListener("click", async (): Promise<void> => {
                const id: string = btn.getAttribute("data-id")!;
                await PostsService.setStatus(id, false);
                window.dispatchEvent(new CustomEvent("refresh-data"));
            });
        });
    },

    // mostro il dettaglio del post in un modal
    async openRead(id: string): Promise<void> {
        const post: Post = await PostsService.getById(id);
        const html: string = `
            <div class="modal-content modal-read">
                <h2>📖 ${post.title}</h2>
                <div style="background:white; color:#111; padding:20px; border-radius:10px; max-height:60vh; overflow:auto;">
                    <h3>${post.title}</h3>
                    <p style="margin-top:15px; line-height:1.6;">${post.body}</p>
                    <small style="color:#666;">User ID: ${post.userId}</small>
                </div>
                <div class="modal-actions">
                    <button id="closeModal" class="modal-btn btn-cancel">Chiudi</button>
                </div>
            </div>
        `;
        Modal.open("modalLettura", html);
        document.getElementById("closeModal")?.addEventListener("click", (): void => Modal.close());
    },

    // apro il form di modifica con i dati attuali
    async openEdit(id: string): Promise<void> {
        const post: Post = await PostsService.getById(id);
        const html: string = `
            <div class="modal-content">
                <h3>Modifica POST <span style="color:#666; font-size:0.9rem;">#${id}</span></h3>
                ${Form.renderInput("Titolo", "editTitle", "text", post.title)}
                ${Form.renderTextarea("Contenuto", "editBody", post.body, 6)}
                ${Form.renderInput("User ID", "editUserId", "number", String(post.userId))}
                <div class="modal-actions">
                    <button id="cancelEdit" class="modal-btn btn-cancel">Annulla</button>
                    <button id="saveEdit" class="modal-btn btn-save">Salva</button>
                </div>
            </div>
        `;
        Modal.open("modalModifica", html);
        
        document.getElementById("cancelEdit")?.addEventListener("click", (): void => Modal.close());
        
        // salvo le modifiche sul server
        document.getElementById("saveEdit")?.addEventListener("click", async (): Promise<void> => {
            const data: Record<string, string> = Form.getData(["editTitle", "editBody", "editUserId"]);
            await PostsService.update(id, {
                title: data.editTitle,
                body: data.editBody,
                userId: Number(data.editUserId)
            });
            Toast.show("Post aggiornato correttamente!");
            Modal.close();
            window.dispatchEvent(new CustomEvent("refresh-data"));
        });
    },

    // apro il form per creare un nuovo post
    openCreate(): void {
        const html: string = `
            <div class="modal-content">
                <h3>Crea POST</h3>
                ${Form.renderInput("ID Post (opzionale)", "createId", "text", "", "ID manuale...")}
                ${Form.renderInput("Titolo", "createTitle", "text", "", "Titolo...")}
                ${Form.renderTextarea("Contenuto", "createBody", "", 6, "Scrivi il post...")}
                ${Form.renderInput("User ID", "createUserId", "number", "", "ID Utente")}
                <div class="modal-actions">
                    <button id="cancelCreate" class="modal-btn btn-cancel">Annulla</button>
                    <button id="saveCreate" class="modal-btn btn-save">Crea</button>
                </div>
            </div>
        `;
        Modal.open("modalCrea", html);
        
        document.getElementById("cancelCreate")?.addEventListener("click", (): void => Modal.close());
        
        // invio i dati per la creazione
        document.getElementById("saveCreate")?.addEventListener("click", async (): Promise<void> => {
            const fieldIds: string[] = ["createId", "createTitle", "createBody", "createUserId"];
            Form.clearErrors(fieldIds);

            const data: Record<string, string> = Form.getData(fieldIds);
            
            // verifico che i campi obbligatori siano compilati
            if (!data.createTitle) return Form.showError("createTitle", "Il titolo è obbligatorio");
            if (!data.createBody) return Form.showError("createBody", "Il contenuto è obbligatorio");
            if (!data.createUserId) return Form.showError("createUserId", "L'ID utente è obbligatorio");
            
            // controllo se l'id esiste già nel sistema
            if (data.createId) {
                try {
                    const existing: Post = await PostsService.getById(data.createId);
                    if (existing) {
                        const msg: string = existing.isActive === false 
                            ? `L'ID "${data.createId}" è nel cestino. Eliminalo da lì per riutilizzarlo.`
                            : `L'ID "${data.createId}" esiste già.`;
                        return Form.showError("createId", msg);
                    }
                } catch (e: unknown) {}
            }

            const payload: Partial<Post> = {
                title: data.createTitle,
                body: data.createBody,
                userId: Number(data.createUserId),
                isActive: true
            };
            if (data.createId) payload.id = data.createId;

            await PostsService.create(payload as Post);
            Toast.show("Post creato con successo!");
            Modal.close();
            window.dispatchEvent(new CustomEvent("refresh-data"));
        });
    }
};
