import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {IGdriveInitial} from '../../interface/IInitialStates';
import {GdriveStatus} from '../../interface/IAuth';

const initialState: IGdriveInitial = {
    status: null,
    isLoading: false,
    isConnecting: false,
    error: null,
};

export const gdriveReducer = createSlice({
    name: 'gdrive',
    initialState,
    reducers: {
        fetchStatus(state) {
            state.isLoading = true;
            state.error = null;
        },
        loadStatusSuccess(state, action: PayloadAction<GdriveStatus>) {
            state.isLoading = false;
            state.status = action.payload;
        },
        loadStatusFail(state, action: PayloadAction<string>) {
            state.isLoading = false;
            state.error = action.payload;
        },
        connectStart(state) {
            state.isConnecting = true;
            state.error = null;
        },
        connectSuccess(state, action: PayloadAction<GdriveStatus>) {
            state.isConnecting = false;
            state.status = action.payload;
        },
        connectFail(state, action: PayloadAction<string>) {
            state.isConnecting = false;
            state.error = action.payload;
        },
        disconnectSuccess(state) {
            state.status = { connected: false };
        },
    },
});

export default gdriveReducer.reducer;
