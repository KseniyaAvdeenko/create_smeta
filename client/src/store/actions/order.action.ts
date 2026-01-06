import {AppDispatch} from "../index";
import NtfAction from "./ntf.action";
import {orderReducer} from "../reducers/order.reducer";
import {IOrderBase} from "../../interface/ISmetaOrders";

export const getOrders = () => async (dispatch: AppDispatch) => {
    try{
        dispatch(orderReducer.actions.fetchOrders());
        const resp = await window.electron.getAllOrders();
        dispatch(orderReducer.actions.loadOrdersSuccess(resp));
    }catch (e) {
        new NtfAction(dispatch).addNotification({message: 'Ошибка загрузки заказов (смет): '+ e.message, type: 'error'});
        dispatch(orderReducer.actions.loadOrdersFail());
    }
}

export const getOrderById = (id: number) => async (dispatch: AppDispatch) =>{
    try{
        const resp = await window.electron.getOrderById(id);
        dispatch(orderReducer.actions.loadOrderSuccess(resp));
    }catch (e) {
        new NtfAction(dispatch).addNotification({message: 'Ошибка загрузки заказа (сметы): '+ e.message, type: 'error'});
        dispatch(orderReducer.actions.loadOrderFail());
    }
}

export const createOrder = (data: IOrderBase) => async (dispatch: AppDispatch) =>{
    try{
        dispatch(orderReducer.actions.startCreating());
        const resp = await window.electron.createOrder(data);
        dispatch(orderReducer.actions.createOrderSuccess(resp));
        new NtfAction(dispatch).addNotification({message: `Заказ (смета) создана`, type: 'success'});
    }catch (e) {
        dispatch(orderReducer.actions.createOrderFail());
        new NtfAction(dispatch).addNotification({message: `Ошибка создания заказа (сметы): `+ e.message, type: 'error'});
    }
}

export const updateOrder = (id: number, data: IOrderBase) => async (dispatch: AppDispatch) =>{
    try{
        dispatch(orderReducer.actions.startUpdating());
        const resp = await window.electron.updateOrder(id, data);
        dispatch(orderReducer.actions.updateOrderSuccess(resp));
        new NtfAction(dispatch).addNotification({message: `Заказ (смета) ${id} изменена`, type: 'success'});
    }catch (e) {
        dispatch(orderReducer.actions.updateOrderFail());
        new NtfAction(dispatch).addNotification({message: `Ошибка изменения заказа (сметы): `+ e.message, type: 'error'});
    }
}

export const deleteOrder = (id: number) => async (dispatch: AppDispatch) =>{
    try{
        dispatch(orderReducer.actions.startDeleting());
        const resp = await window.electron.deleteOrder(id);
        if(Boolean(resp)) dispatch(orderReducer.actions.deleteOrderSuccess(id));
        new NtfAction(dispatch).addNotification({message: `Заказ (смета) ${id} удалена`, type: 'success'});
    }catch (e) {
        dispatch(orderReducer.actions.deleteOrderFail());
        new NtfAction(dispatch).addNotification({message: `Ошибка удаления заказа (сметы) ${id}: `+ e.message, type: 'error'});
    }
}