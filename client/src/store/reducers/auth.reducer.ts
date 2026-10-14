import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {IAuthState} from '../../interface/IInitialStates';
import {AuthUser} from '../../interface/IAuth';

const initialState: IAuthState = {
    user: null,
    isAuthenticated: false,
    isLoading: true,
    needsRegister: false,
    error: null,
};

export const authReducer = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        authInitStart(state) {
            state.isLoading = true;
            state.error = null;
        },
        authInitDone(state, action: PayloadAction<{ user: AuthUser | null; needsRegister: boolean }>) {
            state.isLoading = false;
            state.user = action.payload.user;
            state.isAuthenticated = Boolean(action.payload.user);
            state.needsRegister = action.payload.needsRegister;
        },
        authStart(state) {
            state.isLoading = true;
            state.error = null;
        },
        authSuccess(state, action: PayloadAction<AuthUser>) {
            state.isLoading = false;
            state.user = action.payload;
            state.isAuthenticated = true;
            state.needsRegister = false;
            state.error = null;
        },
        authFail(state, action: PayloadAction<string>) {
            state.isLoading = false;
            state.error = action.payload;
        },
        authLogout(state) {
            state.user = null;
            state.isAuthenticated = false;
            state.error = null;
        },
    },
});

export default authReducer.reducer;
