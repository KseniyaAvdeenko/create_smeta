import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {IOrderFilesInitial} from "../../interface/IInitialStates";
import {ISavedFile} from "../../interface/ISmetaOrders";

const initialState: IOrderFilesInitial = {
    orderFiles: null,
    orderFile: null,
    isLoading: false,
    isCreating: false,
    isDeleting: false,
}


export const orderFilesReducer = createSlice({
    name: 'order files',
    initialState,
    reducers: {
        fetchOrderFiles(state) {
            state.isLoading = true;
        },
        loadOrderFilesSuccess(state, action: PayloadAction<ISavedFile[] | null>) {
            state.isLoading = false;
            state.orderFiles = action.payload;
        },
        loadOrderFilesFail(state) {
            state.isLoading = false;
        },
        loadOrderFilesOrderIdSuccess(state, action: PayloadAction<ISavedFile[] | null>) {
            state.isLoading = false;
            state.orderFiles = action.payload;
        },
        loadOrderFilesOrderIdFail(state) {
            state.isLoading = false;
        },
        loadOrderFileSuccess(state, action: PayloadAction<ISavedFile | null>) {
            state.orderFile = action.payload;
        },
        loadOrderFileFail(state) {
            state.orderFile = null;
        },
        startCreating(state) {
            state.isCreating = true;
        },
        createOrderFileSuccess(state, action: PayloadAction<ISavedFile>) {
            state.isCreating = false;
            state.orderFiles = state.orderFiles ? [...state.orderFiles, action.payload] : [action.payload];
        },
        createOrderFileFail(state) {
            state.isCreating = false;
        },
        startDeleting(state) {
            state.isDeleting = true;
        },
        deleteOrderFileSuccess(state, action: PayloadAction<number>) {
            state.isDeleting = false;
            state.orderFiles = state.orderFiles && state.orderFiles.filter(el => el.id !== action.payload);
        },
        deleteOrderFileFail(state) {
            state.isDeleting = false;
        },
    }
})

export default orderFilesReducer.reducer;