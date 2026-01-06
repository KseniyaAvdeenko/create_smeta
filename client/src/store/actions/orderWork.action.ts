import {AppDispatch} from "../index";
import NtfAction from "./ntf.action";
import {orderWorksReducer} from "../reducers/orderWork.reducer";
import {IOrderWorkBase} from "../../interface/ISmetaOrders";


export const getOrderWorks = () => async (dispatch: AppDispatch) => {
    try{
        dispatch(orderWorksReducer.actions.fetchOrderWorks());
        const resp = await window.electron.getAllOrderWorks();
        dispatch(orderWorksReducer.actions.loadOrderWorksSuccess(resp));
    }catch (e) {
        new NtfAction(dispatch).addNotification({message: 'Ошибка загрузки работ заказа (сметы): '+ e.message, type: 'error'});
        dispatch(orderWorksReducer.actions.loadOrderWorksFail());
    }
}

export const getOrderWorksByOrderId = (orderId: number) => async (dispatch: AppDispatch) =>{
    try{
        dispatch(orderWorksReducer.actions.fetchOrderWorks());
        const resp = await window.electron.getAllOrderWorksByOrderId(orderId);
        dispatch(orderWorksReducer.actions.loadOrderWorksOrderIdSuccess(resp));
    }catch (e) {
        new NtfAction(dispatch).addNotification({message: 'Ошибка загрузки работ заказа (сметы): '+ e.message, type: 'error'});
        dispatch(orderWorksReducer.actions.loadOrderWorksOrderIdFail());
    }
}

export const getOrderWorkById = (id: number) => async (dispatch: AppDispatch) =>{
    try{
        const resp = await window.electron.getOrderWorkById(id);
        dispatch(orderWorksReducer.actions.loadOrderWorkSuccess(resp));
    }catch (e) {
        new NtfAction(dispatch).addNotification({message: 'Ошибка загрузки работы заказа (сметы): '+ e.message, type: 'error'});
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
        dispatch(orderWorksReducer.actions.createOrderWorkFail());
        new NtfAction(dispatch).addNotification({message: `Ошибка создания работы заказа (сметы): `+ e.message, type: 'error'});
    }
}

export const updateOrderWork = (id: number, data: IOrderWorkBase) => async (dispatch: AppDispatch) =>{
    try{
        dispatch(orderWorksReducer.actions.startUpdating());
        const resp = await window.electron.updateOrderWork(id, data);
        dispatch(orderWorksReducer.actions.updateOrderWorkSuccess(resp));
        new NtfAction(dispatch).addNotification({message: `Работа заказа (сметы) ${id} изменена`, type: 'success'});
    }catch (e) {
        dispatch(orderWorksReducer.actions.updateOrderWorkFail());
        new NtfAction(dispatch).addNotification({message: `Ошибка изменения работы заказа (сметы): `+ e.message, type: 'error'});
    }
}

export const deleteOrderWork = (id: number) => async (dispatch: AppDispatch) =>{
    try{
        dispatch(orderWorksReducer.actions.startDeleting());
        const resp = await window.electron.deleteOrderWork(id);
        if(Boolean(resp)) dispatch(orderWorksReducer.actions.deleteOrderWorkSuccess(id));
        new NtfAction(dispatch).addNotification({message: `Работа заказа (сметы) ${id} удалена`, type: 'success'});
    }catch (e) {
        dispatch(orderWorksReducer.actions.deleteOrderWorkFail());
        new NtfAction(dispatch).addNotification({message: `Ошибка удаления работы заказа (сметы) ${id}: `+ e.message, type: 'error'});
    }
}