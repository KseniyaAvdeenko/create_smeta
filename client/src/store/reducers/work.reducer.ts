import {createSlice} from "@reduxjs/toolkit";
import {IWorkInitial} from "../../interface/IInitialStates";
import {PayloadAction} from "@reduxjs/toolkit/dist";
import {IWork} from "../../interface/ISmetaWorks";


const initialState: IWorkInitial = {
    works: null,
    work: null,
    isLoading: false,
    isCreating: false,
    isUpdating: false,
    isDeleting: false,
}


export const worksReducer = createSlice({
    name: 'works',
    initialState,
    reducers: {
        fetchWorks(state) {
            state.isLoading = true;
        },
        loadWorksSuccess(state, action: PayloadAction<IWork[] | null>) {
            state.isLoading = false;
            state.works = action.payload;
        },
        loadWorksFail(state) {
            state.isLoading = false;
        },
        loadWorksByCategoryIdSuccess(state, action: PayloadAction<IWork[] | null>) {
            state.isLoading = false;
            state.works = action.payload;
        },
        loadWorksByCategoryIdFail(state) {
            state.isLoading = false;
        },
        loadWorkSuccess(state, action: PayloadAction<IWork>) {
            state.work = action.payload;
        },
        loadWorkFail(state) {
            state.work = null;
        },
        startCreating(state) {
            state.isCreating = true;
        },
        createWorkSuccess(state, action: PayloadAction<IWork>) {
            state.isCreating = false;
            state.works = [...state.works, action.payload];
        },
        createWorkFail(state) {
            state.isCreating = false;
        },
        startUpdating(state) {
            state.isUpdating = true;
        },
        updateWorkSuccess(state, action: PayloadAction<IWork>) {
            state.isCreating = false;
            state.works = [...state.works.filter(el => el.id !== action.payload.id), action.payload];
        },
        updateWorkFail(state) {
            state.isUpdating = false;
        },
        startDeleting(state) {
            state.isDeleting = true;
        },
        deleteWorkSuccess(state, action: PayloadAction<number>) {
            state.isDeleting = false;
            state.wors = state.works.filter(el => el.id !== action.payload);
        },
        deleteWorkFail(state) {
            state.isDeleting = false;
        },
    }
})

export default worksReducer.reducer;