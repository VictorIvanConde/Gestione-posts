// componente per generare tabelle html in modo automatico
// riceve le intestazioni e i dati e restituisce il markup

import { evidenziaTesto } from "../utils/helpers.js";

export const Table = {
    render(headers: string[], rows: (string | number)[][], actions?: (rowIndex: number) => string): string {
        return `
            <table class="tabella-dati">
                <thead>
                    <tr>
                        ${headers.map((h: string) => `<th>${h}</th>`).join("")}
                        ${actions ? "<th>Azioni</th>" : ""}
                    </tr>
                </thead>
                <tbody>
                    ${rows.map((row: (string | number)[], i: number) => `
                        <tr>
                            ${row.map((cell: string | number) => `<td>${cell}</td>`).join("")}
                            ${actions ? `<td><div class="actions">${actions(i)}</div></td>` : ""}
                        </tr>
                    `).join("")}
                </tbody>
            </table>
        `;
    },

    // funzione di comodo per evidenziare il testo cercato nelle celle
    highlight(text: string | number, query: string): string {
        return evidenziaTesto(String(text), query);
    }
};
