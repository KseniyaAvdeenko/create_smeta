import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {IApp, Theme, Screen} from "../../interface/IApp";


const initialState: IApp = {
    currentMode: '',
    isConnected: false,
    screen: {width: 0, height: 0},
    delimiter: 2
}


export const appReducer = createSlice({
    name: 'app',
    initialState,
    reducers: {
        loadCurrentThemeMode(state, action: PayloadAction<Theme>) {
            state.currentMode = action.payload;
        },
        changeCurrentThemeMode(state, action: PayloadAction<Theme>) {
            state.currentMode = action.payload;
        },
        loadNetworkConnection(state, action: PayloadAction<boolean>) {
            state.isConnected = action.payload;
        },
        loadScreenSizes(state, action: PayloadAction<Screen>){
            state.screen = action.payload;
        }
    }
})

export default appReducer.reducer;