// classe principale per gestire la dashboard admin
// controlla il menu laterale e il caricamento delle pagine
import { PostsPage } from "./pages/admin/posts/index.js";
import { UsersPage } from "./pages/admin/users/index.js";
import { CommentsPage } from "./pages/admin/comments/index.js";
import { TrashPage } from "./pages/admin/trash/index.js";
import { BackButton } from "../../shared/components/back_button.js";
class App {
    container;
    bottoniMenu;
    // mantengo lo stato della dashboard in memoria
    state = {
        sezioneAttiva: localStorage.getItem("admin_sezione") || "posts",
        paginaCorrente: 1,
        limite: 10,
        ricerca: ""
    };
    constructor() {
        this.container = document.getElementById("contenuto");
        this.bottoniMenu = document.querySelectorAll(".menu-btn");
        // aggiungo il tasto per tornare alla home nel titolo
        const h1 = document.querySelector("h1");
        if (h1)
            h1.innerHTML = BackButton.render() + " Dashboard Admin";
        // evidenzio il bottone del menu attivo all'avvio
        this.bottoniMenu.forEach((btn) => {
            btn.classList.toggle("attivo", btn.dataset.sezione === this.state.sezioneAttiva);
        });
        this.init();
    }
    // inizializzo gli eventi e carico la prima pagina
    async init() {
        await this.caricaPagina();
        // ascolto l'evento personalizzato per aggiornare i dati
        window.addEventListener("refresh-data", () => { this.caricaPagina(); });
        // collego i bottoni del menu laterale
        this.bottoniMenu.forEach((btn) => {
            btn.addEventListener("click", () => {
                this.cambiaSezione(btn.dataset.sezione);
            });
        });
        // gestisco i click generici sulla pagina (ricerca, creazione, paginazione)
        document.addEventListener("click", (e) => {
            const target = e.target;
            if (target.id === "cercaBtn")
                this.eseguiRicerca();
            if (target.id === "btnCreate")
                this.apriCrea();
            if (target.id === "prevBtn")
                this.cambiaPagina(-1);
            if (target.id === "nextBtn")
                this.cambiaPagina(1);
        });
        // permetto di cercare premendo invio nella barra di ricerca
        document.addEventListener("keydown", (e) => {
            if (e.key === "Enter" && e.target.id === "barraRicerca") {
                this.eseguiRicerca();
            }
        });
    }
    // cambio la sezione visualizzata e resetto i filtri
    async cambiaSezione(nuovaSezione) {
        this.state.sezioneAttiva = nuovaSezione;
        localStorage.setItem("admin_sezione", nuovaSezione);
        this.state.paginaCorrente = 1;
        this.state.ricerca = "";
        // aggiorno graficamente il menu
        this.bottoniMenu.forEach((btn) => {
            btn.classList.toggle("attivo", btn.dataset.sezione === this.state.sezioneAttiva);
        });
        await this.caricaPagina();
    }
    // carico il modulo della pagina richiesta
    async caricaPagina() {
        this.container.innerHTML = "<p>⏳ Caricamento...</p>";
        try {
            const sezione = this.state.sezioneAttiva;
            // scelgo quale pagina renderizzare nel contenitore
            if (sezione === "trash") {
                await TrashPage.render(this.container, this.state);
            }
            else if (sezione === "posts") {
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
            document.getElementById("btnRetry")?.addEventListener("click", () => { this.caricaPagina(); });
        }
    }
    // applico il testo della ricerca allo stato attuale
    eseguiRicerca() {
        const input = document.getElementById("barraRicerca");
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
    // apro il modal per creare un nuovo elemento in base alla sezione
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
    // gestisco il cambio di pagina avanti o indietro
    cambiaPagina(step) {
        this.state.paginaCorrente += step;
        this.caricaPagina();
    }
}
// avvio l'applicazione quando il dom è pronto
document.addEventListener("DOMContentLoaded", () => {
    new App();
});
//# sourceMappingURL=app.js.map