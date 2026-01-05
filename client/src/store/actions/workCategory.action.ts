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
        new NtfAction(dispatch).addNotification({message: 'Ошибка загрузки единиц измерения: '+ e.message, type: 'error'});
        dispatch(workCategoryReducer.actions.loadWorkCategoriesFail());
    }
}

export const getWorkCategoryById = (id: number) => async (dispatch: AppDispatch) =>{
    try{
        const resp = await window.electron.getByIdWorkCategories(id);
        dispatch(workCategoryReducer.actions.loadWorkCategorySuccess(resp));
    }catch (e) {
        new NtfAction(dispatch).addNotification({message: 'Ошибка загрузки единицы измерения: '+ e.message, type: 'error'});
        dispatch(workCategoryReducer.actions.loadWorkCategoryFail());
    }
}

export const createWorkCategory = (data: IWorkCategoryBase) => async (dispatch: AppDispatch) =>{
    try{
        dispatch(workCategoryReducer.actions.startCreating());
        const resp = await window.electron.createWorkCategories(data);
        dispatch(workCategoryReducer.actions.createWorkCategorySuccess(resp));
        new NtfAction(dispatch).addNotification({message: `Единица измерения создана`, type: 'success'});
    }catch (e) {
        dispatch(workCategoryReducer.actions.createWorkCategoryFail());
        new NtfAction(dispatch).addNotification({message: `Ошибка создания единицы измерения: `+ e.message, type: 'error'});
    }
}
export const updateWorkCategory = (id: number, data: IWorkCategoryBase) => async (dispatch: AppDispatch) =>{
    try{
        dispatch(workCategoryReducer.actions.startUpdating());
        const resp = await window.electron.updateWorkCategories(data);
        dispatch(workCategoryReducer.actions.updateWorkCategorySuccess(resp));
        new NtfAction(dispatch).addNotification({message: `Единица измерения создана`, type: 'success'});
    }catch (e) {
        dispatch(workCategoryReducer.actions.updateWorkCategoryFail());
        new NtfAction(dispatch).addNotification({message: `Ошибка создания единицы измерения: `+ e.message, type: 'error'});
    }
}
export const deleteWorkCategory = (id: number) => async (dispatch: AppDispatch) =>{
    try{
        dispatch(workCategoryReducer.actions.startDeleting());
        const resp = await window.electron.deleteWorkCategories(id);
        if(Boolean(resp)) dispatch(workCategoryReducer.actions.deleteWorkCategorySuccess(id));
        new NtfAction(dispatch).addNotification({message: `Единица измерения ${id} удалена`, type: 'success'});
    }catch (e) {
        dispatch(workCategoryReducer.actions.deleteWorkCategoryFail());
        new NtfAction(dispatch).addNotification({message: `Ошибка удаления единицы измерения ${id}: `+ e.message, type: 'error'});
    }
}