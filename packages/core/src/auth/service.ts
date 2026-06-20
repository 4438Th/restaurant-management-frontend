import { apiFetch } from "@/http";
import type {
    AuthenticationResponse,
    LoginRequest,
} from "./types";

import type { ApiResponse } from "../common/types";

export async function login(
    payload: LoginRequest,
) {
    return apiFetch<
        ApiResponse<AuthenticationResponse>
    >("/auth/login", {
        method: "POST",
        body: JSON.stringify(payload),
    });
}