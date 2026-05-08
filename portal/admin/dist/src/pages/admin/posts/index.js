import { PostsService } from "../../../services/api/posts.service.js";
import { Table } from "../../../commons/table.js";
import { Header } from "../../../components/header.js";
import { Modal } from "../../../commons/modal.js";
import { Form } from "../../../commons/form.js";
import { Pagination } from "../../../commons/pagination.js";
export const PostsPage = {
    async render(container, state) {
        const allPosts = await PostsService.getAll();
        const isTrash = state.sezioneAttiva.startsWith("trash-");
        let posts = allPosts.filter(p => isTrash ? p.isActive === false : p.isActive !== false);
        if (state.ricerca.length >= 3) {
            const q = state.ricerca.toLowerCase();
            posts = posts.filter(p => p.title.toLowerCase().includes(q) ||
                p.body.toLowerCase().includes(q));
        }
        const totalPages = Math.max(1, Math.ceil(posts.length / state.limite));
        if (state.paginaCorrente > totalPages)
            state.paginaCorrente = totalPages;
        const start = (state.paginaCorrente - 1) * state.limite;
        const currentPosts = posts.slice(start, start + state.limite);
        let html = Header.render(isTrash ? "Cestino POST" : "Gestione POST", !isTrash, state.ricerca);
        const headers = ["ID", "Titolo", "User ID"];
        const rows = currentPosts.map(p => [
            p.id,
            Table.highlight(p.title, state.ricerca),
            Table.highlight(p.userId, state.ricerca)
        ]);
        html += Table.render(headers, rows, (index) => {
            const post = currentPosts[index];
            if (isTrash) {
                return `
                    <button class="ripristina-btn" data-id="${post.id}">Ripristina</button>
                    <button class="elimina-def-btn btn-danger" data-id="${post.id}">Elimina</button>
                `;
            }
            return `
                <button class="leggi-btn" data-id="${post.id}">Leggi</button>
                <button class="modifica-btn" data-id="${post.id}">Modifica</button>
                <button class="cestino-btn" data-id="${post.id}">Cestino</button>
            `;
        });
        html += Pagination.render(state.paginaCorrente, totalPages);
        container.innerHTML = html;
        this.bindEvents(container, currentPosts, isTrash);
    },
    bindEvents(container, posts, isTrash) {
        container.querySelectorAll(".leggi-btn").forEach(btn => {
            btn.addEventListener("click", () => this.openRead(btn.getAttribute("data-id")));
        });
        container.querySelectorAll(".modifica-btn").forEach(btn => {
            btn.addEventListener("click", () => this.openEdit(btn.getAttribute("data-id")));
        });
        container.querySelectorAll(".cestino-btn").forEach(btn => {
            btn.addEventListener("click", async () => {
                const id = btn.getAttribute("data-id");
                await PostsService.setStatus(id, false);
                window.dispatchEvent(new CustomEvent("refresh-data"));
            });
        });
        container.querySelectorAll(".ripristina-btn").forEach(btn => {
            btn.addEventListener("click", async () => {
                const id = btn.getAttribute("data-id");
                await PostsService.setStatus(id, true);
                window.dispatchEvent(new CustomEvent("refresh-data"));
            });
        });
        container.querySelectorAll(".elimina-def-btn").forEach(btn => {
            btn.addEventListener("click", async () => {
                const id = btn.getAttribute("data-id");
                const confirmed = await Modal.confirm("Sei sicuro di voler eliminare definitivamente questo post?");
                if (confirmed) {
                    await PostsService.delete(id);
                    window.dispatchEvent(new CustomEvent("refresh-data"));
                }
            });
        });
    },
    async openRead(id) {
        const post = await PostsService.getById(id);
        const html = `
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
        document.getElementById("closeModal")?.addEventListener("click", () => Modal.close());
    },
    async openEdit(id) {
        const post = await PostsService.getById(id);
        const html = `
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
        document.getElementById("cancelEdit")?.addEventListener("click", () => Modal.close());
        document.getElementById("saveEdit")?.addEventListener("click", async () => {
            const data = Form.getData(["editTitle", "editBody", "editUserId"]);
            await PostsService.update(id, {
                title: data.editTitle,
                body: data.editBody,
                userId: Number(data.editUserId)
            });
            Modal.close();
            window.dispatchEvent(new CustomEvent("refresh-data"));
        });
    },
    openCreate() {
        const html = `
            <div class="modal-content">
                <h3>Crea POST</h3>
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
        document.getElementById("cancelCreate")?.addEventListener("click", () => Modal.close());
        document.getElementById("saveCreate")?.addEventListener("click", async () => {
            const data = Form.getData(["createTitle", "createBody", "createUserId"]);
            if (!data.createTitle || !data.createBody || !data.createUserId)
                return alert("Compila tutti i campi");
            await PostsService.create({
                title: data.createTitle,
                body: data.createBody,
                userId: Number(data.createUserId),
                isActive: true
            });
            Modal.close();
            window.dispatchEvent(new CustomEvent("refresh-data"));
        });
    }
};
//# sourceMappingURL=index.js.map