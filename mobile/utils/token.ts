import { jwtDecode } from "jwt-decode"

export const isTokenValid = (token: string | null): boolean => {
    if (!token) return false;

    try {
        const decoded: any = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        return decoded.exp && decoded.exp > currentTime;
    } catch {
        return false;
    }
};
