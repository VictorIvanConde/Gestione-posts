export interface User {
    id: number | string;
    name: string;
    username?: string;
    email: string;
    roleId: number | string;
    isActive?: boolean;
}

export interface Role {
    id: number | string;
    name: string;
    isActive?: boolean;
}
