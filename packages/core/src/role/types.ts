export interface Role {
    name: string;
    description: string;
    permissions: string[];

    createdAt?: string;
    updatedAt?: string;
}