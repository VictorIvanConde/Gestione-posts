export const API_URL = "http://127.0.0.1:3000";
export async function apiFetch(endpoint, options) {
    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...options?.headers,
        },
    });
    if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
    }
    return response.json();
}
//# sourceMappingURL=api.js.map