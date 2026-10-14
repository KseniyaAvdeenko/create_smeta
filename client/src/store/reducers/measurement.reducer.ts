import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {IMeasurementInitial} from "../../interface/IInitialStates";
import {IMeasurement} from "../../interface/ISmetaWorks";


const initialState: IMeasurementInitial = {
    measurements: null,
    measurement: null,
    isLoading: false,
    isCreating: false,
    isUpdating: false,
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
        loadMeasurementSuccess(state, action: PayloadAction<IMeasurement|null>) {
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
            state.measurements = state.measurements ? [...state.measurements, action.payload]: [action.payload];
        },
        createMeasurementFail(state) {
            state.isCreating = false;
        },
        startUpdating(state) {
            state.isUpdating = true;
        },
        updateMeasurementSuccess(state, action: PayloadAction<IMeasurement>) {
            state.isUpdating = false;
            state.measurements = state.measurements
                ? state.measurements.map(el => (el.id === action.payload.id ? action.payload : el))
                : [action.payload];
        },
        updateMeasurementFail(state) {
            state.isUpdating = false;
        },
        startDeleting(state) {
            state.isDeleting = true;
        },
        deleteMeasurementSuccess(state, action: PayloadAction<number>) {
            state.isDeleting = false;
            state.measurements =
                state.measurements && state.measurements.filter(el => el.id !== action.payload);
        },
        deleteMeasurementFail(state) {
            state.isDeleting = false;
        },
    }
})

export default measurementReducer.reducer;