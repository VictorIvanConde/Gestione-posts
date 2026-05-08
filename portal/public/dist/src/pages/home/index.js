import { DataService } from "../../services/api/data.service.js";
import { evidenziaTesto } from "../../../../shared/utils/utils.js";
export const HomePage = {
    tuttiPost: [],
    tuttiUtenti: [],
    testoRicerca: "",
    async init() {
        const [posts, utenti] = await Promise.all([
            DataService.getPosts(),
            DataService.getUsers()
        ]);
        this.tuttiPost = posts;
        this.tuttiUtenti = utenti;
    },
    trovaNomeUtente(userId) {
        const utente = this.tuttiUtenti.find(u => u.id === userId);
        return utente ? utente.name : "Utente sconosciuto";
    },
    renderLista(posts, container, activeId) {
        container.innerHTML = "";
        if (posts.length === 0) {
            container.innerHTML = "<p>Nessun post trovato.</p>";
            return;
        }
        posts.forEach(post => {
            const card = document.createElement("div");
            card.className = "post-card";
            if (activeId == post.id)
                card.classList.add("post-attivo");
            card.innerHTML = `
                <h3>${evidenziaTesto(post.title, this.testoRicerca)}</h3>
                <p><strong>Utente:</strong> ${this.trovaNomeUtente(post.userId)}</p>
                <p><strong>Anteprima:</strong> ${evidenziaTesto(post.body.slice(0, 60), this.testoRicerca)}...</p>
            `;
            card.addEventListener("click", () => {
                document.dispatchEvent(new CustomEvent("selezione-post", { detail: post.id }));
            });
            container.appendChild(card);
        });
    },
    async renderDettaglio(postId, container) {
        container.innerHTML = "<p>⏳ Caricamento dettaglio...</p>";
        try {
            const [post, commenti] = await Promise.all([
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
                        ${commenti.map(c => `
                            <div class='commento'>
                                <p><strong>${evidenziaTesto(c.name, this.testoRicerca)}</strong></p>
                                <p><small>${c.email}</small></p>
                                <p>${evidenziaTesto(c.body, this.testoRicerca)}</p>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
            const btn = document.getElementById("btnToggleCommenti");
            const box = document.getElementById("boxCommenti");
            if (btn && box) {
                btn.addEventListener("click", () => {
                    const isNascosto = box.style.display === "none";
                    box.style.display = isNascosto ? "block" : "none";
                    btn.classList.toggle("aperto");
                });
            }
        }
        catch (e) {
            container.innerHTML = "<p class='errore'>Errore nel caricamento del dettaglio.</p>";
        }
    }
};
//# sourceMappingURL=index.js.map