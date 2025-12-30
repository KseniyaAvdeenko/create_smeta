export type NTFTypes = 'error'|'success'| 'warning'
export interface INotification {
    id: number;
    message: string;
    type: NTFTypes
}
export type Theme = 'light' | 'dark';

export interface IApp {
    screen: {width: number, height: number}
    currentMode: Theme | '';
    isConnected: boolean;
    delimiter: number
}