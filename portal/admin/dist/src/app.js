import { PostsPage } from "./pages/admin/posts/index.js";
import { UsersPage } from "./pages/admin/users/index.js";
import { CommentsPage } from "./pages/admin/comments/index.js";
class App {
    container;
    bottoniMenu;
    state = {
        sezioneAttiva: "posts",
        paginaCorrente: 1,
        limite: 10,
        ricerca: ""
    };
    constructor() {
        this.container = document.getElementById("contenuto");
        this.bottoniMenu = document.querySelectorAll(".menu-btn");
        this.init();
    }
    async init() {
        await this.caricaPagina();
        window.addEventListener("refresh-data", () => this.caricaPagina());
        this.bottoniMenu.forEach(btn => {
            btn.addEventListener("click", () => {
                this.cambiaSezione(btn.dataset.sezione);
            });
        });
        document.addEventListener("click", (e) => {
            const target = e.target;
            if (target.id === "btnSearch")
                this.eseguiRicerca();
            if (target.id === "btnCreate")
                this.apriCrea();
            if (target.id === "prevPage")
                this.cambiaPagina(-1);
            if (target.id === "nextPage")
                this.cambiaPagina(1);
        });
        document.addEventListener("keydown", (e) => {
            if (e.key === "Enter" && e.target.id === "inputRicerca") {
                this.eseguiRicerca();
            }
        });
    }
    async cambiaSezione(nuovaSezione) {
        this.state.sezioneAttiva = nuovaSezione;
        this.state.paginaCorrente = 1;
        this.state.ricerca = "";
        this.bottoniMenu.forEach(btn => {
            btn.classList.toggle("attivo", btn.dataset.sezione === this.state.sezioneAttiva);
        });
        await this.caricaPagina();
    }
    async caricaPagina() {
        this.container.innerHTML = "<p>⏳ Caricamento...</p>";
        try {
            const sezione = this.state.sezioneAttiva.replace("trash-", "");
            if (sezione === "posts") {
                await PostsPage.render(this.container, this.state);
            }
            else if (sezione === "users" || sezione === "roles") {
                await UsersPage.render(this.container, this.state);
            }
            else if (sezione === "comments") {
                await CommentsPage.render(this.container, this.state);
            }
        }
        catch (error) {
            console.error(error);
            this.container.innerHTML = `
                <div class="errore-container">
                    <p class="errore">Errore nel caricamento.</p>
                    <button id="btnRetry" class="modal-btn btn-save">↻ Riprova</button>
                </div>
            `;
            document.getElementById("btnRetry")?.addEventListener("click", () => this.caricaPagina());
        }
    }
    eseguiRicerca() {
        const input = document.getElementById("inputRicerca");
        if (!input)
            return;
        const testo = input.value.trim();
        if (testo.length > 0 && testo.length < 3) {
            alert("La ricerca deve contenere almeno 3 caratteri.");
            return;
        }
        this.state.ricerca = testo;
        this.state.paginaCorrente = 1;
        this.caricaPagina();
    }
    apriCrea() {
        const sezione = this.state.sezioneAttiva.replace("trash-", "");
        if (sezione === "posts")
            PostsPage.openCreate();
        else if (sezione === "users")
            UsersPage.openCreate(false);
        else if (sezione === "roles")
            UsersPage.openCreate(true);
        else if (sezione === "comments")
            CommentsPage.openCreate();
    }
    cambiaPagina(step) {
        this.state.paginaCorrente += step;
        this.caricaPagina();
    }
}
document.addEventListener("DOMContentLoaded", () => {
    new App();
});
//# sourceMappingURL=app.js.map