export type AuthUser = {
    id: number;
    username: string;
    email: string;
    isAdmin: boolean;
};

export interface IAuthInitial {
    user: AuthUser | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    needsRegister: boolean;
    error: string | null;
}

export interface GdriveStatus {
    connected: boolean;
    email?: string;
    defaultFolder?: string | null;
}

export interface UserSettings {
    id: number;
    userId: number;
    desktopMode: string;
}
