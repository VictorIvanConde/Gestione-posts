export const Modal = {
    open(id, content, onOverlayClick) {
        this.close(); // Ensure previous modals are closed
        const overlay = document.createElement("div");
        overlay.className = "modal-overlay";
        overlay.id = id;
        overlay.innerHTML = content;
        overlay.addEventListener("click", (e) => {
            if (e.target === overlay) {
                if (onOverlayClick)
                    onOverlayClick();
                this.close();
            }
        });
        document.body.appendChild(overlay);
    },
    close() {
        const modals = ["modalModifica", "modalCrea", "modalLettura", "modalConferma"];
        modals.forEach(id => {
            const el = document.getElementById(id);
            if (el)
                el.remove();
        });
    },
    confirm(message) {
        return new Promise((resolve) => {
            const html = `
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
            const btnAnnulla = document.getElementById("btnAnnullaConferma");
            const btnOk = document.getElementById("btnOkConferma");
            if (btnAnnulla)
                btnAnnulla.onclick = () => { this.close(); resolve(false); };
            if (btnOk)
                btnOk.onclick = () => { this.close(); resolve(true); };
        });
    }
};
//# sourceMappingURL=modal.js.map