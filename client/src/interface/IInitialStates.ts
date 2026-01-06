import {INotification} from "./IApp";
import {IMeasurement, IWork, IWorkCategory} from "./ISmetaWorks";
import {IOrder, IOrderWork} from "./ISmetaOrders";

export interface INTFInitial {
    notifications: INotification[];
}

export interface IMeasurementInitial{
    measurements: IMeasurement[]|null;
    measurement: IMeasurement|null;
    isLoading: boolean;
    isCreating: boolean;
    isDeleting: boolean;
}

export interface IWorkCategoryInitial{
    workCategories: IWorkCategory[]|null;
    workCategory: IWorkCategory|null;
    isLoading: boolean;
    isCreating: boolean;
    isUpdating: boolean;
    isDeleting: boolean;
}
export interface IWorkInitial{
    works: IWork[]|null;
    work: IWork|null;
    isLoading: boolean;
    isCreating: boolean;
    isUpdating: boolean;
    isDeleting: boolean;
}

export interface IOrderInitial{
    orders: IOrder[]|null;
    order: IOrder|null;
    isLoading: boolean;
    isCreating: boolean;
    isUpdating: boolean;
    isDeleting: boolean;
}

export interface IOrderWorksInitial{
    orderWorks: IOrderWork[]|null;
    orderWork: IOrderWork|null;
    isLoading: boolean;
    isCreating: boolean;
    isUpdating: boolean;
    isDeleting: boolean;
}