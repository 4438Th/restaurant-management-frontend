import { httpClient } from "../../http";

export async function getEmployees() {
    const response = await httpClient.get("/employees");

    return response.data;
}