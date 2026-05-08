// utilità per creare e gestire i form nel portale
// serve per generare input, select e recuperare i dati inseriti dall'utente
export const Form = {
    // genero il markup per un campo di testo semplice
    renderInput(label, id, type = "text", value = "", placeholder = "") {
        return `
            <label style="display:block; margin-bottom:5px; font-size:0.8rem; color:#aaa;">${label}</label>
            <input type="${type}" id="${id}" value="${value}" placeholder="${placeholder}">
            <span id="err-${id}" class="form-error" style="display:none; color:#ff4d4d; font-size:0.75rem; margin-top:-10px; margin-bottom:10px;"></span>
        `;
    },
    // genero il markup per un'area di testo più grande
    renderTextarea(label, id, value = "", rows = 4, placeholder = "") {
        return `
            <label style="display:block; margin-bottom:5px; font-size:0.8rem; color:#aaa;">${label}</label>
            <textarea id="${id}" rows="${rows}" placeholder="${placeholder}">${value}</textarea>
        `;
    },
    // genero una lista a discesa (select)
    renderSelect(label, id, options, selectedValue = "") {
        return `
            <label style="display:block; margin-bottom:5px; font-size:0.8rem; color:#aaa;">${label}</label>
            <select id="${id}" style="width: 100%; padding: 10px; background: #252525; border: 1px solid #3a3a3a; border-radius: 6px; color: #e0e0e0; margin-bottom: 15px;">
                ${options.map((opt) => `
                    <option value="${opt.value}" ${opt.value === selectedValue ? 'selected' : ''}>${opt.label}</option>
                `).join("")}
            </select>
        `;
    },
    // leggo i valori inseriti in tutti i campi del form
    getData(ids) {
        const data = {};
        ids.forEach((id) => {
            const el = document.getElementById(id);
            if (el && (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement || el instanceof HTMLSelectElement)) {
                data[id] = el.value;
            }
        });
        return data;
    },
    // mostro un messaggio di errore sotto il campo specifico
    showError(id, message) {
        const errEl = document.getElementById(`err-${id}`);
        const inputEl = document.getElementById(id);
        if (errEl) {
            errEl.textContent = message;
            errEl.style.display = "block";
        }
        if (inputEl) {
            inputEl.style.borderColor = "#ff4d4d";
            inputEl.focus();
        }
    },
    // pulisco tutti i messaggi di errore e i bordi rossi
    clearErrors(ids) {
        ids.forEach((id) => {
            const errEl = document.getElementById(`err-${id}`);
            const inputEl = document.getElementById(id);
            if (errEl) {
                errEl.style.display = "none";
                errEl.textContent = "";
            }
            if (inputEl) {
                inputEl.style.borderColor = "";
            }
        });
    }
};
//# sourceMappingURL=form.js.map