import {createSlice} from "@reduxjs/toolkit";
import {IWorkCategoryInitial, IWorkInitial} from "../../interface/IInitialStates";


const initialState: IWorkCategoryInitial = {
    workCategories: null,
    isLoading: false,
    isCreating: false,
    isUpdating: false,
    isDeleting: false,
}


export const workCategoryReducer = createSlice({
    name: 'work categories',
    initialState,
    reducers: {}
})

export default workCategoryReducer.reducer;