import {combineReducers} from "@reduxjs/toolkit";
import ntfReducer from './reducers/ntf.reducer';
import appReducer from './reducers/app.reducer';
import measurementReducer from './reducers/measurement.reducer';
import orderFilesReducer from './reducers/orderFile.reducer';
import orderWorksReducer from './reducers/orderWork.reducer';
import worksReducer from './reducers/work.reducer';
import workCategoryReducer from './reducers/workCategory.reducer';

export const rootReducer = combineReducers({
 ntfReducer,
 appReducer,
 measurementReducer,
 orderFilesReducer,
 orderWorksReducer,
 worksReducer,
 workCategoryReducer
})