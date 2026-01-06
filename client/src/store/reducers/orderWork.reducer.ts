import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {IOrderWorksInitial} from "../../interface/IInitialStates";
import {IOrderWork} from "../../interface/ISmetaOrders";


const initialState: IOrderWorksInitial = {
    orderWorks: null,
    orderWork: null,
    isLoading: false,
    isCreating: false,
    isUpdating: false,
    isDeleting: false,
}


export const orderWorksReducer = createSlice({
    name: 'order works',
    initialState,
    reducers: {
        fetchOrderWorks(state) {
            state.isLoading = true;
        },
        loadOrderWorksSuccess(state, action: PayloadAction<IOrderWork[] | null>) {
            state.isLoading = false;
            state.orderWorks = action.payload;
        },
        loadOrderWorksFail(state) {
            state.isLoading = false;
        },
        loadOrderWorksOrderIdSuccess(state, action: PayloadAction<IOrderWork[] | null>) {
            state.isLoading = false;
            state.orderWorks = action.payload;
        },
        loadOrderWorksOrderIdFail(state) {
            state.isLoading = false;
        },
        loadOrderWorkSuccess(state, action: PayloadAction<IOrderWork|null>) {
            state.orderWork = action.payload;
        },
        loadOrderWorkFail(state) {
            state.order = null;
        },
        startCreating(state) {
            state.isCreating = true;
        },
        createOrderWorkSuccess(state, action: PayloadAction<IOrderWork>) {
            state.isCreating = false;
            state.orderWorks = [...state.orderWorks, action.payload];
        },
        createOrderWorkFail(state) {
            state.isCreating = false;
        },
        startUpdating(state) {
            state.isUpdating = true;
        },
        updateOrderWorkSuccess(state, action: PayloadAction<IOrderWork>) {
            state.isCreating = false;
            state.orderWorks = [...state.orderWorks.filter(el => el.id !== action.payload.id), action.payload];
        },
        updateOrderWorkFail(state) {
            state.isUpdating = false;
        },
        startDeleting(state) {
            state.isDeleting = true;
        },
        deleteOrderWorkSuccess(state, action: PayloadAction<number>) {
            state.isDeleting = false;
            state.orderWorks = state.orderWorks.filter(el => el.id !== action.payload);
        },
        deleteOrderWorkFail(state) {
            state.isDeleting = false;
        },
    }
})

export default orderWorksReducer.reducer;