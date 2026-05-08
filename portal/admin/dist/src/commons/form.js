export const Form = {
    renderInput(label, id, type = "text", value = "", placeholder = "") {
        return `
            <label style="display:block; margin-bottom:5px; font-size:0.8rem; color:#aaa;">${label}</label>
            <input type="${type}" id="${id}" value="${value}" placeholder="${placeholder}">
        `;
    },
    renderTextarea(label, id, value = "", rows = 4, placeholder = "") {
        return `
            <label style="display:block; margin-bottom:5px; font-size:0.8rem; color:#aaa;">${label}</label>
            <textarea id="${id}" rows="${rows}" placeholder="${placeholder}">${value}</textarea>
        `;
    },
    renderSelect(label, id, options, selectedValue = "") {
        return `
            <label style="display:block; margin-bottom:5px; font-size:0.8rem; color:#aaa;">${label}</label>
            <select id="${id}" style="width: 100%; padding: 10px; background: #252525; border: 1px solid #3a3a3a; border-radius: 6px; color: #e0e0e0; margin-bottom: 15px;">
                ${options.map(opt => `
                    <option value="${opt.value}" ${opt.value === selectedValue ? 'selected' : ''}>${opt.label}</option>
                `).join("")}
            </select>
        `;
    },
    getData(ids) {
        const data = {};
        ids.forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                data[id] = el.value;
            }
        });
        return data;
    }
};
//# sourceMappingURL=form.js.map