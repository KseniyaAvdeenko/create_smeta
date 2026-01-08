import {AppDispatch} from "../index";
import {appReducer} from "../reducers/app.reducer";
import {Theme} from "../../interface/IApp";



export const getCurrentThemeMode = () => async (dispatch: AppDispatch) => {
    const data = await window.electron.initial();
    dispatch(appReducer.actions.loadCurrentThemeMode(data ? 'dark' : 'light'))
}

export const changeCurrentThemeMode = (theme: Theme) => async (dispatch: AppDispatch) => {
    if (theme === 'dark') await window.electron.dark();
    if (theme === 'light') await window.electron.light();
    dispatch(appReducer.actions.changeCurrentThemeMode(theme));
}

export const getNetworkConnection = () => async (dispatch: AppDispatch) => {
    const data = await window.electron.isOnline();
    if (!data) dispatch(appReducer.actions.loadNetworkConnection(false));
    dispatch(appReducer.actions.loadNetworkConnection(data));
}
export const getScreenSizes = () => async (dispatch: AppDispatch) => {
    const data = await window.electron.screen();
    dispatch(appReducer.actions.loadScreenSizes(data))
}