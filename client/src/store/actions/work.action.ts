import {AppDispatch} from "../index";
import NtfAction from "./ntf.action";
import {IWorkBase, IWorkMeasurement} from "../../interface/ISmetaWorks";
import {worksReducer} from "../reducers/work.reducer";

type PriceRowInput = {
    id?: number;
    measurementId: number;
    cost: number;
};

type SaveWorkPayload = {
    id?: number;
    name: string;
    categoryId: number;
    priceRows: PriceRowInput[];
    existingMeasurements?: IWorkMeasurement[];
};

export const getWorks = () => async (dispatch: AppDispatch) => {
    try{
        dispatch(worksReducer.actions.fetchWorks());
        const resp = await window.electron.getAllWorks();
        dispatch(worksReducer.actions.loadWorksSuccess((resp)));
    }catch (e) {
        console.error(e)
        new NtfAction(dispatch).addNotification({message: 'Ошибка загрузки работ', type: 'error'});
        dispatch(worksReducer.actions.loadWorksByCategoryIdFail());
    }
}
export const getWorksByCategoryId = (id: number) => async (dispatch: AppDispatch) => {
    try{
        dispatch(worksReducer.actions.fetchWorks());
        const resp = await window.electron.getWorksByCategoriesId(id);
        dispatch(worksReducer.actions.loadWorksByCategoryIdSuccess((resp)));
    }catch (e) {
        console.error(e)
        new NtfAction(dispatch).addNotification({message: 'Ошибка загрузки работ по категориям', type: 'error'});
        dispatch(worksReducer.actions.loadWorksFail());
    }
}
export const getWorkById = (id: number) => async (dispatch: AppDispatch) =>{
    try{
        const resp = await window.electron.getWorkById(id);
        dispatch(worksReducer.actions.loadWorkSuccess(resp));
    }catch (e) {
        console.error(e)
        new NtfAction(dispatch).addNotification({message: 'Ошибка загрузки работы', type: 'error'});
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
        console.error(e)
        dispatch(worksReducer.actions.createWorkFail());
        new NtfAction(dispatch).addNotification({message: `Ошибка создания работы`, type: 'error'});
    }
}
export const updateWork = (id: number, data: IWorkBase) => async (dispatch: AppDispatch) =>{
    try{
        dispatch(worksReducer.actions.startUpdating());
        const resp = await window.electron.updateWork(id, data);
        dispatch(worksReducer.actions.updateWorkSuccess(resp));
        new NtfAction(dispatch).addNotification({message: `Работа изменен успешно`, type: 'success'});
    }catch (e) {
        console.error(e)
        dispatch(worksReducer.actions.updateWorkFail());
        new NtfAction(dispatch).addNotification({message: `Ошибка изменения работы`, type: 'error'});
    }
}
export const deleteWork = (id: number) => async (dispatch: AppDispatch) =>{
    try{
        dispatch(worksReducer.actions.startDeleting());
        const resp = await window.electron.deleteWork(id);
        if(Boolean(resp)) dispatch(worksReducer.actions.deleteWorkSuccess(id));
        new NtfAction(dispatch).addNotification({message: `Работа ${id} удалена`, type: 'success'});
    }catch (e) {
        console.error(e)
        dispatch(worksReducer.actions.deleteWorkFail());
        new NtfAction(dispatch).addNotification({message: `Ошибка удаления работы ${id}`, type: 'error'});
    }
}

export const saveWorkWithMeasurements = (payload: SaveWorkPayload) => async (dispatch: AppDispatch) => {
    const {id, name, categoryId, priceRows, existingMeasurements} = payload;
    const data: IWorkBase = {name, categoryId};

    try {
        if (id) {
            dispatch(worksReducer.actions.startUpdating());
            await window.electron.updateWork(id, data);

            const keptIds = new Set(priceRows.filter(r => r.id).map(r => r.id));
            for (const wm of existingMeasurements ?? []) {
                if (wm.id && !keptIds.has(wm.id)) {
                    await window.electron.deleteWorkMeasurement(wm.id);
                }
            }
            for (const row of priceRows) {
                if (row.id) {
                    await window.electron.updateWorkMeasurement(row.id, {
                        measurementId: row.measurementId,
                        cost: row.cost,
                    });
                } else {
                    await window.electron.createWorkMeasurement({
                        workId: id,
                        measurementId: row.measurementId,
                        cost: row.cost,
                    });
                }
            }

            const refreshed = await window.electron.getWorkById(id);
            dispatch(worksReducer.actions.updateWorkSuccess(refreshed));
            new NtfAction(dispatch).addNotification({message: 'Работа сохранена', type: 'success'});
        } else {
            dispatch(worksReducer.actions.startCreating());
            const created = await window.electron.createWork(data);
            for (const row of priceRows) {
                await window.electron.createWorkMeasurement({
                    workId: created.id,
                    measurementId: row.measurementId,
                    cost: row.cost,
                });
            }
            const refreshed = await window.electron.getWorkById(created.id);
            dispatch(worksReducer.actions.createWorkSuccess(refreshed));
            new NtfAction(dispatch).addNotification({message: 'Работа создана', type: 'success'});
        }
    } catch (e) {
        console.error(e);
        if (id) {
            dispatch(worksReducer.actions.updateWorkFail());
            new NtfAction(dispatch).addNotification({message: 'Ошибка сохранения работы', type: 'error'});
        } else {
            dispatch(worksReducer.actions.createWorkFail());
            new NtfAction(dispatch).addNotification({message: 'Ошибка создания работы', type: 'error'});
        }
    }
};