// classe principale per il portale pubblico degli articoli
// gestisce la visualizzazione dei post, la ricerca e i filtri utente
import { HomePage } from "./pages/home/index.js";
import { attendi } from "../../shared/utils/helpers.js";
import { Pagination } from "../../shared/components/pagination.js";
import { Logic } from "../../shared/utils/logic.js";
import { BackButton } from "../../shared/components/back_button.js";
import { SearchBar } from "../../shared/components/search_bar.js";
class PublicApp {
    dom;
    // tengo traccia dello stato attuale della navigazione
    state = {
        pagina: 1,
        testoRicercaAttuale: "",
        ultimiRisultatiRicerca: null,
        ricercaInCorso: false,
        idPostAperto: null
    };
    constructor() {
        // aggiungo il tasto per tornare indietro e la barra di ricerca
        const h1 = document.querySelector("h1");
        if (h1)
            h1.innerHTML = BackButton.render() + " Elenco articoli";
        const searchContainer = document.getElementById("searchBarContainer");
        if (searchContainer)
            searchContainer.innerHTML = SearchBar.render("Cerca nel titolo o nel body...");
        this.setupDom();
        this.init();
    }
    // recupero i riferimenti agli elementi html della pagina
    setupDom() {
        this.dom = {
            filtroUtente: document.getElementById("filtroUtente"),
            perPagina: document.getElementById("perPagina"),
            messaggio: document.getElementById("messaggio"),
            listaPost: document.getElementById("listaPost"),
            dettaglioPost: document.getElementById("dettaglioPost"),
            barraRicerca: document.getElementById("barraRicerca"),
            cercaBtn: document.getElementById("cercaBtn"),
            riprovaCentroBtn: document.getElementById("riprovaCentroBtn"),
            erroreServerBox: document.getElementById("erroreServerBox"),
            paginazione: document.querySelector(".paginazione")
        };
    }
    // avvio l'app scaricando i dati iniziali
    async init() {
        this.dom.messaggio.textContent = "⏳ Caricamento...";
        this.dom.messaggio.className = "loader";
        try {
            this.dom.erroreServerBox.style.display = "none";
            this.dom.paginazione.style.display = "none";
            await HomePage.init();
            this.riempiFiltroUtenti();
            this.aggiornaVista();
            this.bindEvents();
            this.dom.messaggio.textContent = "";
            this.dom.messaggio.className = "";
            this.dom.paginazione.style.display = "flex";
        }
        catch (e) {
            this.dom.messaggio.textContent = "Errore durante il caricamento dei dati.";
            this.dom.messaggio.className = "errore";
            this.dom.erroreServerBox.style.display = "block";
            this.dom.paginazione.style.display = "none";
        }
    }
    // aggiungo i nomi degli utenti nella tendina del filtro
    riempiFiltroUtenti() {
        HomePage.tuttiUtenti.forEach((utente) => {
            const option = document.createElement("option");
            option.value = String(utente.id);
            option.textContent = utente.name;
            this.dom.filtroUtente.appendChild(option);
        });
    }
    // ricalcolo la lista dei post in base ai filtri e alla pagina attuale
    aggiornaVista() {
        const quantiPerPagina = Number(this.dom.perPagina.value);
        let posts = this.state.ultimiRisultatiRicerca || HomePage.tuttiPost;
        const userId = this.dom.filtroUtente.value;
        if (userId) {
            posts = posts.filter((p) => p.userId === Number(userId));
        }
        const totalePagine = Math.ceil(posts.length / quantiPerPagina) || 1;
        if (this.state.pagina > totalePagine)
            this.state.pagina = totalePagine;
        const inizio = (this.state.pagina - 1) * quantiPerPagina;
        const postDaMostrare = posts.slice(inizio, inizio + quantiPerPagina);
        HomePage.testoRicerca = this.state.testoRicercaAttuale;
        HomePage.renderLista(postDaMostrare, this.dom.listaPost, this.state.idPostAperto);
        // genero la barra di paginazione in fondo
        this.dom.paginazione.innerHTML = Pagination.render(this.state.pagina, totalePagine);
        // collego i click ai nuovi bottoni avanti/indietro
        this.dom.paginazione.querySelector("#prevBtn")?.addEventListener("click", () => { this.state.pagina--; this.aggiornaVista(); });
        this.dom.paginazione.querySelector("#nextBtn")?.addEventListener("click", () => { this.state.pagina++; this.aggiornaVista(); });
    }
    // gestisco la ricerca dei post con un piccolo ritardo simulato
    async eseguiRicerca() {
        if (this.state.ricercaInCorso)
            return;
        const testo = this.dom.barraRicerca.value.trim();
        if (testo && testo.length < 3) {
            this.dom.messaggio.textContent = "La ricerca deve contenere almeno 3 caratteri.";
            this.dom.messaggio.className = "errore";
            return;
        }
        try {
            this.state.ricercaInCorso = true;
            this.state.testoRicercaAttuale = testo;
            this.dom.messaggio.textContent = "🔍 Ricerca in corso...";
            await attendi(600);
            if (!testo) {
                this.state.ultimiRisultatiRicerca = null;
            }
            else {
                this.state.ultimiRisultatiRicerca = Logic.filtraPost(HomePage.tuttiPost, this.state.testoRicercaAttuale);
            }
            this.state.pagina = 1;
            this.aggiornaVista();
            // se c'era un post aperto lo ricarico per evidenziare le nuove parole cercate
            if (this.state.idPostAperto !== null) {
                HomePage.renderDettaglio(Number(this.state.idPostAperto), this.dom.dettaglioPost);
            }
            this.dom.messaggio.textContent = "Ricerca completata.";
            this.dom.messaggio.className = "successo";
        }
        catch (e) {
            this.dom.messaggio.textContent = "Errore durante la ricerca.";
            this.dom.messaggio.className = "errore";
        }
        finally {
            this.state.ricercaInCorso = false;
        }
    }
    // collego tutti gli eventi di input e click
    bindEvents() {
        this.dom.filtroUtente.addEventListener("change", () => { this.state.pagina = 1; this.aggiornaVista(); });
        this.dom.perPagina.addEventListener("change", () => { this.state.pagina = 1; this.aggiornaVista(); });
        this.dom.cercaBtn.addEventListener("click", () => this.eseguiRicerca());
        this.dom.barraRicerca.addEventListener("keypress", (e) => { if (e.key === "Enter")
            this.eseguiRicerca(); });
        this.dom.riprovaCentroBtn.addEventListener("click", () => this.init());
        // ascolto la selezione di un post dalla lista
        document.addEventListener("selezione-post", (e) => {
            const customEvent = e;
            this.state.idPostAperto = customEvent.detail;
            HomePage.renderDettaglio(Number(customEvent.detail), this.dom.dettaglioPost);
            this.aggiornaVista();
        });
    }
}
// avvio l'app pubblica quando il dom è pronto
document.addEventListener("DOMContentLoaded", () => {
    new PublicApp();
});
//# sourceMappingURL=app.js.map