export type ElectronApi = {
};

declare global {
    interface Window {
        electron: ElectronApi;
    }
}