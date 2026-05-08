import { CommentsService } from "../../../services/api/comments.service.js";
import { Table } from "../../../commons/table.js";
import { Header } from "../../../components/header.js";
import { Modal } from "../../../commons/modal.js";
import { Form } from "../../../commons/form.js";
import { Pagination } from "../../../commons/pagination.js";
export const CommentsPage = {
    async render(container, state) {
        const allComments = await CommentsService.getAll();
        const isTrash = state.sezioneAttiva.startsWith("trash-");
        let comments = allComments.filter(c => isTrash ? c.isActive === false : c.isActive !== false);
        if (state.ricerca.length >= 3) {
            const q = state.ricerca.toLowerCase();
            comments = comments.filter(c => c.email.toLowerCase().includes(q) ||
                c.body.toLowerCase().includes(q));
        }
        const totalPages = Math.max(1, Math.ceil(comments.length / state.limite));
        if (state.paginaCorrente > totalPages)
            state.paginaCorrente = totalPages;
        const start = (state.paginaCorrente - 1) * state.limite;
        const currentComments = comments.slice(start, start + state.limite);
        let html = Header.render(isTrash ? "Cestino COMMENTI" : "Gestione COMMENTI", !isTrash, state.ricerca);
        const headers = ["ID", "Email", "Corpo"];
        const rows = currentComments.map(c => [
            c.id,
            Table.highlight(c.email, state.ricerca),
            Table.highlight(c.body.substring(0, 30) + "...", state.ricerca)
        ]);
        html += Table.render(headers, rows, (index) => {
            const comment = currentComments[index];
            if (isTrash) {
                return `
                    <button class="ripristina-btn" data-id="${comment.id}">Ripristina</button>
                    <button class="elimina-def-btn btn-danger" data-id="${comment.id}">Elimina</button>
                `;
            }
            return `
                <button class="leggi-btn" data-id="${comment.id}">Leggi</button>
                <button class="modifica-btn" data-id="${comment.id}">Modifica</button>
                <button class="cestino-btn" data-id="${comment.id}">Cestino</button>
            `;
        });
        html += Pagination.render(state.paginaCorrente, totalPages);
        container.innerHTML = html;
        this.bindEvents(container, currentComments, isTrash);
    },
    bindEvents(container, comments, isTrash) {
        container.querySelectorAll(".leggi-btn").forEach(btn => {
            btn.addEventListener("click", () => this.openRead(btn.getAttribute("data-id")));
        });
        container.querySelectorAll(".modifica-btn").forEach(btn => {
            btn.addEventListener("click", () => this.openEdit(btn.getAttribute("data-id")));
        });
        container.querySelectorAll(".cestino-btn").forEach(btn => {
            btn.addEventListener("click", async () => {
                const id = btn.getAttribute("data-id");
                await CommentsService.setStatus(id, false);
                window.dispatchEvent(new CustomEvent("refresh-data"));
            });
        });
        container.querySelectorAll(".ripristina-btn").forEach(btn => {
            btn.addEventListener("click", async () => {
                const id = btn.getAttribute("data-id");
                await CommentsService.setStatus(id, true);
                window.dispatchEvent(new CustomEvent("refresh-data"));
            });
        });
        container.querySelectorAll(".elimina-def-btn").forEach(btn => {
            btn.addEventListener("click", async () => {
                const id = btn.getAttribute("data-id");
                const confirmed = await Modal.confirm("Sei sicuro di voler eliminare definitivamente questo commento?");
                if (confirmed) {
                    await CommentsService.delete(id);
                    window.dispatchEvent(new CustomEvent("refresh-data"));
                }
            });
        });
    },
    async openRead(id) {
        const comment = await CommentsService.getById(id);
        const html = `
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
        document.getElementById("closeModal")?.addEventListener("click", () => Modal.close());
    },
    async openEdit(id) {
        const comment = await CommentsService.getById(id);
        const html = `
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
        document.getElementById("cancelEdit")?.addEventListener("click", () => Modal.close());
        document.getElementById("saveEdit")?.addEventListener("click", async () => {
            const data = Form.getData(["editEmail", "editBody"]);
            await CommentsService.update(id, {
                email: data.editEmail,
                body: data.editBody
            });
            Modal.close();
            window.dispatchEvent(new CustomEvent("refresh-data"));
        });
    },
    openCreate() {
        const html = `
            <div class="modal-content">
                <h3>Crea COMMENTO</h3>
                ${Form.renderInput("Email", "createEmail", "email", "", "Email...")}
                ${Form.renderTextarea("Contenuto", "createBody", "", 5, "Scrivi il commento...")}
                <div class="modal-actions">
                    <button id="cancelCreate" class="modal-btn btn-cancel">Annulla</button>
                    <button id="saveCreate" class="modal-btn btn-save">Crea</button>
                </div>
            </div>
        `;
        Modal.open("modalCrea", html);
        document.getElementById("cancelCreate")?.addEventListener("click", () => Modal.close());
        document.getElementById("saveCreate")?.addEventListener("click", async () => {
            const data = Form.getData(["createEmail", "createBody"]);
            if (!data.createEmail || !data.createBody)
                return alert("Compila tutti i campi");
            await CommentsService.create({
                email: data.createEmail,
                body: data.createBody,
                isActive: true
            });
            Modal.close();
            window.dispatchEvent(new CustomEvent("refresh-data"));
        });
    }
};
//# sourceMappingURL=index.js.map