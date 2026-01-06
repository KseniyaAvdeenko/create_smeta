import {INotification} from "./IApp";
import {IMeasurement, IWork, IWorkCategory} from "./ISmetaWorks";
import {IOrder, IOrderWork, ISavedFile} from "./ISmetaOrders";

export interface ILoad {
    isLoading: boolean;
}

export interface ICreateDelete {
    isCreating: boolean;
    isDeleting: boolean;
}

export interface IUpdate {
    isUpdating: boolean;
}

export interface INTFInitial {
    notifications: INotification[];
}

export interface IMeasurementInitial extends ILoad, ICreateDelete {
    measurements: IMeasurement[] | null;
    measurement: IMeasurement | null;
}

export interface IWorkCategoryInitial extends ILoad, ICreateDelete, IUpdate {
    workCategories: IWorkCategory[] | null;
    workCategory: IWorkCategory | null;
}

export interface IWorkInitial extends ILoad, ICreateDelete, IUpdate {
    works: IWork[] | null;
    work: IWork | null;
}

export interface IOrderInitial extends ILoad, ICreateDelete, IUpdate {
    orders: IOrder[] | null;
    order: IOrder | null;
}

export interface IOrderWorksInitial extends ILoad, ICreateDelete, IUpdate {
    orderWorks: IOrderWork[] | null;
    orderWork: IOrderWork | null;
}

export interface IOrderFilesInitial extends ILoad, ICreateDelete {
    orderFiles: ISavedFile[] | null;
    orderFile: ISavedFile | null;
}