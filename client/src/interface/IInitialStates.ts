import {INotification} from "./IApp";
import {IMeasurement, IWork, IWorkCategory} from "./ISmetaWorks";

export interface INTFInitial {
    notifications: INotification[];
}

export interface IMeasurementInitial{
    measurements: IMeasurement[]|null
    isLoading: boolean;
    isCreating: boolean;
    isUpdating: boolean;
    isDeleting: boolean;
}

export interface IWorkInitial{
    works: IWork[]|null;
    isLoading: boolean;
    isCreating: boolean;
    isUpdating: boolean;
    isDeleting: boolean;
}
export interface IWorkCategoryInitial{
    workCategories: IWorkCategory[]|null;
    isLoading: boolean;
    isCreating: boolean;
    isUpdating: boolean;
    isDeleting: boolean;
}