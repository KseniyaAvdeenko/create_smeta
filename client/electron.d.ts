import {IMeasurement, IWork, IWorkBase, IWorkCategory, IWorkCategoryBase, IWorkMeasurement} from "./src/interface/ISmetaWorks";
import {IOrder, IOrderBase, IOrderWork, IOrderWorkBase, IOrderWorkQuantity, ISavedFile} from "./src/interface/ISmetaOrders";
import {Screen} from "./src/interface/IApp";

export type AuthUser = {
    id: number;
    username: string;
    email: string;
    isAdmin: boolean;
};

export type AuthResult = {
    success: boolean;
    user?: AuthUser;
    error?: string;
    rememberError?: string;
};

export type RememberedLogin = {
    login: string;
    password: string;
};

export type GdriveStatus = {
    connected: boolean;
    email?: string;
    defaultFolder?: string | null;
};

export type GdriveConnectResult = {
    success: boolean;
    email?: string;
    error?: string;
};

export type UserSettings = {
    id: number;
    userId: number;
    desktopMode: string;
};

export type ElectronApi = {
    captureRendererError: (message: string, stack?: string) => void;
    screen: () => Promise<Screen>
    dark: () => Promise<void>;
    light: () => Promise<void>;
    initial: () => Promise<boolean>;
    isOnline: () => Promise<boolean>;
    dbConnection: () => Promise<boolean>;
    login: (login: string, password: string, rememberLogin?: boolean) => Promise<AuthResult>;
    getRememberedLogin: () => Promise<RememberedLogin | null>;
    logout: () => Promise<{ success: boolean }>;
    getCurrentUser: () => Promise<AuthUser | null>;
    getProfile: () => Promise<AuthUser | null>;
    register: (userData: { username: string; email: string; password: string; isAdmin?: boolean }) => Promise<AuthResult>;
    hasUsers: () => Promise<boolean>;
    getUserSettings: () => Promise<UserSettings | null>;
    updateUserSettings: (data: Partial<UserSettings>) => Promise<UserSettings>;
    getGdriveStatus: () => Promise<GdriveStatus>;
    connectGdrive: () => Promise<GdriveConnectResult>;
    disconnectGdrive: () => Promise<{ success: boolean }>;
    setGdriveDefaultFolder: (folderId: string) => Promise<{ success: boolean; defaultFolder?: string; error?: string }>;
    //Measurements
    getAllMeasurements: () => Promise<IMeasurement[]>
    getMeasurementById: (id: number) => Promise<IMeasurement | null>;
    createMeasurement: (data: Partial<IMeasurement>) => Promise<IMeasurement | null>;
    updateMeasurement: (id: number, data: Partial<IMeasurement>) => Promise<IMeasurement | null>;
    deleteMeasurement: (id: number) => Promise<1 | 0>;
    //Work categories
    getAllWorkCategories: () => Promise<IWorkCategory[]>
    getWorkCategoryById: (id: number) => Promise<IWorkCategory>
    createWorkCategory: (data: IWorkCategoryBase) => Promise<IWorkCategory>
    updateWorkCategory: (id: number, data: IWorkCategoryBase) => Promise<IWorkCategory>
    deleteWorkCategory: (id: number) => Promise<1 | 0>;
    //works
    getAllWorks: () => Promise<IWork[] | null>
    getWorkById: (id: number) => Promise<IWork>
    getWorksByCategoriesId: (categoryId: number) => Promise<IWork[]>
    createWork: (data: IWorkBase) => Promise<IWork>
    updateWork: (id: number, data: IWorkBase) => Promise<IWork>
    deleteWork: (id: number) => Promise<1 | 0>;
    getWorkMeasurementsByWorkId: (workId: number) => Promise<IWorkMeasurement[]>;
    createWorkMeasurement: (data: Omit<IWorkMeasurement, 'id'>) => Promise<IWorkMeasurement>;
    updateWorkMeasurement: (id: number, data: Partial<IWorkMeasurement>) => Promise<IWorkMeasurement>;
    deleteWorkMeasurement: (id: number) => Promise<1 | 0>;
    //orders
    getAllOrders: () => Promise<IOrder[] | null>
    getOrderById: (id: number) => Promise<IOrder | null>
    createOrder: (data: IOrderBase) => Promise<IOrder>
    updateOrder: (id: number, data: IOrderBase) => Promise<IOrder>
    deleteOrder: (id: number) => Promise<1 | 0>;
    //order works
    getAllOrderWorks: () => Promise<IOrderWork[] | null>
    getAllOrderWorksByOrderId: (orderId: number) => Promise<IOrderWork[] | null>
    getOrderWorkById: (id: number) => Promise<IOrderWork | null>
    createOrderWork: (data: IOrderWorkBase) => Promise<IOrderWork>
    updateOrderWork: (id: number, data: IOrderWorkBase) => Promise<IOrderWork>
    deleteOrderWork: (id: number) => Promise<1 | 0>;
    getOrderWorkQuantitiesByOrderWorkId: (orderWorkId: number) => Promise<IOrderWorkQuantity[]>;
    createOrderWorkQuantity: (data: IOrderWorkQuantity & {orderWorkId: number}) => Promise<IOrderWorkQuantity>;
    updateOrderWorkQuantity: (id: number, data: Pick<IOrderWorkQuantity, 'measurement' | 'quantity'>) => Promise<IOrderWorkQuantity>;
    deleteOrderWorkQuantity: (id: number) => Promise<1 | 0>;
    // order files
    getAllOrderFiles: () => Promise<ISavedFile[]|null>
    getAllOrderFilesByOrderId: (orderId: number) => Promise<ISavedFile[]|null>
    getOrderFileById: (id: number) => Promise<ISavedFile|null>
    generateOrderFile: (order: IOrder, orderWorks: IOrderWork[]) => Promise<ISavedFile|null>
    deleteOrderFile: (id: number) => Promise<1 | 0>;
};

declare global {
    interface Window {
        electron: ElectronApi;
    }
}