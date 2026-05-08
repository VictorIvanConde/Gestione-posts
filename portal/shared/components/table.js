// componente per generare tabelle html in modo automatico
// riceve le intestazioni e i dati e restituisce il markup
import { evidenziaTesto } from "../utils/helpers.js";
export const Table = {
    render(headers, rows, actions) {
        return `
            <table class="tabella-dati">
                <thead>
                    <tr>
                        ${headers.map((h) => `<th>${h}</th>`).join("")}
                        ${actions ? "<th>Azioni</th>" : ""}
                    </tr>
                </thead>
                <tbody>
                    ${rows.map((row, i) => `
                        <tr>
                            ${row.map((cell) => `<td>${cell}</td>`).join("")}
                            ${actions ? `<td><div class="actions">${actions(i)}</div></td>` : ""}
                        </tr>
                    `).join("")}
                </tbody>
            </table>
        `;
    },
    // funzione di comodo per evidenziare il testo cercato nelle celle
    highlight(text, query) {
        return evidenziaTesto(String(text), query);
    }
};
