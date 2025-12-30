import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {IMeasurementInitial} from "../../interface/IInitialStates";



const initialState: IMeasurementInitial = {
     measurements: null,
    isLoading: false,
    isCreating: false,
    isUpdating: false,
    isDeleting: false,
}


export const orderReducer = createSlice({
    name: 'orders',
    initialState,
    reducers: {

    }
})

export default orderReducer.reducer;