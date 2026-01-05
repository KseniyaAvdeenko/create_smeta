import {AppDispatch} from "../index";
import NtfAction from "./ntf.action";
import {IWorkBase} from "../../interface/ISmetaWorks";
import {worksReducer} from "../reducers/work.reducer";


export const getWorks = () => async (dispatch: AppDispatch) => {
    try{
        dispatch(worksReducer.actions.fetchWorks());
        const resp = await window.electron.getAllWorks();
        dispatch(worksReducer.actions.loadWorksSuccess((resp)));
    }catch (e) {
        new NtfAction(dispatch).addNotification({message: 'Ошибка загрузки работ: '+ e.message, type: 'error'});
        dispatch(worksReducer.actions.loadWorksByCategoryIdFail());
    }
}
export const getWorksByCategoryId = (id: number) => async (dispatch: AppDispatch) => {
    try{
        dispatch(worksReducer.actions.fetchWorks());
        const resp = await window.electron.getWorksByCategoriesId(id);
        dispatch(worksReducer.actions.loadWorksByCategoryIdSuccess((resp)));
    }catch (e) {
        new NtfAction(dispatch).addNotification({message: 'Ошибка загрузки работ по категориям: '+ e.message, type: 'error'});
        dispatch(worksReducer.actions.loadWorksFail());
    }
}
export const getWorkById = (id: number) => async (dispatch: AppDispatch) =>{
    try{
        const resp = await window.electron.getWorkById(id);
        dispatch(worksReducer.actions.loadWorkSuccess(resp));
    }catch (e) {
        new NtfAction(dispatch).addNotification({message: 'Ошибка загрузки работы: '+ e.message, type: 'error'});
        dispatch(worksReducer.actions.loadWorkFail());
    }
}

export const createWork = (data: IWorkBase) => async (dispatch: AppDispatch) =>{
    try{
        dispatch(worksReducer.actions.startCreating());
        const resp = await window.electron.createWork(data);
        dispatch(worksReducer.actions.createWorkSuccess(resp));
        new NtfAction(dispatch).addNotification({message: `Работа создана`, type: 'success'});
    }catch (e) {
        dispatch(worksReducer.actions.createWorkFail());
        new NtfAction(dispatch).addNotification({message: `Ошибка создания работы: `+ e.message, type: 'error'});
    }
}
export const updateWork = (id: number, data: IWorkBase) => async (dispatch: AppDispatch) =>{
    try{
        dispatch(worksReducer.actions.startUpdating());
        const resp = await window.electron.updateWork(data);
        dispatch(worksReducer.actions.updateWorkSuccess(resp));
        new NtfAction(dispatch).addNotification({message: `Работа изменен успешно`, type: 'success'});
    }catch (e) {
        dispatch(worksReducer.actions.updateWorkFail());
        new NtfAction(dispatch).addNotification({message: `Ошибка изменения работы: `+ e.message, type: 'error'});
    }
}
export const deleteWork = (id: number) => async (dispatch: AppDispatch) =>{
    try{
        dispatch(worksReducer.actions.startDeleting());
        const resp = await window.electron.deleteWork(id);
        if(Boolean(resp)) dispatch(worksReducer.actions.deleteWorkSuccess(id));
        new NtfAction(dispatch).addNotification({message: `Работа ${id} удалена`, type: 'success'});
    }catch (e) {
        dispatch(worksReducer.actions.deleteWorkFail());
        new NtfAction(dispatch).addNotification({message: `Ошибка удаления работы ${id}: `+ e.message, type: 'error'});
    }
}