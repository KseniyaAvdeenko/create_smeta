import {AppDispatch} from '../index';
import {userSettingsReducer} from '../reducers/userSettings.reducer';
import {UserSettings} from '../../interface/IAuth';
import {changeCurrentThemeMode, getCurrentThemeMode} from './app.action';
import {Theme} from '../../interface/IApp';
import NtfAction from './ntf.action';

const themeFromSettings = (desktopMode?: string): Theme | null => {
    if (desktopMode === 'dark' || desktopMode === 'light') return desktopMode;
    return null;
};

export const loadUserSettings = () => async (dispatch: AppDispatch) => {
    try {
        dispatch(userSettingsReducer.actions.fetchUserSettings());
        const settings = await window.electron.getUserSettings();
        dispatch(userSettingsReducer.actions.loadUserSettingsSuccess(settings));

        const theme = themeFromSettings(settings?.desktopMode);
        if (theme) {
            dispatch(changeCurrentThemeMode(theme));
        } else {
            dispatch(getCurrentThemeMode());
        }
    } catch (e) {
        console.error(e);
        dispatch(userSettingsReducer.actions.loadUserSettingsFail());
        dispatch(getCurrentThemeMode());
    }
};

export const saveUserSettings = (data: Partial<UserSettings>) => async (dispatch: AppDispatch) => {
    try {
        const settings = await window.electron.updateUserSettings(data);
        dispatch(userSettingsReducer.actions.updateUserSettingsSuccess(settings));
    } catch (e) {
        console.error(e);
        new NtfAction(dispatch).addNotification({
            message: 'Ошибка сохранения настроек',
            type: 'error',
        });
    }
};

export const saveThemeSetting = (theme: Theme) => async (dispatch: AppDispatch) => {
    dispatch(changeCurrentThemeMode(theme));
    dispatch(saveUserSettings({desktopMode: theme}));
};
