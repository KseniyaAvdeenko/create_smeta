export type NTFTypes = 'error' | 'success' | 'warning'

export interface INotification {
    id: number;
    message: string;
    type: NTFTypes
}

export type Theme = 'light' | 'dark';

export type Screen = { width: number, height: number }

export interface IApp {
    screen: Screen;
    currentMode: Theme | '';
    isConnected: boolean;
    delimiter: number
}

export interface ILink {
    path: string,
    bg: string,
    name: string,
    icon: Function
}