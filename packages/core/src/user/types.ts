export type UserStatus =
    | "ACTIVE"
    | "INACTIVE"
    | "PENDING";

export interface Role {
    id: string;
    name: string;
}

export interface User {
    id: string;
    username: string;
    fullName: string;
    status: UserStatus;
    roles: Role[];
}