export declare function api<T>(url: string): Promise<T>;
/** Evidenzia testo */
export declare function evidenziaTesto(testo: string, query: string): string;
/** Helper per attesa */
export declare function attendi(ms: number): Promise<void>;
