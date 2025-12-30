import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {IMeasurementInitial} from "../../interface/IInitialStates";
import {IMeasurement} from "../../interface/ISmetaWorks";



const initialState: IMeasurementInitial = {
     measurements: null,
    isLoading: false,
    isCreating: false,
    isUpdating: false,
    isDeleting: false,
}


export const measurementReducer = createSlice({
    name: 'measurements',
    initialState,
    reducers: {
        fetchMeasurements(state){
          state.isLoading = true;
        },
        loadMeasurementsSuccess(state, action: PayloadAction<IMeasurement[]|null>){
            state.isLoading = false;
            state.measurements = action.payload;
        },
        loadMeasurementsFail(state){
            state.isLoading = false;
        },
        isCreatingStart(state){
            state.isCreating = true;
        },
        createMeasurementsSuccess(state, action: PayloadAction<IMeasurement>){
            state.isCreating = false;
            state.measurements = [...state.measurements, action.payload];
        },
        createMeasurementsFail(state){
            state.isCreating = false;
        },
        isUpdatingStart(state){
            state.isUpdating = true;
        },
        updateMeasurementsSuccess(state, action: PayloadAction<IMeasurement>){
           state.isUpdating = false;
           state.measurements = [...state.measurements.filter(el=> el.id !== action.payload.id), action.payload]
        },
        updateMeasurementsFail(state){
           state.isUpdating = false;
        },
        isDeletingStart(state){
           state.isDeleting = true;
        },
        deleteMeasurementsSuccess(state, action: PayloadAction<IMeasurement>){
            state.isDeleting = false;
            state.measurements = state.measurements.filter(el=> el.id !== action.payload.id);
        },
        deleteMeasurementsFail(state){
            state.isDeleting = false;
        },
    }
})

export default measurementReducer.reducer;