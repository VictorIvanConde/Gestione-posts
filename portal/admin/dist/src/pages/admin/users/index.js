import { UsersService } from "../../../services/api/users.service.js";
import { Table } from "../../../commons/table.js";
import { Header } from "../../../components/header.js";
import { Modal } from "../../../commons/modal.js";
import { Form } from "../../../commons/form.js";
import { Pagination } from "../../../commons/pagination.js";
function isUtente(item) {
    return item.email !== undefined;
}
export const UsersPage = {
    roles: [],
    async render(container, state) {
        if (this.roles.length === 0) {
            this.roles = await UsersService.getRoles();
        }
        const isTrash = state.sezioneAttiva.startsWith("trash-");
        const isRoles = state.sezioneAttiva === "roles";
        let items = [];
        let headers = [];
        if (isRoles) {
            items = await UsersService.getRoles();
            headers = ["ID", "Nome Ruolo"];
        }
        else {
            const allUsers = await UsersService.getAll();
            items = allUsers.filter(u => isTrash ? u.isActive === false : u.isActive !== false);
            headers = ["ID", "Nome", "Email", "Ruolo"];
        }
        if (state.ricerca.length >= 3) {
            const q = state.ricerca.toLowerCase();
            items = items.filter(item => {
                const nameMatch = item.name && item.name.toLowerCase().includes(q);
                const emailMatch = isUtente(item) && item.email.toLowerCase().includes(q);
                return nameMatch || emailMatch;
            });
        }
        const totalPages = Math.max(1, Math.ceil(items.length / state.limite));
        if (state.paginaCorrente > totalPages)
            state.paginaCorrente = totalPages;
        const start = (state.paginaCorrente - 1) * state.limite;
        const currentItems = items.slice(start, start + state.limite);
        let title = isRoles ? "Gestione RUOLI" : (isTrash ? "Cestino UTENTI" : "Gestione UTENTI");
        let html = Header.render(title, !isTrash, state.ricerca);
        const rows = currentItems.map(item => {
            if (isRoles) {
                return [item.id, Table.highlight(item.name, state.ricerca)];
            }
            else if (isUtente(item)) {
                const role = this.roles.find(r => r.id == item.roleId);
                return [
                    item.id,
                    Table.highlight(item.name, state.ricerca),
                    Table.highlight(item.email, state.ricerca),
                    role ? role.name : "N/D"
                ];
            }
            return [item.id, item.name]; // Fallback
        });
        html += Table.render(headers, rows, (index) => {
            const item = currentItems[index];
            if (isTrash) {
                return `
                    <button class="ripristina-btn" data-id="${item.id}">Ripristina</button>
                    <button class="elimina-def-btn btn-danger" data-id="${item.id}">Elimina</button>
                `;
            }
            const labelElimina = isRoles ? "Elimina" : "Cestino";
            const btnClass = isRoles ? "elimina-def-btn" : "cestino-btn";
            return `
                <button class="modifica-btn" data-id="${item.id}">Modifica</button>
                <button class="${btnClass} btn-danger" data-id="${item.id}">${labelElimina}</button>
            `;
        });
        html += Pagination.render(state.paginaCorrente, totalPages);
        container.innerHTML = html;
        this.bindEvents(container, currentItems, isTrash, isRoles);
    },
    bindEvents(container, items, isTrash, isRoles) {
        container.querySelectorAll(".modifica-btn").forEach(btn => {
            btn.addEventListener("click", () => this.openEdit(btn.getAttribute("data-id"), isRoles));
        });
        container.querySelectorAll(".cestino-btn").forEach(btn => {
            btn.addEventListener("click", async () => {
                const id = btn.getAttribute("data-id");
                await UsersService.setStatus(id, false);
                window.dispatchEvent(new CustomEvent("refresh-data"));
            });
        });
        container.querySelectorAll(".ripristina-btn").forEach(btn => {
            btn.addEventListener("click", async () => {
                const id = btn.getAttribute("data-id");
                await UsersService.setStatus(id, true);
                window.dispatchEvent(new CustomEvent("refresh-data"));
            });
        });
        container.querySelectorAll(".elimina-def-btn").forEach(btn => {
            btn.addEventListener("click", async () => {
                const id = btn.getAttribute("data-id");
                const confirmed = await Modal.confirm(`Sei sicuro di voler eliminare definitivamente questo ${isRoles ? 'ruolo' : 'utente'}?`);
                if (confirmed) {
                    if (isRoles)
                        await UsersService.deleteRole(id);
                    else
                        await UsersService.delete(id);
                    if (isRoles)
                        this.roles = [];
                    window.dispatchEvent(new CustomEvent("refresh-data"));
                }
            });
        });
    },
    async openEdit(id, isRoles) {
        if (isRoles) {
            const role = this.roles.find(r => r.id == id);
            if (!role)
                return;
            const html = `
                <div class="modal-content">
                    <h3>Modifica RUOLO <span style="color:#666; font-size:0.9rem;">#${id}</span></h3>
                    ${Form.renderInput("Nome Ruolo", "editRoleName", "text", role.name)}
                    <div class="modal-actions">
                        <button id="cancelEdit" class="modal-btn btn-cancel">Annulla</button>
                        <button id="saveEdit" class="modal-btn btn-save">Salva</button>
                    </div>
                </div>
            `;
            Modal.open("modalModifica", html);
            document.getElementById("saveEdit")?.addEventListener("click", async () => {
                const data = Form.getData(["editRoleName"]);
                await UsersService.createRole({ id, name: data.editRoleName, isActive: true });
                Modal.close();
                this.roles = [];
                window.dispatchEvent(new CustomEvent("refresh-data"));
            });
        }
        else {
            const user = await UsersService.getById(id);
            const roleOptions = this.roles.map(r => ({ value: String(r.id), label: r.name }));
            const html = `
                <div class="modal-content">
                    <h3>Modifica UTENTE <span style="color:#666; font-size:0.9rem;">#${id}</span></h3>
                    ${Form.renderInput("Nome", "editUserName", "text", user.name)}
                    ${Form.renderInput("Email", "editUserEmail", "email", user.email)}
                    ${Form.renderSelect("Ruolo", "editUserRole", roleOptions, String(user.roleId))}
                    <div class="modal-actions">
                        <button id="cancelEdit" class="modal-btn btn-cancel">Annulla</button>
                        <button id="saveEdit" class="modal-btn btn-save">Salva</button>
                    </div>
                </div>
            `;
            Modal.open("modalModifica", html);
            document.getElementById("saveEdit")?.addEventListener("click", async () => {
                const data = Form.getData(["editUserName", "editUserEmail", "editUserRole"]);
                await UsersService.update(id, {
                    name: data.editUserName,
                    email: data.editUserEmail,
                    roleId: Number(data.editUserRole)
                });
                Modal.close();
                window.dispatchEvent(new CustomEvent("refresh-data"));
            });
        }
        document.getElementById("cancelEdit")?.addEventListener("click", () => Modal.close());
    },
    openCreate(isRoles) {
        if (isRoles) {
            const html = `
                <div class="modal-content">
                    <h3>Crea RUOLO</h3>
                    ${Form.renderInput("ID Ruolo (opzionale)", "createRoleId", "text", "", "Es. 3")}
                    ${Form.renderInput("Nome Ruolo", "createRoleName", "text", "", "Nome ruolo")}
                    <div class="modal-actions">
                        <button id="cancelCreate" class="modal-btn btn-cancel">Annulla</button>
                        <button id="saveCreate" class="modal-btn btn-save">Crea</button>
                    </div>
                </div>
            `;
            Modal.open("modalCrea", html);
            document.getElementById("saveCreate")?.addEventListener("click", async () => {
                const data = Form.getData(["createRoleId", "createRoleName"]);
                if (!data.createRoleName)
                    return alert("Inserisci il nome ruolo");
                await UsersService.createRole({
                    id: data.createRoleId || "",
                    name: data.createRoleName,
                    isActive: true
                });
                Modal.close();
                this.roles = [];
                window.dispatchEvent(new CustomEvent("refresh-data"));
            });
        }
        else {
            const roleOptions = this.roles.map(r => ({ value: String(r.id), label: r.name }));
            const html = `
                <div class="modal-content">
                    <h3>Crea UTENTE</h3>
                    ${Form.renderInput("Nome", "createUserName", "text", "", "Nome")}
                    ${Form.renderInput("Email", "createUserEmail", "email", "", "Email")}
                    ${Form.renderSelect("Ruolo", "createUserRole", roleOptions)}
                    <div class="modal-actions">
                        <button id="cancelCreate" class="modal-btn btn-cancel">Annulla</button>
                        <button id="saveCreate" class="modal-btn btn-save">Crea</button>
                    </div>
                </div>
            `;
            Modal.open("modalCrea", html);
            document.getElementById("saveCreate")?.addEventListener("click", async () => {
                const data = Form.getData(["createUserName", "createUserEmail", "createUserRole"]);
                if (!data.createUserName || !data.createUserEmail)
                    return alert("Compila i campi obbligatori");
                await UsersService.create({
                    name: data.createUserName,
                    email: data.createUserEmail,
                    roleId: Number(data.createUserRole),
                    isActive: true
                });
                Modal.close();
                window.dispatchEvent(new CustomEvent("refresh-data"));
            });
        }
        document.getElementById("cancelCreate")?.addEventListener("click", () => Modal.close());
    }
};
//# sourceMappingURL=index.js.map