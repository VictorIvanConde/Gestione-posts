// definisco la struttura dei dati che rappresentano
// una singola opzione del portale
// classe principale del portale
// ha la responsabilità di generare e mostrare
// le sezioni disponibili all'utente
import { Signature } from "./signature.js";
class Portal {
    containerId;
    // definisco le opzioni disponibili del portale
    // ogni oggetto rappresenta una card navigabile
    options = [
        {
            title: "Utente",
            description: "Visualizza gli articoli e i commenti degli utenti",
            icon: "👥",
            url: "public/index.html"
        },
        {
            title: "Amministratore",
            description: "Gestisci post, utenti e ruoli del sistema",
            icon: "🛡️",
            url: "admin/index.html"
        }
    ];
    // salvo l'id del contenitore principale
    // dove verrà montata l'interfaccia
    constructor(containerId) {
        this.containerId = containerId;
    }
    // inizializzo il portale
    // recupero il contenitore dal DOM
    // e inserisco il markup generato
    init() {
        const root = document.getElementById(this.containerId);
        // verifico che il contenitore esista realmente
        if (root) {
            root.innerHTML = this.render() + Signature.render();
        }
    }
    // genero la struttura principale della pagina
    render() {
        return `
            <div class="container">

                <h1>Posts simpatici</h1>

                <p class="subtitle">
                    Scegli l'area a cui desideri accedere
                </p>

                <div class="options">

                    ${
        // genero dinamicamente una card
        // per ogni opzione disponibile
        this.options
            .map(opt => this.renderCard(opt))
            .join('')}

                </div>

            </div>
        `;
    }
    // genero il markup HTML di una singola card
    renderCard(opt) {
        return `
            <a href="${opt.url}" class="card">

                <div class="icon-box">
                    ${opt.icon}
                </div>

                <h2>${opt.title}</h2>

                <p>${opt.description}</p>

            </a>
        `;
    }
}
// aspetto che il DOM sia completamente caricato
// prima di inizializzare il portale
document.addEventListener("DOMContentLoaded", () => {
    // creo una nuova istanza del portale
    // specificando l'id del contenitore HTML
    const portal = new Portal("portal-root");
    // avvio il rendering dell'interfaccia
    portal.init();
});
//# sourceMappingURL=app.js.map