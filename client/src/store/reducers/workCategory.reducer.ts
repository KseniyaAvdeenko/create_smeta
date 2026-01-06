import {createSlice} from "@reduxjs/toolkit";
import {IWorkCategoryInitial} from "../../interface/IInitialStates";
import {PayloadAction} from "@reduxjs/toolkit/dist";
import {IWorkCategory} from "../../interface/ISmetaWorks";


const initialState: IWorkCategoryInitial = {
    workCategories: null,
    workCategory: null,
    isLoading: false,
    isCreating: false,
    isUpdating: false,
    isDeleting: false,
}


export const workCategoryReducer = createSlice({
    name: 'work categories',
    initialState,
    reducers: {
        fetchWorkCategories(state) {
            state.isLoading = true;
        },
        loadWorkCategoriesSuccess(state, action: PayloadAction<IWorkCategory[] | null>) {
            state.isLoading = false;
            state.workCategories = action.payload;
        },
        loadWorkCategoriesFail(state) {
            state.isLoading = false;
        },
        loadWorkCategorySuccess(state, action: PayloadAction<IWorkCategory>) {
            state.workCategory = action.payload;
        },
        loadWorkCategoryFail(state) {
            state.workCategory = null;
        },
        startCreating(state) {
            state.isCreating = true;
        },
        createWorkCategorySuccess(state, action: PayloadAction<IWorkCategory>) {
            state.isCreating = false;
            state.workCategories = state.workCategories ? [...state.workCategories, action.payload] : [action.payload];
        },
        createWorkCategoryFail(state) {
            state.isCreating = false;
        },
        startUpdating(state) {
            state.isUpdating = true;
        },
        updateWorkCategorySuccess(state, action: PayloadAction<IWorkCategory>) {
            state.isCreating = false;
            state.workCategories = state.workCategories
                ? [...state.workCategories.filter(el => el.id !== action.payload.id), action.payload]
                : [action.payload];
        },
        updateWorkCategoryFail(state) {
            state.isUpdating = false;
        },
        startDeleting(state) {
            state.isDeleting = true;
        },
        deleteWorkCategorySuccess(state, action: PayloadAction<number>) {
            state.isDeleting = false;
            state.workCategories = state.workCategories && state.workCategories.filter(el => el.id !== action.payload);
        },
        deleteWorkCategoryFail(state) {
            state.isDeleting = false;
        },
    }
})

export default workCategoryReducer.reducer;