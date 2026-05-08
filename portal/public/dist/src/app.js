import { HomePage } from "./pages/home/index.js";
import { attendi } from "../../shared/utils/utils.js";
class PublicApp {
    dom = {
        filtroUtente: document.getElementById("filtroUtente"),
        perPagina: document.getElementById("perPagina"),
        messaggio: document.getElementById("messaggio"),
        listaPost: document.getElementById("listaPost"),
        dettaglioPost: document.getElementById("dettaglioPost"),
        prevBtn: document.getElementById("prevBtn"),
        nextBtn: document.getElementById("nextBtn"),
        paginaCorrente: document.getElementById("paginaCorrente"),
        barraRicerca: document.getElementById("barraRicerca"),
        cercaBtn: document.getElementById("cercaBtn"),
        riprovaCentroBtn: document.getElementById("riprovaCentroBtn")
    };
    state = {
        pagina: 1,
        testoRicercaAttuale: "",
        ultimiRisultatiRicerca: null,
        ricercaInCorso: false,
        idPostAperto: null
    };
    constructor() {
        this.init();
    }
    async init() {
        this.dom.messaggio.textContent = "⏳ Caricamento...";
        this.dom.messaggio.className = "loader";
        try {
            await HomePage.init();
            this.riempiFiltroUtenti();
            this.aggiornaVista();
            this.bindEvents();
            this.dom.messaggio.textContent = "";
            this.dom.messaggio.className = "";
        }
        catch (e) {
            this.dom.messaggio.textContent = "Errore durante il caricamento dei dati.";
            this.dom.messaggio.className = "errore";
        }
    }
    riempiFiltroUtenti() {
        HomePage.tuttiUtenti.forEach(utente => {
            const option = document.createElement("option");
            option.value = String(utente.id);
            option.textContent = utente.name;
            this.dom.filtroUtente.appendChild(option);
        });
    }
    aggiornaVista() {
        const quantiPerPagina = Number(this.dom.perPagina.value);
        let posts = this.state.ultimiRisultatiRicerca || HomePage.tuttiPost;
        const userId = this.dom.filtroUtente.value;
        if (userId) {
            posts = posts.filter(p => p.userId === Number(userId));
        }
        const totalePagine = Math.ceil(posts.length / quantiPerPagina) || 1;
        if (this.state.pagina > totalePagine)
            this.state.pagina = totalePagine;
        const inizio = (this.state.pagina - 1) * quantiPerPagina;
        const postDaMostrare = posts.slice(inizio, inizio + quantiPerPagina);
        HomePage.testoRicerca = this.state.testoRicercaAttuale;
        HomePage.renderLista(postDaMostrare, this.dom.listaPost, this.state.idPostAperto);
        this.dom.paginaCorrente.textContent = `Pagina ${this.state.pagina} di ${totalePagine}`;
        // Gestione visibilità tasti paginazione come richiesto
        this.dom.prevBtn.style.display = this.state.pagina === 1 ? "none" : "inline-block";
        this.dom.nextBtn.style.display = this.state.pagina === totalePagine ? "none" : "inline-block";
    }
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
                const parole = testo.toLowerCase().split(" ").filter(Boolean);
                this.state.ultimiRisultatiRicerca = HomePage.tuttiPost.filter(post => parole.every(p => post.title.toLowerCase().includes(p) || post.body.toLowerCase().includes(p)));
            }
            this.state.pagina = 1;
            this.aggiornaVista();
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
    bindEvents() {
        this.dom.filtroUtente.addEventListener("change", () => { this.state.pagina = 1; this.aggiornaVista(); });
        this.dom.perPagina.addEventListener("change", () => { this.state.pagina = 1; this.aggiornaVista(); });
        this.dom.cercaBtn.addEventListener("click", () => this.eseguiRicerca());
        this.dom.barraRicerca.addEventListener("keypress", (e) => { if (e.key === "Enter")
            this.eseguiRicerca(); });
        this.dom.prevBtn.addEventListener("click", () => { this.state.pagina--; this.aggiornaVista(); });
        this.dom.nextBtn.addEventListener("click", () => { this.state.pagina++; this.aggiornaVista(); });
        this.dom.riprovaCentroBtn.addEventListener("click", () => location.reload());
        document.addEventListener("selezione-post", (e) => {
            this.state.idPostAperto = e.detail;
            HomePage.renderDettaglio(Number(e.detail), this.dom.dettaglioPost);
            this.aggiornaVista();
        });
    }
}
document.addEventListener("DOMContentLoaded", () => {
    new PublicApp();
});
//# sourceMappingURL=app.js.map