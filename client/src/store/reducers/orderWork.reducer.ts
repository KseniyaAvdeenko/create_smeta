import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {IMeasurementInitial} from "../../interface/IInitialStates";



const initialState: IMeasurementInitial = {
     measurements: null,
    isLoading: false,
    isCreating: false,
    isUpdating: false,
    isDeleting: false,
}


export const orderWorksReducer = createSlice({
    name: 'order works',
    initialState,
    reducers: {

    }
})

export default orderWorksReducer.reducer;