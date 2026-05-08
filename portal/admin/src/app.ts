// classe principale per gestire la dashboard admin
// controlla il menu laterale e il caricamento delle pagine

import { PostsPage } from "./pages/admin/posts/index.js";
import { UsersPage } from "./pages/admin/users/index.js";
import { CommentsPage } from "./pages/admin/comments/index.js";
import { TrashPage } from "./pages/admin/trash/index.js";
import { BackButton } from "../../shared/components/back_button.js";
import { AdminState } from "./types/state.js";


class App {
    private container: HTMLElement;
    private bottoniMenu: NodeListOf<HTMLButtonElement>;
    
    // mantengo lo stato della dashboard in memoria
    private state: AdminState = {
        sezioneAttiva: localStorage.getItem("admin_sezione") || "posts",
        paginaCorrente: 1,
        limite: 10,
        ricerca: ""
    };

    constructor() {
        this.container = document.getElementById("contenuto")!;
        this.bottoniMenu = document.querySelectorAll(".menu-btn");
        
        // aggiungo il tasto per tornare alla home nel titolo
        const h1: HTMLHeadingElement | null = document.querySelector("h1");
        if (h1) h1.innerHTML = BackButton.render() + " Dashboard Admin";

        // evidenzio il bottone del menu attivo all'avvio
        this.bottoniMenu.forEach((btn: HTMLButtonElement): void => {
            btn.classList.toggle("attivo", btn.dataset.sezione === this.state.sezioneAttiva);
        });
        
        this.init();
    }

    // inizializzo gli eventi e carico la prima pagina
    private async init(): Promise<void> {
        await this.caricaPagina();

        // ascolto l'evento personalizzato per aggiornare i dati
        window.addEventListener("refresh-data", (): void => { this.caricaPagina(); });
        
        // collego i bottoni del menu laterale
        this.bottoniMenu.forEach((btn: HTMLButtonElement): void => {
            btn.addEventListener("click", (): void => {
                this.cambiaSezione(btn.dataset.sezione!);
            });
        });

        // gestisco i click generici sulla pagina (ricerca, creazione, paginazione)
        document.addEventListener("click", (e: MouseEvent): void => {
            const target: HTMLElement = e.target as HTMLElement;
            
            if (target.id === "cercaBtn") this.eseguiRicerca();
            if (target.id === "btnCreate") this.apriCrea();
            if (target.id === "prevBtn") this.cambiaPagina(-1);
            if (target.id === "nextBtn") this.cambiaPagina(1);
        });

        // permetto di cercare premendo invio nella barra di ricerca
        document.addEventListener("keydown", (e: KeyboardEvent): void => {
            if (e.key === "Enter" && (e.target as HTMLElement).id === "barraRicerca") {
                this.eseguiRicerca();
            }
        });
    }

    // cambio la sezione visualizzata e resetto i filtri
    private async cambiaSezione(nuovaSezione: string): Promise<void> {
        this.state.sezioneAttiva = nuovaSezione;
        localStorage.setItem("admin_sezione", nuovaSezione);
        this.state.paginaCorrente = 1;
        this.state.ricerca = "";

        // aggiorno graficamente il menu
        this.bottoniMenu.forEach((btn: HTMLButtonElement): void => {
            btn.classList.toggle("attivo", btn.dataset.sezione === this.state.sezioneAttiva);
        });

        await this.caricaPagina();
    }

    // carico il modulo della pagina richiesta
    private async caricaPagina(): Promise<void> {
        this.container.innerHTML = "<p>⏳ Caricamento...</p>";

        try {
            const sezione: string = this.state.sezioneAttiva;

            // scelgo quale pagina renderizzare nel contenitore
            if (sezione === "trash") {
                await TrashPage.render(this.container, this.state);
            } else if (sezione === "posts") {
                await PostsPage.render(this.container, this.state);
            } else if (sezione === "users" || sezione === "roles") {
                await UsersPage.render(this.container, this.state);
            } else if (sezione === "comments") {
                await CommentsPage.render(this.container, this.state);
            }
        } catch (error: unknown) {
            console.error(error);
            this.container.innerHTML = `
                <div class="errore-container">
                    <p class="errore">Errore nel caricamento.</p>
                    <button id="btnRetry" class="modal-btn btn-save">↻ Riprova</button>
                </div>
            `;
            document.getElementById("btnRetry")?.addEventListener("click", (): void => { this.caricaPagina(); });
        }
    }

    // applico il testo della ricerca allo stato attuale
    private eseguiRicerca(): void {
        const input: HTMLInputElement | null = document.getElementById("barraRicerca") as HTMLInputElement;
        if (!input) return;

        const testo: string = input.value.trim();
        if (testo.length > 0 && testo.length < 3) {
            alert("La ricerca deve contenere almeno 3 caratteri.");
            return;
        }

        this.state.ricerca = testo;
        this.state.paginaCorrente = 1;
        this.caricaPagina();
    }

    // apro il modal per creare un nuovo elemento in base alla sezione
    private apriCrea(): void {
        const sezione: string = this.state.sezioneAttiva.replace("trash-", "");
        if (sezione === "posts") PostsPage.openCreate();
        else if (sezione === "users") UsersPage.openCreate(false);
        else if (sezione === "roles") UsersPage.openCreate(true);
        else if (sezione === "comments") CommentsPage.openCreate();
    }

    // gestisco il cambio di pagina avanti o indietro
    private cambiaPagina(step: number): void {
        this.state.paginaCorrente += step;
        this.caricaPagina();
    }
}

// avvio l'applicazione quando il dom è pronto
document.addEventListener("DOMContentLoaded", (): void => {
    new App();
});
