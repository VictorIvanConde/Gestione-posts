import { evidenziaTesto } from "../../../shared/utils/helpers.js";
export const Table = {
    render(headers, rows, actions) {
        return `
            <table class="admin-table">
                <thead>
                    <tr>
                        ${headers.map(h => `<th>${h}</th>`).join("")}
                        ${actions ? '<th>Azioni</th>' : ""}
                    </tr>
                </thead>
                <tbody>
                    ${rows.map((row, i) => `
                        <tr>
                            ${row.map(cell => `<td>${cell}</td>`).join("")}
                            ${actions ? `<td><div class="actions">${actions(i)}</div></td>` : ""}
                        </tr>
                    `).join("")}
                </tbody>
            </table>
        `;
    },
    highlight(text, query) {
        return evidenziaTesto(String(text), query);
    }
};
//# sourceMappingURL=table.js.map