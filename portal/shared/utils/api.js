// configurazione base per le chiamate al server
export const API_URL = "http://localhost:3000";
// funzione generica per scaricare o inviare dati al database
export async function apiFetch(endpoint, options) {
    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...options?.headers,
        },
    });
    // se il server risponde con un errore blocco tutto
    if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
    }
    // restituisco il risultato convertito in oggetto javascript
    return response.json();
}
