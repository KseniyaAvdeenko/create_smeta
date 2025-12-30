export interface IWorkCategory{
    name: string
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
    category: string;
    isDefault: boolean;
    workMeasurements: IWorkMeasurement[]
}

export interface IWork extends IWorkBase{
    id: number
}