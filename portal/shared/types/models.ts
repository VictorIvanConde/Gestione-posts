// definisco le interfacce per i dati principali del portale
// servono per avere il controllo sui tipi in tutto il progetto

// struttura di un articolo del blog
export interface Post {
    userId: number;
    id: number | string;
    title: string;
    body: string;
    isActive?: boolean;
}

// dati di un utente registrato
export interface Utente {
    id: number | string;
    name: string;
    username?: string;
    email: string;
    roleId?: number;
    isActive?: boolean;
}

// tipi di permessi disponibili nel sistema
export interface Role {
    id: number | string;
    name: string;
    isActive: boolean;
}

// struttura di un commento lasciato sotto un post
export interface Commento {
    postId: number;
    id: number | string;
    name: string;
    email: string;
    body: string;
    isActive?: boolean;
}
