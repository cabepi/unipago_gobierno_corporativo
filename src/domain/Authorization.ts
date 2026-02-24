export interface Authorization {
    id: string;
    userId: string;
    resource: string;
    action: 'read' | 'write' | 'delete' | 'execute';
    grantedAt: string;
}
