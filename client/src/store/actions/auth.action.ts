import {AppDispatch} from '../index';
import {authReducer} from '../reducers/auth.reducer';
import NtfAction from './ntf.action';
import {loadUserSettings} from './userSettings.action';

export const initAuth = () => async (dispatch: AppDispatch) => {
    try {
        dispatch(authReducer.actions.authInitStart());
        const hasUsers = await window.electron.hasUsers();
        const user = await window.electron.getCurrentUser();
        dispatch(
            authReducer.actions.authInitDone({
                user,
                needsRegister: !hasUsers,
            }),
        );
        if (user) dispatch(loadUserSettings());
    } catch (e) {
        console.error(e);
        dispatch(authReducer.actions.authInitDone({ user: null, needsRegister: true }));
    }
};

export const login =
    (loginValue: string, password: string, rememberLogin = false) =>
    async (dispatch: AppDispatch) => {
        try {
            dispatch(authReducer.actions.authStart());
            const result = await window.electron.login(loginValue, password, rememberLogin);
            if (!result.success || !result.user) {
                dispatch(authReducer.actions.authFail(result.error || 'Ошибка входа'));
                new NtfAction(dispatch).addNotification({
                    message: result.error || 'Ошибка входа',
                    type: 'error',
                });
                return;
            }
            dispatch(authReducer.actions.authSuccess(result.user));
            dispatch(loadUserSettings());
            new NtfAction(dispatch).addNotification({ message: 'Вход выполнен', type: 'success' });
            if (result.rememberError) {
                new NtfAction(dispatch).addNotification({
                    message: result.rememberError,
                    type: 'warning',
                });
            }
        } catch (e) {
            console.error(e);
            dispatch(authReducer.actions.authFail('Ошибка входа'));
        }
    };

export const register =
    (data: { username: string; email: string; password: string }) =>
    async (dispatch: AppDispatch) => {
        try {
            dispatch(authReducer.actions.authStart());
            const result = await window.electron.register({ ...data, isAdmin: true });
            if (!result.success || !result.user) {
                dispatch(authReducer.actions.authFail(result.error || 'Ошибка регистрации'));
                new NtfAction(dispatch).addNotification({
                    message: result.error || 'Ошибка регистрации',
                    type: 'error',
                });
                return;
            }
            dispatch(authReducer.actions.authSuccess(result.user));
            dispatch(loadUserSettings());
            new NtfAction(dispatch).addNotification({
                message: 'Аккаунт создан',
                type: 'success',
            });
        } catch (e) {
            console.error(e);
            dispatch(authReducer.actions.authFail('Ошибка регистрации'));
        }
    };

export const logout = () => async (dispatch: AppDispatch) => {
    await window.electron.logout();
    dispatch(authReducer.actions.authLogout());
};
