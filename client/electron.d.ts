import {IMeasurement} from "./src/interface/ISmetaWorks";

export type ElectronApi = {
    screen: () => Promise<{ width: number, height: number }>
    dark: () => Promise<void>;
    light: () => Promise<void>;
    initial: () => Promise<boolean>;
    isOnline: () => Promise<boolean>;
    getAllMeasurements: () => Promise<any>
    getByIdMeasurement: (id: string) => Promise<IMeasurement | null>;
    createMeasurement: (data: IMeasurement) => Promise<IMeasurement | null>;
    deleteMeasurement: (id: string) => Promise<1 | 0>;
    getAllWorkCategories: () => Promise<any>
    getByIdWorkCategories: () => Promise<any>
    createWorkCategories: () => Promise<any>
    updateWorkCategories: () => Promise<any>
    deleteWorkCategories: () => Promise<any>
};

declare global {
    interface Window {
        electron: ElectronApi;
    }
}