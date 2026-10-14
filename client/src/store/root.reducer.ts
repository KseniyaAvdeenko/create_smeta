import {combineReducers} from '@reduxjs/toolkit';
import ntfReducer from './reducers/ntf.reducer';
import appReducer from './reducers/app.reducer';
import authReducer from './reducers/auth.reducer';
import gdriveReducer from './reducers/gdrive.reducer';
import measurementReducer from './reducers/measurement.reducer';
import ordersReducer from './reducers/order.reducer';
import orderFilesReducer from './reducers/orderFile.reducer';
import orderWorksReducer from './reducers/orderWork.reducer';
import worksReducer from './reducers/work.reducer';
import workCategoryReducer from './reducers/workCategory.reducer';
import userSettingsReducer from './reducers/userSettings.reducer';

export const rootReducer = combineReducers({
    ntfReducer,
    appReducer,
    authReducer,
    gdriveReducer,
    userSettingsReducer,
    measurementReducer,
    ordersReducer,
    orderFilesReducer,
    orderWorksReducer,
    worksReducer,
    workCategoryReducer,
});
