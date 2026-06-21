export interface UserCreateRequest {
    username: string;
    password?: string;
    fullName: string;
    roles: string[];
}

export interface UserUpdateRequest {
    password?: string;
    fullName: string;
}

export interface AssignRolesRequest {
    user: string; // user id
    roles: string[];
}

export interface RemoveRolesRequest {
    user: string; // user id
    roles: string[];
}