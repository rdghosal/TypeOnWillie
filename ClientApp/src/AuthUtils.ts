import jwtDecode from 'jwt-decode';

const NAMEIDENTIFIER = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier";
const NAME = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name";

export interface ITokenPayload {
    iat: number,
    exp: number,
    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier": string,
    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name": string
}

export interface UserCredentials {
    username: string,
    password: string
}

export interface AuthResponse {
    accessToken: string
}

export enum AuthErrorTypes {
    INVALID,
    EXPIRED
}

export interface User {
    id: string;
    username?: string;
    age?: number;
    highestEducation?: string;
    nationality?: string;
}

export class TokenHandler {

    public static async getToken(userCredentials? : UserCredentials) : Promise<string> {        
        const response = await fetch("/api/login", {
            headers: { "Content-Type" : "application/json" },
            method: "POST",
            body: JSON.stringify(userCredentials)
        });
                                        
        if (!response.ok) return "";

        const data = await response.json() as AuthResponse;
        return data.accessToken;
    }

    public static getAuthHeader(token: string) : Object|null {
        // Check if bearer is valid
        const bearer = (this.isExpired(token)) ? this.refreshAccessToken() : token;
        if (!bearer) return null;

        return {"Authorization": `Bearer ${bearer}`};
    }

    public static parseClaims(token: string): User {
        const decoded = jwtDecode<ITokenPayload>(token);
        return { 
            username: decoded[NAME], 
            id: decoded[NAMEIDENTIFIER] 
        };
    }

    public static isExpired(token: string) : boolean {
        // Check whether token is expired
        if (token) {
            return jwtDecode<ITokenPayload>(token).exp > (new Date().getTime() / 1000); 
        }
        return false;
    }

    public static async refreshAccessToken() {
        // Check whether refreshToken still valid
        const response = await fetch("/api/token/refresh", {
            headers: { "Content-Type" : "application/json" },
            method: "POST"
        });

        if (response.status === 400) return AuthErrorTypes.EXPIRED;
        else if (response.status === 403) return AuthErrorTypes.INVALID;

        const data = await response.json() as AuthResponse;
        return data.accessToken;
    }
}