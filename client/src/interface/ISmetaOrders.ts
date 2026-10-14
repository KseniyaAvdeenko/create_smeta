export interface IOrderBase {
    name: string;
    client?: string;
}

export interface IOrder extends IOrderBase {
    id: number;
    createdBy?: number;
    createdAt?: string;
    updatedAt?: string;
    orderWorks?: IOrderWork[];
    savedOrderFiles?: ISavedFile[];
}

export interface IOrderWorkQuantity {
    id?: number;
    orderWorkId?: number;
    measurement: string;
    quantity: number;
}

export interface IOrderWorkBase {
    workId: number;
    orderId: number;
    total?: number;
    orderWorkQuantities?: IOrderWorkQuantity[];
}

export interface IOrderWork extends IOrderWorkBase {
    id: number;
    work?: import('./ISmetaWorks').IWork;
}

export interface ISavedFile {
    id: number;
    orderId: number;
    name: string;
    weblink: string;
    gdriveFileId?: string | null;
    createdBy?: number;
    createdAt?: string;
}
