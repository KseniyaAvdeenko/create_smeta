import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {INTFInitial} from "../../interface/IInitialStates";
import {INotification} from "../../interface/IApp";


const initialState: INTFInitial ={
        notifications: []
    }
export const ntfReducer = createSlice({
    name: 'ntfReducer',
    initialState ,
    reducers: {
        setNtf(state, action:PayloadAction<Omit<INotification, 'id'>>){
            state.notifications = [...state.notifications, {id: Date.now(), ...action.payload}]
        },
        removeNtf(state, action:PayloadAction<number>){
            state.notifications = state.notifications.filter(el=> el.id !== action.payload)
        },
    }
})

export default ntfReducer.reducer;