import axios from "axios";

export const API_BASE =
    import.meta.env.VITE_API_BASE || "https://cache2k25-backend.onrender.com";

export const api = axios.create({ baseURL: `${API_BASE}/api` });

export function setAuth(token) {
    if (token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
        delete api.defaults.headers.common["Authorization"];
    }
}
