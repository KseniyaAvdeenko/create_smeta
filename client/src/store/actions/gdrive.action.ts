import {AppDispatch} from '../index';
import {gdriveReducer} from '../reducers/gdrive.reducer';
import NtfAction from './ntf.action';

export const getGdriveStatus = () => async (dispatch: AppDispatch) => {
    try {
        dispatch(gdriveReducer.actions.fetchStatus());
        const status = await window.electron.getGdriveStatus();
        dispatch(gdriveReducer.actions.loadStatusSuccess(status));
    } catch (e) {
        console.error(e);
        dispatch(gdriveReducer.actions.loadStatusFail('Не удалось получить статус Google Drive'));
    }
};

export const connectGdrive = () => async (dispatch: AppDispatch) => {
    try {
        dispatch(gdriveReducer.actions.connectStart());
        const result = await window.electron.connectGdrive();
        if (!result.success) {
            dispatch(gdriveReducer.actions.connectFail(result.error || 'Ошибка подключения'));
            new NtfAction(dispatch).addNotification({
                message: result.error || 'Ошибка подключения Google Drive',
                type: 'error',
            });
            return;
        }
        const status = await window.electron.getGdriveStatus();
        dispatch(gdriveReducer.actions.connectSuccess(status));
        new NtfAction(dispatch).addNotification({
            message: `Google Drive: ${result.email || 'подключён'}`,
            type: 'success',
        });
    } catch (e) {
        console.error(e);
        dispatch(gdriveReducer.actions.connectFail('Ошибка подключения'));
    }
};

export const disconnectGdrive = () => async (dispatch: AppDispatch) => {
    try {
        await window.electron.disconnectGdrive();
        dispatch(gdriveReducer.actions.disconnectSuccess());
        new NtfAction(dispatch).addNotification({
            message: 'Google Drive отключён',
            type: 'success',
        });
    } catch (e) {
        console.error(e);
        new NtfAction(dispatch).addNotification({
            message: 'Ошибка отключения Google Drive',
            type: 'error',
        });
    }
};

export const setGdriveDefaultFolder = (folderId: string) => async (dispatch: AppDispatch) => {
    try {
        const result = await window.electron.setGdriveDefaultFolder(folderId);
        if (!result.success) {
            new NtfAction(dispatch).addNotification({
                message: result.error || 'Не удалось сохранить папку',
                type: 'error',
            });
            return;
        }
        dispatch(getGdriveStatus());
        new NtfAction(dispatch).addNotification({ message: 'Папка сохранена', type: 'success' });
    } catch (e) {
        console.error(e);
    }
};
