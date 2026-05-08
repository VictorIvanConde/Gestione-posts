// gestisco la logica della home page pubblica
// carico i post e gli utenti per mostrarli nella lista

import { DataService } from "../../services/api/data.service.js";
import { Post, Utente, Commento } from "../../../../shared/types/models.js";
import { evidenziaTesto } from "../../../../shared/utils/helpers.js";
import { Logic } from "../../../../shared/utils/logic.js";

export const HomePage = {
    tuttiPost: [] as Post[],
    tuttiUtenti: [] as Utente[],
    testoRicerca: "" as string,

    // inizializzo i dati necessari all'avvio
    async init(): Promise<void> {
        const [posts, utenti]: [Post[], Utente[]] = await Promise.all([
            DataService.getPosts(),
            DataService.getUsers()
        ]);
        this.tuttiPost = posts;
        this.tuttiUtenti = utenti;
    },

    // recupero il nome dell'utente partendo dal suo id
    trovaNomeUtente(userId: number): string {
        return Logic.trovaNomeInLista(this.tuttiUtenti, userId, "Utente sconosciuto");
    },

    // genero la lista dei post da mostrare a sinistra
    renderLista(posts: Post[], container: HTMLElement, activeId: number | string | null): void {
        container.innerHTML = "";
        
        if (posts.length === 0) {
            container.innerHTML = "<p>Nessun post trovato.</p>";
            return;
        }

        // creo una card per ogni post presente
        posts.forEach((post: Post): void => {
            const card: HTMLDivElement = document.createElement("div");
            card.className = "post-card";
            if (activeId == post.id) card.classList.add("post-attivo");

            card.innerHTML = `
                <h3>${evidenziaTesto(post.title, this.testoRicerca)}</h3>
                <p><strong>Utente:</strong> ${this.trovaNomeUtente(post.userId)}</p>
                <p><strong>Anteprima:</strong> ${evidenziaTesto(post.body.slice(0, 60), this.testoRicerca)}...</p>
            `;

            // invio un evento quando l'utente seleziona un post
            card.addEventListener("click", (): void => {
                document.dispatchEvent(new CustomEvent("selezione-post", { detail: post.id }));
            });

            container.appendChild(card);
        });
    },

    // mostro il dettaglio completo del post selezionato a destra
    async renderDettaglio(postId: number, container: HTMLElement): Promise<void> {
        container.innerHTML = "<p>⏳ Caricamento dettaglio...</p>";
        try {
            // carico contemporaneamente post e relativi commenti
            const [post, commenti]: [Post, Commento[]] = await Promise.all([
                DataService.getPostById(postId),
                DataService.getCommentsByPostId(postId)
            ]);

            container.innerHTML = `
                <div class='box-post'>
                    <h3>${evidenziaTesto(post.title, this.testoRicerca)}</h3>
                    <p><strong>Utente:</strong> ${this.trovaNomeUtente(post.userId)}</p>
                    <p>${evidenziaTesto(post.body, this.testoRicerca)}</p>
                    <button id="btnToggleCommenti" class="btn-commenti" title="Mostra commenti"></button>
                </div>
                <div id='boxCommenti' class='box-commenti' style='display: none;'>
                    <h4>Commenti (${commenti.length})</h4>
                    <div class='lista-commenti'>
                        ${commenti.map((c: Commento): string => `
                            <div class='commento'>
                                <p><strong>${evidenziaTesto(c.name, this.testoRicerca)}</strong></p>
                                <p><small>${c.email}</small></p>
                                <p>${evidenziaTesto(c.body, this.testoRicerca)}</p>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;

            // gestisco l'apertura e la chiusura della sezione commenti
            const btn: HTMLElement | null = document.getElementById("btnToggleCommenti");
            const box: HTMLElement | null = document.getElementById("boxCommenti");
            if (btn && box) {
                btn.addEventListener("click", (): void => {
                    const isNascosto: boolean = box.style.display === "none";
                    box.style.display = isNascosto ? "block" : "none";
                    btn.classList.toggle("aperto");
                });
            }
        } catch (e: unknown) {
            container.innerHTML = "<p class='errore'>Errore nel caricamento del dettaglio.</p>";
        }
    }
};
