export interface IWorkCategoryBase {
    name: string
}
export interface IWorkCategory extends IWorkCategoryBase{
    id: number
}

export interface IMeasurement{
    id: string
}

export interface IWorkMeasurement{
    measurement:string,
    cost: number
}

export interface IWorkBase{
    name: string;
    categoryId: number;
    isDefault: boolean;
    workMeasurements: IWorkMeasurement[]
}

export interface IWork extends IWorkBase{
    id: number
}