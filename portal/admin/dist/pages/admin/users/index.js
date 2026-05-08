// gestisco la pagina degli utenti e dei ruoli nella dashboard admin
// permette di creare profili, assegnare permessi e gestire le anagrafiche
import { UsersService } from "../../../services/api/users.service.js";
import { Table } from "../../../../../shared/components/table.js";
import { Header } from "../../../components/header.js";
import { Modal } from "../../../commons/modal.js";
import { Form } from "../../../commons/form.js";
import { Pagination } from "../../../../../shared/components/pagination.js";
import { Logic } from "../../../../../shared/utils/logic.js";
import { Toast } from "../../../../../shared/utils/helpers.js";
import { isUtente } from "../../../../../shared/utils/logic.js";
// gestisco la pagina degli utenti e dei ruoli
// a seconda della sezione attiva mostro dati diversi
export const UsersPage = {
    roles: [],
    async render(container, state) {
        // controllo se sono nella sezione ruoli
        const isRoles = state.sezioneAttiva === "roles";
        let items = [];
        let headers = [];
        // recupero i dati corretti dal server
        if (isRoles) {
            this.roles = await UsersService.getRoles();
            items = this.roles.filter((r) => r.isActive !== false);
            headers = ["ID", "Nome Ruolo"];
        }
        else {
            const allUsers = await UsersService.getAll();
            this.roles = await UsersService.getRoles();
            items = allUsers.filter((u) => u.isActive !== false);
            headers = ["ID", "Nome", "Email", "Ruolo"];
        }
        // filtro i risultati in base alla ricerca
        if (state.ricerca.length >= 3) {
            const q = state.ricerca.toLowerCase();
            items = items.filter((item) => {
                const nameMatch = !!(item.name && item.name.toLowerCase().includes(q));
                const emailMatch = isUtente(item) && item.email.toLowerCase().includes(q);
                return nameMatch || emailMatch;
            });
        }
        // calcolo le pagine per la tabella
        const totalPages = Math.max(1, Math.ceil(items.length / state.limite));
        if (state.paginaCorrente > totalPages)
            state.paginaCorrente = totalPages;
        // prendo solo gli elementi della pagina corrente
        const start = (state.paginaCorrente - 1) * state.limite;
        const currentItems = items.slice(start, start + state.limite);
        // imposto il titolo e l'header
        let title = isRoles ? "Gestione RUOLI" : "Gestione UTENTI";
        let html = Header.render(title, true, state.ricerca);
        // preparo le righe della tabella
        const rows = currentItems.map((item) => {
            if (isRoles) {
                return [item.id, Table.highlight(item.name || "", state.ricerca)];
            }
            else if (isUtente(item)) {
                const roleName = Logic.trovaNomeInLista(this.roles, item.roleId || 0);
                return [
                    item.id,
                    Table.highlight(item.name, state.ricerca),
                    Table.highlight(item.email, state.ricerca),
                    roleName
                ];
            }
            return [item.id, item.name || ""];
        });
        // aggiungo la tabella e i bottoni di azione
        html += Table.render(headers, rows, (index) => {
            const item = currentItems[index];
            const isRolesTab = state.sezioneAttiva === "roles";
            const btnClass = isRolesTab ? "elimina-def-btn" : "cestino-btn";
            const btnIcon = isRolesTab ? "❌" : "🗑️";
            const btnTitle = isRolesTab ? "Elimina definitivamente" : "Sposta nel cestino";
            return `
                <button class="btn-azione btn-edit modifica-btn" data-id="${item.id}" title="Modifica">✏️</button>
                <button class="btn-azione btn-delete ${btnClass}" data-id="${item.id}" title="${btnTitle}">${btnIcon}</button>
            `;
        });
        // aggiungo la paginazione in fondo
        html += Pagination.render(state.paginaCorrente, totalPages);
        // renderizzo tutto e collego gli eventi
        container.innerHTML = html;
        this.bindEvents(container, currentItems, isRoles);
    },
    // collego gli eventi ai bottoni della tabella
    bindEvents(container, items, isRoles) {
        // click per modificare un utente o un ruolo
        container.querySelectorAll(".modifica-btn").forEach((btn) => {
            btn.addEventListener("click", () => { this.openEdit(btn.getAttribute("data-id"), isRoles); });
        });
        // click per mandare nel cestino
        container.querySelectorAll(".cestino-btn").forEach((btn) => {
            btn.addEventListener("click", async () => {
                const id = btn.getAttribute("data-id");
                await UsersService.setStatus(id, false);
                window.dispatchEvent(new CustomEvent("refresh-data"));
            });
        });
        // click per eliminare definitivamente (solo ruoli)
        container.querySelectorAll(".elimina-def-btn").forEach((btn) => {
            btn.addEventListener("click", async () => {
                const id = btn.getAttribute("data-id");
                const confirmed = await Modal.confirm(`Sei sicuro di voler eliminare definitivamente questo ruolo?`);
                if (confirmed) {
                    await UsersService.deleteRole(id);
                    this.roles = [];
                    window.dispatchEvent(new CustomEvent("refresh-data"));
                }
            });
        });
    },
    // gestisco l'apertura del modal di modifica
    async openEdit(id, isRoles) {
        if (isRoles) {
            // logica per la modifica del ruolo
            const role = this.roles.find((r) => String(r.id) === String(id));
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
                await UsersService.updateRole(String(id), { name: data.editRoleName });
                Toast.show("Ruolo aggiornato!");
                Modal.close();
                this.roles = [];
                window.dispatchEvent(new CustomEvent("refresh-data"));
            });
        }
        else {
            // logica per la modifica dell'utente
            const user = await UsersService.getById(id);
            const roleOptions = this.roles.map((r) => ({ value: String(r.id), label: r.name }));
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
                Toast.show("Utente aggiornato!");
                Modal.close();
                window.dispatchEvent(new CustomEvent("refresh-data"));
            });
        }
        document.getElementById("cancelEdit")?.addEventListener("click", () => Modal.close());
    },
    // gestisco la creazione di un nuovo elemento
    openCreate(isRoles) {
        if (isRoles) {
            // form per nuovo ruolo
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
                const fieldIds = ["createRoleId", "createRoleName"];
                Form.clearErrors(fieldIds);
                const data = Form.getData(fieldIds);
                if (!data.createRoleName)
                    return Form.showError("createRoleName", "Inserisci il nome ruolo");
                // controllo se l'id ruolo è già preso
                if (data.createRoleId) {
                    try {
                        const roles = await UsersService.getRoles();
                        const exists = roles.some((r) => String(r.id) === String(data.createRoleId));
                        if (exists)
                            return Form.showError("createRoleId", `L'ID Ruolo "${data.createRoleId}" esiste già.`);
                    }
                    catch (e) { }
                }
                const payload = {
                    name: data.createRoleName,
                    isActive: true
                };
                if (data.createRoleId)
                    payload.id = data.createRoleId;
                await UsersService.createRole(payload);
                Toast.show("Ruolo creato con successo!");
                Modal.close();
                this.roles = [];
                window.dispatchEvent(new CustomEvent("refresh-data"));
            });
        }
        else {
            // form per nuovo utente
            const roleOptions = this.roles.map((r) => ({ value: String(r.id), label: r.name }));
            const html = `
                <div class="modal-content">
                    <h3>Crea UTENTE</h3>
                    ${Form.renderInput("ID Utente (opzionale)", "createUserId", "text", "", "ID manuale...")}
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
                const fieldIds = ["createUserId", "createUserName", "createUserEmail", "createUserRole"];
                Form.clearErrors(fieldIds);
                const data = Form.getData(fieldIds);
                if (!data.createUserName)
                    return Form.showError("createUserName", "Il nome è obbligatorio");
                if (!data.createUserEmail)
                    return Form.showError("createUserEmail", "L'email è obbligatoria");
                // controllo se l'id utente è già in uso
                if (data.createUserId) {
                    try {
                        const existing = await UsersService.getById(data.createUserId);
                        if (existing) {
                            const msg = existing.isActive === false
                                ? `L'ID "${data.createUserId}" è nel cestino. Eliminalo da lì per riutilizzarlo.`
                                : `L'ID "${data.createUserId}" esiste già.`;
                            return Form.showError("createUserId", msg);
                        }
                    }
                    catch (e) { }
                }
                const payload = {
                    name: data.createUserName,
                    email: data.createUserEmail,
                    roleId: Number(data.createUserRole),
                    isActive: true
                };
                if (data.createUserId)
                    payload.id = data.createUserId;
                await UsersService.create(payload);
                Toast.show("Utente creato con successo!");
                Modal.close();
                window.dispatchEvent(new CustomEvent("refresh-data"));
            });
        }
        document.getElementById("cancelCreate")?.addEventListener("click", () => Modal.close());
    }
};
//# sourceMappingURL=index.js.map