import {AppDispatch} from "../index";
import NtfAction from "./ntf.action";
import {orderWorksReducer} from "../reducers/orderWork.reducer";
import {IOrderWork, IOrderWorkBase, IOrderWorkQuantity} from "../../interface/ISmetaOrders";
import {IWork} from "../../interface/ISmetaWorks";
import {getOrderById} from "./order.action";
import {syncOrderWorkQuantities} from "./orderWorkQuantity.action";

const calcTotal = (quantities: IOrderWorkQuantity[], work?: IWork) =>
    quantities.reduce((sum, q) => {
        const price =
            work?.workMeasurements?.find(wm => wm.measurement?.shortName === q.measurement)?.cost ?? 0;
        return sum + q.quantity * price;
    }, 0);


export const getOrderWorks = () => async (dispatch: AppDispatch) => {
    try{
        dispatch(orderWorksReducer.actions.fetchOrderWorks());
        const resp = await window.electron.getAllOrderWorks();
        dispatch(orderWorksReducer.actions.loadOrderWorksSuccess(resp));
    }catch (e) {
        console.error(e)
        new NtfAction(dispatch).addNotification({message: 'Ошибка загрузки работ заказа (сметы)', type: 'error'});
        dispatch(orderWorksReducer.actions.loadOrderWorksFail());
    }
}

export const getOrderWorksByOrderId = (orderId: number) => async (dispatch: AppDispatch) =>{
    try{
        dispatch(orderWorksReducer.actions.fetchOrderWorks());
        const resp = await window.electron.getAllOrderWorksByOrderId(orderId);
        dispatch(orderWorksReducer.actions.loadOrderWorksOrderIdSuccess(resp));
    }catch (e) {
        console.error(e)
        new NtfAction(dispatch).addNotification({message: 'Ошибка загрузки работ заказа (сметы)', type: 'error'});
        dispatch(orderWorksReducer.actions.loadOrderWorksOrderIdFail());
    }
}

export const getOrderWorkById = (id: number) => async (dispatch: AppDispatch) =>{
    try{
        const resp = await window.electron.getOrderWorkById(id);
        dispatch(orderWorksReducer.actions.loadOrderWorkSuccess(resp));
    }catch (e) {
        console.error(e)
        new NtfAction(dispatch).addNotification({message: 'Ошибка загрузки работы заказа (сметы)', type: 'error'});
        dispatch(orderWorksReducer.actions.loadOrderWorkFail());
    }
}

export const createOrderWork = (data: IOrderWorkBase) => async (dispatch: AppDispatch) =>{
    try{
        dispatch(orderWorksReducer.actions.startCreating());
        const resp = await window.electron.createOrderWork(data);
        dispatch(orderWorksReducer.actions.createOrderWorkSuccess(resp));
        new NtfAction(dispatch).addNotification({message: `Работа заказа (сметы) создана`, type: 'success'});
    }catch (e) {
        console.error(e)
        dispatch(orderWorksReducer.actions.createOrderWorkFail());
        new NtfAction(dispatch).addNotification({message: `Ошибка создания работы заказа (сметы)`, type: 'error'});
    }
}

export const updateOrderWork = (id: number, data: IOrderWorkBase) => async (dispatch: AppDispatch) =>{
    try{
        dispatch(orderWorksReducer.actions.startUpdating());
        const resp = await window.electron.updateOrderWork(id, data);
        dispatch(orderWorksReducer.actions.updateOrderWorkSuccess(resp));
        new NtfAction(dispatch).addNotification({message: `Работа заказа (сметы) ${id} изменена`, type: 'success'});
    }catch (e) {
        console.error(e)
        dispatch(orderWorksReducer.actions.updateOrderWorkFail());
        new NtfAction(dispatch).addNotification({message: `Ошибка изменения работы заказа (сметы)`, type: 'error'});
    }
}

export const deleteOrderWork = (id: number, orderId?: number) => async (dispatch: AppDispatch) =>{
    try{
        dispatch(orderWorksReducer.actions.startDeleting());
        const resp = await window.electron.deleteOrderWork(id);
        if(Boolean(resp)) dispatch(orderWorksReducer.actions.deleteOrderWorkSuccess(id));
        if (orderId) dispatch(getOrderById(orderId));
        new NtfAction(dispatch).addNotification({message: `Работа заказа (сметы) ${id} удалена`, type: 'success'});
    }catch (e) {
        console.error(e)
        dispatch(orderWorksReducer.actions.deleteOrderWorkFail());
        new NtfAction(dispatch).addNotification({message: `Ошибка удаления работы заказа (сметы) ${id}`, type: 'error'});
    }
}

export const addOrderWorkWithQuantities = (
    orderId: number,
    work: IWork,
    rows: {measurement: string; quantity: number}[],
) => async (dispatch: AppDispatch) => {
    try {
        dispatch(orderWorksReducer.actions.startCreating());
        const quantities: IOrderWorkQuantity[] = rows
            .filter(r => r.measurement && r.quantity > 0)
            .map(r => ({measurement: r.measurement, quantity: r.quantity}));
        const total = calcTotal(quantities, work);
        const created = await window.electron.createOrderWork({orderId, workId: work.id, total});

        for (const q of quantities) {
            await window.electron.createOrderWorkQuantity({
                orderWorkId: created.id,
                measurement: q.measurement,
                quantity: q.quantity,
            });
        }

        dispatch(orderWorksReducer.actions.createOrderWorkSuccess(created));
        dispatch(getOrderById(orderId));
        new NtfAction(dispatch).addNotification({message: 'Работа добавлена в смету', type: 'success'});
    } catch (e) {
        console.error(e);
        dispatch(orderWorksReducer.actions.createOrderWorkFail());
        new NtfAction(dispatch).addNotification({message: 'Ошибка добавления работы', type: 'error'});
    }
};

export const updateOrderWorkWithQuantities = (
    orderId: number,
    orderWork: IOrderWork,
    rows: {id?: number; measurement: string; quantity: number}[],
    options?: {silent?: boolean},
) => async (dispatch: AppDispatch) => {
    try {
        const quantities: IOrderWorkQuantity[] = rows
            .filter(r => r.measurement && r.quantity > 0)
            .map(r => ({id: r.id, measurement: r.measurement, quantity: r.quantity}));
        const total = calcTotal(quantities, orderWork.work);
        await window.electron.updateOrderWork(orderWork.id, {
            orderId: orderWork.orderId,
            workId: orderWork.workId,
            total,
        });
        await dispatch(
            syncOrderWorkQuantities(
                orderId,
                orderWork.id,
                rows,
                orderWork.orderWorkQuantities ?? [],
                options,
            ),
        );
    } catch (e) {
        console.error(e);
        new NtfAction(dispatch).addNotification({message: 'Ошибка сохранения работы', type: 'error'});
    }
};