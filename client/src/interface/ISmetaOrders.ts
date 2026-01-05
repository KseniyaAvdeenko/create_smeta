export interface IOrderBase {
    name: string;
    client: string;
    date: string;
    works?:IOrderWork[]
    files?: ISavedFile[]
}

export interface IOrder extends IOrderBase {
    id: number
}

export interface IMeasureQuantity {
    measurement: string,
    quantity: number
}

export interface IOrderWorkBase {
    workId: number,
    orderId: number,
    measureQuantities: IMeasureQuantity[]
}

export interface IOrderWork extends IOrderBase {
    id: number,
}

export interface ISavedFileBase{
    id: number
}

export interface ISavedFile extends ISavedFileBase{
    orderId: number;
    name: string;
    date: string;
}