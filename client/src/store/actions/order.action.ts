import {AppDispatch} from "../index";
import NtfAction from "./ntf.action";
import {orderReducer} from "../reducers/order.reducer";
import {IOrder, IOrderBase} from "../../interface/ISmetaOrders";

export const getOrders = () => async (dispatch: AppDispatch) => {
    try{
        dispatch(orderReducer.actions.fetchOrders());
        const resp = await window.electron.getAllOrders();
        dispatch(orderReducer.actions.loadOrdersSuccess(resp));
    }catch (e) {
        console.error(e)
        new NtfAction(dispatch).addNotification({message: 'Ошибка загрузки заказов (смет)', type: 'error'});
        dispatch(orderReducer.actions.loadOrdersFail());
    }
}

export const getOrderById = (id: number) => async (dispatch: AppDispatch) =>{
    try{
        const resp = await window.electron.getOrderById(id);
        if(resp) dispatch(orderReducer.actions.loadOrderSuccess(resp));
    }catch (e) {
        console.error(e)
        new NtfAction(dispatch).addNotification({message: 'Ошибка загрузки заказа (сметы)', type: 'error'});
        dispatch(orderReducer.actions.loadOrderFail());
    }
}

export const createOrder = (data: IOrderBase) => async (dispatch: AppDispatch) => {
    try{
        dispatch(orderReducer.actions.startCreating());
        const resp = await window.electron.createOrder(data);
        dispatch(orderReducer.actions.createOrderSuccess(resp));
        new NtfAction(dispatch).addNotification({message: `Заказ (смета) создана`, type: 'success'});
        return resp;
    }catch (e) {
        console.error(e)
        dispatch(orderReducer.actions.createOrderFail());
        new NtfAction(dispatch).addNotification({message: `Ошибка создания заказа (сметы)`, type: 'error'});
        return null;
    }
}

export const updateOrder = (id: number, data: IOrderBase) => async (dispatch: AppDispatch) =>{
    try{
        dispatch(orderReducer.actions.startUpdating());
        await window.electron.updateOrder(id, data);
        const refreshed = await window.electron.getOrderById(id);
        if (refreshed) {
            dispatch(orderReducer.actions.loadOrderSuccess(refreshed));
        }
        dispatch(orderReducer.actions.updateOrderSuccess(refreshed ?? ({id, ...data} as IOrder)));
        new NtfAction(dispatch).addNotification({message: `Заказ (смета) ${id} изменена`, type: 'success'});
    }catch (e) {
        console.error(e)
        dispatch(orderReducer.actions.updateOrderFail());
        new NtfAction(dispatch).addNotification({message: `Ошибка изменения заказа (сметы)`, type: 'error'});
    }
}

export const deleteOrder = (id: number) => async (dispatch: AppDispatch) =>{
    try{
        dispatch(orderReducer.actions.startDeleting());
        const resp = await window.electron.deleteOrder(id);
        if(Boolean(resp)) dispatch(orderReducer.actions.deleteOrderSuccess(id));
        new NtfAction(dispatch).addNotification({message: `Заказ (смета) ${id} удалена`, type: 'success'});
    }catch (e) {
        console.error(e)
        dispatch(orderReducer.actions.deleteOrderFail());
        new NtfAction(dispatch).addNotification({message: `Ошибка удаления заказа (сметы) ${id}`, type: 'error'});
    }
}