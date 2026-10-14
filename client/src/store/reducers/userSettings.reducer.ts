import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {IUserSettingsInitial} from '../../interface/IInitialStates';
import {UserSettings} from '../../interface/IAuth';

const initialState: IUserSettingsInitial = {
    settings: null,
    isLoading: false,
};

export const userSettingsReducer = createSlice({
    name: 'userSettings',
    initialState,
    reducers: {
        fetchUserSettings(state) {
            state.isLoading = true;
        },
        loadUserSettingsSuccess(state, action: PayloadAction<UserSettings | null>) {
            state.isLoading = false;
            state.settings = action.payload;
        },
        loadUserSettingsFail(state) {
            state.isLoading = false;
        },
        updateUserSettingsSuccess(state, action: PayloadAction<UserSettings>) {
            state.settings = action.payload;
        },
    },
});

export default userSettingsReducer.reducer;
