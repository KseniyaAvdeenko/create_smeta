import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {IOrderInitial} from "../../interface/IInitialStates";
import {IOrder} from "../../interface/ISmetaOrders";


const initialState: IOrderInitial = {
    orders: null,
    order: null,
    isLoading: false,
    isCreating: false,
    isUpdating: false,
    isDeleting: false,
}


export const orderReducer = createSlice({
    name: 'orders',
    initialState,
    reducers: {
        fetchOrders(state) {
            state.isLoading = true;
        },
        loadOrdersSuccess(state, action: PayloadAction<IOrder[] | null>) {
            state.isLoading = false;
            state.orders = action.payload;
        },
        loadOrdersFail(state) {
            state.isLoading = false;
        },
        loadOrderSuccess(state, action: PayloadAction<IOrder>) {
            state.order = action.payload;
        },
        loadOrderFail(state) {
            state.order = null;
        },
        startCreating(state) {
            state.isCreating = true;
        },
        createOrderSuccess(state, action: PayloadAction<IOrder>) {
            state.isCreating = false;
            state.orders = [...state.orders, action.payload];
        },
        createOrderFail(state) {
            state.isCreating = false;
        },
        startUpdating(state) {
            state.isUpdating = true;
        },
        updateOrderSuccess(state, action: PayloadAction<IOrder>) {
            state.isCreating = false;
            state.orders = [...state.orders.filter(el => el.id !== action.payload.id), action.payload];
        },
        updateOrderFail(state) {
            state.isUpdating = false;
        },
        startDeleting(state) {
            state.isDeleting = true;
        },
        deleteOrderSuccess(state, action: PayloadAction<number>) {
            state.isDeleting = false;
            state.orders = state.orders.filter(el => el.id !== action.payload);
        },
        deleteOrderFail(state) {
            state.isDeleting = false;
        },
    }
})

export default orderReducer.reducer;