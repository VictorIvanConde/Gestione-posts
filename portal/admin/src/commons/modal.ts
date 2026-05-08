// utilità per gestire le finestre a comparsa (modal)
// serve per mostrare form, dettagli o messaggi di conferma

export const Modal = {
    // apro un nuovo modal inserendo il contenuto html
    open(id: string, content: string, onOverlayClick?: () => void): void {
        this.close(); // chiudo eventuali modal aperti in precedenza

        const overlay: HTMLDivElement = document.createElement("div");
        overlay.className = "modal-overlay";
        overlay.id = id;
        overlay.innerHTML = content;

        // chiudo il modal se l'utente clicca fuori dalla finestra bianca
        overlay.addEventListener("click", (e: MouseEvent): void => {
            if (e.target === overlay) {
                if (onOverlayClick) onOverlayClick();
                this.close();
            }
        });

        document.body.appendChild(overlay);
    },

    // rimuovo tutti i modal presenti dal dom
    close(): void {
        const modals: string[] = ["modalModifica", "modalCrea", "modalLettura", "modalConferma"];
        modals.forEach((id: string): void => {
            const el: HTMLElement | null = document.getElementById(id);
            if (el) el.remove();
        });
    },

    // mostro un messaggio di conferma con i tasti sì/no
    confirm(message: string): Promise<boolean> {
        return new Promise((resolve: (value: boolean | PromiseLike<boolean>) => void): void => {
            const html: string = `
                <div class="modal-content" style="width: 400px; text-align: center;">
                    <h3 style="color: #e74c3c;">⚠️ Conferma</h3>
                    <p style="margin: 20px 0; font-size: 1.1rem; line-height: 1.5;">${message}</p>
                    <div class="modal-actions" style="justify-content: center; gap: 20px; margin-top: 25px;">
                        <button id="btnAnnullaConferma" class="modal-btn btn-cancel">Annulla</button>
                        <button id="btnOkConferma" class="modal-btn btn-save btn-danger">Sì, Procedi</button>
                    </div>
                </div>
            `;

            this.open("modalConferma", html);

            const btnAnnulla: HTMLElement | null = document.getElementById("btnAnnullaConferma");
            const btnOk: HTMLElement | null = document.getElementById("btnOkConferma");

            // restituisco vero se l'utente accetta, falso se annulla
            if (btnAnnulla) btnAnnulla.onclick = (): void => { this.close(); resolve(false); };
            if (btnOk) btnOk.onclick = (): void => { this.close(); resolve(true); };
        });
    }
};
