import {AppDispatch} from '../index';
import NtfAction from './ntf.action';
import {IWorkMeasurement} from '../../interface/ISmetaWorks';
import {getWorks} from './work.action';

export const getWorkMeasurementsByWorkId = (workId: number) => async () => {
    return window.electron.getWorkMeasurementsByWorkId(workId) as Promise<IWorkMeasurement[]>;
};

export const createWorkMeasurement = (data: Omit<IWorkMeasurement, 'id'>) => async (dispatch: AppDispatch) => {
    try {
        await window.electron.createWorkMeasurement(data);
        dispatch(getWorks());
        new NtfAction(dispatch).addNotification({message: 'Расценка добавлена', type: 'success'});
    } catch (e) {
        console.error(e);
        new NtfAction(dispatch).addNotification({message: 'Ошибка добавления расценки', type: 'error'});
    }
};

export const updateWorkMeasurement = (id: number, data: Partial<IWorkMeasurement>) => async (dispatch: AppDispatch) => {
    try {
        await window.electron.updateWorkMeasurement(id, data);
        dispatch(getWorks());
        new NtfAction(dispatch).addNotification({message: 'Расценка обновлена', type: 'success'});
    } catch (e) {
        console.error(e);
        new NtfAction(dispatch).addNotification({message: 'Ошибка обновления расценки', type: 'error'});
    }
};

export const deleteWorkMeasurement = (id: number) => async (dispatch: AppDispatch) => {
    try {
        await window.electron.deleteWorkMeasurement(id);
        dispatch(getWorks());
        new NtfAction(dispatch).addNotification({message: 'Расценка удалена', type: 'success'});
    } catch (e) {
        console.error(e);
        new NtfAction(dispatch).addNotification({message: 'Ошибка удаления расценки', type: 'error'});
    }
};
