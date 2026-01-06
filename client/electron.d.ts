import {IMeasurement, IWork, IWorkBase, IWorkCategory, IWorkCategoryBase} from "./src/interface/ISmetaWorks";
import {IOrder, IOrderBase, IOrderWork, IOrderWorkBase} from "./src/interface/ISmetaOrders";

export type ElectronApi = {
    screen: () => Promise<{ width: number, height: number }>
    dark: () => Promise<void>;
    light: () => Promise<void>;
    initial: () => Promise<boolean>;
    isOnline: () => Promise<boolean>;
    //Measurements
    getAllMeasurements: () => Promise<IMeasurement[]>
    getMeasurementById: (id: string) => Promise<IMeasurement | null>;
    createMeasurement: (data: IMeasurement) => Promise<IMeasurement | null>;
    deleteMeasurement: (id: string) => Promise<1 | 0>;
    //Work categories
    getAllWorkCategories: () => Promise<IWorkCategory[]>
    getWorkCategoryById: (id: number) => Promise<IWorkCategory>
    createWorkCategory: (data: IWorkCategoryBase) => Promise<IWorkCategory>
    updateWorkCategory: (id: number, data: IWorkCategoryBase) => Promise<IWorkCategory>
    deleteWorkCategory: (id: number) => Promise<boolean>
    //works
    getAllWorks: () => Promise<IWork[] | null>
    getWorkById: (id: number) => Promise<IWork>
    getWorksByCategoriesId: (categoryId: number) => Promise<IWork[]>
    createWork: (data: IWorkBase) => Promise<IWork>
    updateWork: (id: number, data: IWorkBase) => Promise<IWork>
    deleteWork: (id: number) => Promise<boolean>
    //orders
    getAllOrders: () => Promise<IOrder[] | null>
    getOrderById: (id: number) => Promise<IOrder | null>
    createOrder: (data: IOrderBase) => Promise<IOrder>
    updateOrder: (id: number, data: IOrderBase) => Promise<IOrder>
    deleteOrder: (id: number) => Promise<boolean>
    //order works
    getAllOrderWorks: () => Promise<IOrderWork[]|null>
    getAllOrderWorksByOrderId: (orderId: number) => Promise<IOrderWork[]|null>
    getOrderWorkById: (id: number) => Promise<IOrderWork|null>
    createOrderWork: (data: IOrderWorkBase) => Promise<IOrderWork>
    updateOrderWork: (id: number, data: IOrderWorkBase) => Promise<IOrderWork>
    deleteOrderWork: (id: number) => Promise<boolean>

};

declare global {
    interface Window {
        electron: ElectronApi;
    }
}