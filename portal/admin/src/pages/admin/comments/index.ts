// gestisco la pagina dei commenti nella dashboard admin
// permette di moderare quello che scrivono gli utenti sotto i post

import { CommentsService } from "../../../services/api/comments.service.js";
import { Header } from "../../../components/header.js";
import { Modal } from "../../../commons/modal.js";
import { Form } from "../../../commons/form.js";
import { Pagination } from "../../../../../shared/components/pagination.js";
import { Table } from "../../../../../shared/components/table.js";
import { Toast } from "../../../../../shared/utils/helpers.js";
import { Commento } from "../../../../../shared/types/models.js";
import { AdminState } from "../../../types/state.js";

// gestisco la logica della pagina dei commenti
// carico i dati e preparo la tabella per la visualizzazione

export const CommentsPage = {
    async render(container: HTMLElement, state: AdminState): Promise<void> {
        // recupero tutti i commenti dal server
        const allComments: Commento[] = await CommentsService.getAll();
        
        // prendo solo i commenti attivi (quelli non nel cestino)
        let comments: Commento[] = allComments.filter((c: Commento) => c.isActive !== false);

        // se c'è una ricerca attiva filtro i risultati
        if (state.ricerca.length >= 3) {
            const q: string = state.ricerca.toLowerCase();
            comments = comments.filter((c: Commento) => 
                c.email.toLowerCase().includes(q) || 
                c.body.toLowerCase().includes(q)
            );
        }

        // calcolo il numero di pagine necessario
        const totalPages: number = Math.max(1, Math.ceil(comments.length / state.limite));
        if (state.paginaCorrente > totalPages) state.paginaCorrente = totalPages;

        // estraggo i commenti da mostrare nella pagina attuale
        const start: number = (state.paginaCorrente - 1) * state.limite;
        const currentComments: Commento[] = comments.slice(start, start + state.limite);

        // creo l'header con il titolo
        let html: string = Header.render("Gestione COMMENTI", true, state.ricerca);

        // definisco le intestazioni della tabella
        const headers: string[] = ["ID", "Email", "Corpo"];
        
        // preparo le righe con i dati dei commenti
        const rows: (string | number)[][] = currentComments.map((c: Commento) => [
            c.id,
            Table.highlight(c.email, state.ricerca),
            Table.highlight(c.body.substring(0, 30) + "...", state.ricerca)
        ]);

        // aggiungo la tabella al markup della pagina
        html += Table.render(headers, rows, (index: number) => {
            const comment: Commento = currentComments[index];
            return `
                <button class="btn-azione btn-read leggi-btn" data-id="${comment.id}" title="Leggi commento">👁️</button>
                <button class="btn-azione btn-edit modifica-btn" data-id="${comment.id}" title="Modifica commento">✏️</button>
                <button class="btn-azione btn-delete cestino-btn" data-id="${comment.id}" title="Sposta nel cestino">🗑️</button>
            `;
        });

        // aggiungo la barra di navigazione tra le pagine
        html += Pagination.render(state.paginaCorrente, totalPages);

        // inietto il tutto nel contenitore e attivo gli eventi
        container.innerHTML = html;
        this.bindEvents(container, currentComments);
    },

    // collego le azioni ai bottoni presenti nella tabella
    bindEvents(container: HTMLElement, comments: Commento[]): void {
        
        // azione per visualizzare il contenuto completo
        container.querySelectorAll(".leggi-btn").forEach((btn: Element): void => {
            btn.addEventListener("click", (): void => { this.openRead(btn.getAttribute("data-id")!); });
        });

        // azione per aprire il form di modifica
        container.querySelectorAll(".modifica-btn").forEach((btn: Element): void => {
            btn.addEventListener("click", (): void => { this.openEdit(btn.getAttribute("data-id")!); });
        });

        // azione per spostare l'elemento nel cestino
        container.querySelectorAll(".cestino-btn").forEach((btn: Element): void => {
            btn.addEventListener("click", async (): Promise<void> => {
                const id: string = btn.getAttribute("data-id")!;
                await CommentsService.setStatus(id, false);
                window.dispatchEvent(new CustomEvent("refresh-data"));
            });
        });
    },

    // mostro il testo completo del commento in un modal
    async openRead(id: string): Promise<void> {
        const comment: Commento = await CommentsService.getById(id);
        const html: string = `
            <div class="modal-content modal-read">
                <h2>📖 Commento da ${comment.email}</h2>
                <div style="background:white; color:#111; padding:20px; border-radius:10px;">
                    <p style="line-height:1.6;">${comment.body}</p>
                </div>
                <div class="modal-actions">
                    <button id="closeModal" class="modal-btn btn-cancel">Chiudi</button>
                </div>
            </div>
        `;
        Modal.open("modalLettura", html);
        document.getElementById("closeModal")?.addEventListener("click", (): void => Modal.close());
    },

    // gestisco l'apertura e il salvataggio della modifica
    async openEdit(id: string): Promise<void> {
        const comment: Commento = await CommentsService.getById(id);
        const html: string = `
            <div class="modal-content">
                <h3>Modifica COMMENTO <span style="color:#666; font-size:0.9rem;">#${id}</span></h3>
                ${Form.renderInput("Email", "editEmail", "email", comment.email)}
                ${Form.renderTextarea("Contenuto", "editBody", comment.body, 5)}
                <div class="modal-actions">
                    <button id="cancelEdit" class="modal-btn btn-cancel">Annulla</button>
                    <button id="saveEdit" class="modal-btn btn-save">Salva</button>
                </div>
            </div>
        `;
        Modal.open("modalModifica", html);
        
        document.getElementById("cancelEdit")?.addEventListener("click", (): void => Modal.close());
        
        // salvo i dati modificati chiamando il servizio api
        document.getElementById("saveEdit")?.addEventListener("click", async (): Promise<void> => {
            const data: Record<string, string> = Form.getData(["editEmail", "editBody"]);
            await CommentsService.update(id, {
                email: data.editEmail,
                body: data.editBody
            });
            Toast.show("Commento aggiornato!");
            Modal.close();
            window.dispatchEvent(new CustomEvent("refresh-data"));
        });
    },

    // mostro il form per inserire un nuovo commento
    openCreate(): void {
        const html: string = `
            <div class="modal-content">
                <h3>Crea COMMENTO</h3>
                ${Form.renderInput("ID Post", "createPostId", "number", "1")}
                ${Form.renderInput("Oggetto (Name)", "createName", "text", "", "Oggetto...")}
                ${Form.renderInput("Email", "createEmail", "email", "", "Email...")}
                ${Form.renderTextarea("Contenuto", "createBody", "", 5, "Scrivi il commento...")}
                <div class="modal-actions">
                    <button id="cancelCreate" class="modal-btn btn-cancel">Annulla</button>
                    <button id="saveCreate" class="modal-btn btn-save">Crea</button>
                </div>
            </div>
        `;
        Modal.open("modalCrea", html);
        
        document.getElementById("cancelCreate")?.addEventListener("click", (): void => Modal.close());
        
        // invio i dati per creare il nuovo record
        document.getElementById("saveCreate")?.addEventListener("click", async (): Promise<void> => {
            const data: Record<string, string> = Form.getData(["createPostId", "createName", "createEmail", "createBody"]);
            
            // controllo rapido sulla compilazione dei campi
            if (!data.createEmail || !data.createBody || !data.createName) return alert("Compila tutti i campi");
            
            await CommentsService.create({
                postId: Number(data.createPostId),
                name: data.createName,
                email: data.createEmail,
                body: data.createBody,
                isActive: true
            });
            Toast.show("Commento creato con successo!");
            Modal.close();
            window.dispatchEvent(new CustomEvent("refresh-data"));
        });
    }
};
