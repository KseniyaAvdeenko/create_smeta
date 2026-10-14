export interface IWorkCategoryBase {
    name: string;
}

export interface IWorkCategory extends IWorkCategoryBase {
    id: number;
    userId?: number;
    works?: IWork[];
}

export interface IMeasurement {
    id: number;
    shortName: string;
    fullName?: string;
}

export interface IWorkMeasurement {
    id?: number;
    workId?: number;
    measurementId: number;
    cost: number;
    measurement?: IMeasurement;
}

export interface IWorkBase {
    name: string;
    categoryId: number;
    workMeasurements?: IWorkMeasurement[];
}

export interface IWork extends IWorkBase {
    id: number;
    userId?: number;
    category?: IWorkCategory;
}
