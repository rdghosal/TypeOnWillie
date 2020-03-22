import jwtDecode from 'jwt-decode';

export interface ITokenPayload {
    iat: number,
    exp: number,
    sub: string,
    name: string
}

export interface UserCredentials {
    username: string,
    password: string
}

export interface AuthResponse {
    accessToken: string
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
        const claims = jwtDecode<ITokenPayload>(token);
        return { 
            username: claims.name, 
            id: claims.sub 
        };
    }

    public static isExpired(token: string) : boolean {
        // Check whether token is expired
        if (token) {
            return jwtDecode<ITokenPayload>(token).exp > (new Date().getTime() / 1000); 
        }
        return false;
    }

    public static async refreshAccessToken() : Promise<string> {
        // Check whether refreshToken still valid
        if (!document.cookie) return ""

        const response = await fetch("/api/token/refresh", {
            headers: { "Content-Type" : "application/json" },
            method: "POST"
        });

        // Cache new access token and return
        const data = await response.json() as AuthResponse;
        return data.accessToken;
    }
}