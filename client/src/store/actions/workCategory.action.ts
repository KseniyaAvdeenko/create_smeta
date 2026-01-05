import {AppDispatch} from "../index";
import NtfAction from "./ntf.action";
import {workCategoryReducer} from "../reducers/workCategory.reducer";
import {IWorkCategory, IWorkCategoryBase} from "../../interface/ISmetaWorks";

export const getWorkCategories = () => async (dispatch: AppDispatch) => {
    try{
        dispatch(workCategoryReducer.actions.fetchWorkCategories());
        const resp = await window.electron.getAllWorkCategories();
        dispatch(workCategoryReducer.actions.loadWorkCategoriesSuccess((resp)));
    }catch (e) {
        new NtfAction(dispatch).addNotification({message: 'Ошибка загрузки видов работ: '+ e.message, type: 'error'});
        dispatch(workCategoryReducer.actions.loadWorkCategoriesFail());
    }
}

export const getWorkCategoryById = (id: number) => async (dispatch: AppDispatch) =>{
    try{
        const resp = await window.electron.getWorkCategoryById(id);
        dispatch(workCategoryReducer.actions.loadWorkCategorySuccess(resp));
    }catch (e) {
        new NtfAction(dispatch).addNotification({message: 'Ошибка загрузки вида работы: '+ e.message, type: 'error'});
        dispatch(workCategoryReducer.actions.loadWorkCategoryFail());
    }
}

export const createWorkCategory = (data: IWorkCategoryBase) => async (dispatch: AppDispatch) =>{
    try{
        dispatch(workCategoryReducer.actions.startCreating());
        const resp = await window.electron.createWorkCategory(data);
        dispatch(workCategoryReducer.actions.createWorkCategorySuccess(resp));
        new NtfAction(dispatch).addNotification({message: `Вид работы создана`, type: 'success'});
    }catch (e) {
        dispatch(workCategoryReducer.actions.createWorkCategoryFail());
        new NtfAction(dispatch).addNotification({message: `Ошибка создания вида работы: `+ e.message, type: 'error'});
    }
}
export const updateWorkCategory = (id: number, data: IWorkCategoryBase) => async (dispatch: AppDispatch) =>{
    try{
        dispatch(workCategoryReducer.actions.startUpdating());
        const resp = await window.electron.updateWorkCategory(data);
        dispatch(workCategoryReducer.actions.updateWorkCategorySuccess(resp));
        new NtfAction(dispatch).addNotification({message: `Вид работы изменен успешно`, type: 'success'});
    }catch (e) {
        dispatch(workCategoryReducer.actions.updateWorkCategoryFail());
        new NtfAction(dispatch).addNotification({message: `Ошибка изменения вида работы: `+ e.message, type: 'error'});
    }
}
export const deleteWorkCategory = (id: number) => async (dispatch: AppDispatch) =>{
    try{
        dispatch(workCategoryReducer.actions.startDeleting());
        const resp = await window.electron.deleteWorkCategory(id);
        if(Boolean(resp)) dispatch(workCategoryReducer.actions.deleteWorkCategorySuccess(id));
        new NtfAction(dispatch).addNotification({message: `Вид работы ${id} удален`, type: 'success'});
    }catch (e) {
        dispatch(workCategoryReducer.actions.deleteWorkCategoryFail());
        new NtfAction(dispatch).addNotification({message: `Ошибка удаления вида работы ${id}: `+ e.message, type: 'error'});
    }
}