export type ElectronApi = {
    screen: () => Promise<{ width: number, height: number }>
    dark: () => Promise<void>;
    light: () => Promise<void>;
    initial: () => Promise<boolean>;
    isOnline: () => Promise<boolean>;
};

declare global {
    interface Window {
        electron: ElectronApi;
    }
}