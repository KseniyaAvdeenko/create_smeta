import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {IMeasurementInitial} from "../../interface/IInitialStates";
import {IMeasurement} from "../../interface/ISmetaWorks";


const initialState: IMeasurementInitial = {
    measurements: null,
    measurement: null,
    isLoading: false,
    isCreating: false,
    isDeleting: false,
}


export const measurementReducer = createSlice({
    name: 'measurements',
    initialState,
    reducers: {
        fetchMeasurements(state) {
            state.isLoading = true;
        },
        loadMeasurementsSuccess(state, action: PayloadAction<IMeasurement[] | null>) {
            state.isLoading = false;
            state.measurements = action.payload;
        },
        loadMeasurementsFail(state) {
            state.isLoading = false;
        },
        loadMeasurementSuccess(state, action: PayloadAction<IMeasurement>) {
            state.measurement = action.payload;
        },
        loadMeasurementFail(state) {
            state.measurement = null;
        },
        startCreating(state) {
            state.isCreating = true;
        },
        createMeasurementSuccess(state, action: PayloadAction<IMeasurement>) {
            state.isCreating = false;
            state.measurements = [...state.measurements, action.payload];
        },
        createMeasurementFail(state) {
            state.isCreating = false;
        },
        startDeleting(state) {
            state.isDeleting = true;
        },
        deleteMeasurementSuccess(state, action: PayloadAction<string>) {
            state.isDeleting = false;
            state.measurements = state.measurements.filter(el => el.id !== action.payload);
        },
        deleteMeasurementFail(state) {
            state.isDeleting = false;
        },
    }
})

export default measurementReducer.reducer;