export interface MenuPermission {
    menuKey: string;
    canRead: boolean;
    canWrite: boolean;
}

export interface User {
    id: string;
    email: string;
    name: string;
    role: string;
    roleCode?: string;
    permissions?: MenuPermission[];
    createdAt?: string;
    updatedAt?: string;
}
