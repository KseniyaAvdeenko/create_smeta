import {AppDispatch} from "../index";
import {measurementReducer} from "../reducers/measurement.reducer";
import {IMeasurement} from "../../interface/ISmetaWorks";
import NtfAction from "./ntf.action";

export const getMeasurements = () => async (dispatch: AppDispatch) => {
    try{
        dispatch(measurementReducer.actions.fetchMeasurements());
        const resp = await window.electron.getAllMeasurements();
        dispatch(measurementReducer.actions.loadMeasurementsSuccess(resp));
    }catch (e) {
        new NtfAction(dispatch).addNotification({message: 'Ошибка загрузки единиц измерения: '+ e.message, type: 'error'});
        dispatch(measurementReducer.actions.loadMeasurementsFail());
    }
}

export const getMeasurementById = (id: string) => async (dispatch: AppDispatch) =>{
    try{
        const resp = await window.electron.getMeasurementById(id);
        dispatch(measurementReducer.actions.loadMeasurementSuccess(resp));
    }catch (e) {
        new NtfAction(dispatch).addNotification({message: 'Ошибка загрузки единицы измерения: '+ e.message, type: 'error'});
        dispatch(measurementReducer.actions.loadMeasurementFail());
    }
}

export const createMeasurement = (data: IMeasurement) => async (dispatch: AppDispatch) =>{
    try{
        dispatch(measurementReducer.actions.startCreating());
        const resp = await window.electron.createMeasurement(data);
        dispatch(measurementReducer.actions.createMeasurementSuccess(resp));
        new NtfAction(dispatch).addNotification({message: `Единица измерения создана`, type: 'success'});
    }catch (e) {
        dispatch(measurementReducer.actions.createMeasurementFail());
        new NtfAction(dispatch).addNotification({message: `Ошибка создания единицы измерения: `+ e.message, type: 'error'});
    }
}

export const deleteMeasurement = (id: string) => async (dispatch: AppDispatch) =>{
    try{
        dispatch(measurementReducer.actions.startDeleting());
        const resp = await window.electron.deleteMeasurement(id);
        if(Boolean(resp)) dispatch(measurementReducer.actions.deleteMeasurementSuccess(id));
        new NtfAction(dispatch).addNotification({message: `Единица измерения ${id} удалена`, type: 'success'});
    }catch (e) {
        dispatch(measurementReducer.actions.deleteMeasurementFail());
        new NtfAction(dispatch).addNotification({message: `Ошибка удаления единицы измерения ${id}: `+ e.message, type: 'error'});
    }
}