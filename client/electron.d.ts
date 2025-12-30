export type ElectronApi = {
    screen: () => Promise<{ width: number, height: number }>
    dark: () => Promise<void>;
    light: () => Promise<void>;
    initial: () => Promise<boolean>;
    isOnline: () => Promise<boolean>;
    getAllMeasurements: () => Promise<any>
    getByIdMeasurement: (id: string) => Promise<any>
    createMeasurement: (data: any) => Promise<any>
    updateMeasurements: (id: string) => Promise<any>
    deleteMeasurements: (id: string) => Promise<any>
};

declare global {
    interface Window {
        electron: ElectronApi;
    }
}