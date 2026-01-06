import {AppDispatch} from "../index";
import NtfAction from "./ntf.action";
import {orderFilesReducer} from "../reducers/orderFile.reducer";
import {IOrder, IOrderWork, ISavedFileBase} from "../../interface/ISmetaOrders";



export const getOrderFiles = () => async (dispatch: AppDispatch) => {
    try{
        dispatch(orderFilesReducer.actions.fetchOrderFiles());
        const resp = await window.electron.getAllOrderFiles();
        dispatch(orderFilesReducer.actions.loadOrderFilesSuccess(resp));
    }catch (e) {
        new NtfAction(dispatch).addNotification({message: 'Ошибка загрузки файлов заказа (сметы): '+ e.message, type: 'error'});
        dispatch(orderFilesReducer.actions.loadOrderFilesFail());
    }
}

export const getOrderFilesByOrderId = (orderId: number) => async (dispatch: AppDispatch) =>{
    try{
        dispatch(orderFilesReducer.actions.fetchOrderFiles());
        const resp = await window.electron.getAllOrderFilesByOrderId(orderId);
        dispatch(orderFilesReducer.actions.loadOrderFilesOrderIdSuccess(resp));
    }catch (e) {
        new NtfAction(dispatch).addNotification({message: 'Ошибка загрузки файлов заказа (сметы): '+ e.message, type: 'error'});
        dispatch(orderFilesReducer.actions.loadOrderFilesOrderIdFail());
    }
}

export const getOrderFileById = (id: number) => async (dispatch: AppDispatch) =>{
    try{
        const resp = await window.electron.getOrderFileById(id);
        dispatch(orderFilesReducer.actions.loadOrderFileSuccess(resp));
    }catch (e) {
        new NtfAction(dispatch).addNotification({message: 'Ошибка загрузки файла заказа (сметы): '+ e.message, type: 'error'});
        dispatch(orderFilesReducer.actions.loadOrderFileFail());
    }
}

export const generateOrderFile = (order: IOrder, orderWorks: IOrderWork[]) => async (dispatch: AppDispatch) =>{
    try{
        dispatch(orderFilesReducer.actions.startCreating());
        const resp = await window.electron.generateOrderFile(order, orderWorks);
        dispatch(orderFilesReducer.actions.createOrderFileSuccess(resp));
        new NtfAction(dispatch).addNotification({message: `Файл заказа (сметы) создан`, type: 'success'});
    }catch (e) {
        dispatch(orderFilesReducer.actions.createOrderFileFail());
        new NtfAction(dispatch).addNotification({message: `Ошибка создания файла заказа (сметы): `+ e.message, type: 'error'});
    }
}

export const deleteOrderFile = (id: number) => async (dispatch: AppDispatch) =>{
    try{
        dispatch(orderFilesReducer.actions.startDeleting());
        const resp = await window.electron.deleteOrderFile(id);
        if(Boolean(resp)) dispatch(orderFilesReducer.actions.deleteOrderFileSuccess(id));
        new NtfAction(dispatch).addNotification({message: `Файл заказа (сметы) ${id} удален`, type: 'success'});
    }catch (e) {
        dispatch(orderFilesReducer.actions.deleteOrderFileFail());
        new NtfAction(dispatch).addNotification({message: `Ошибка удаления файла заказа (сметы) ${id}: `+ e.message, type: 'error'});
    }
}