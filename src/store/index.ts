//REDUX
import {combineReducers} from 'redux';
//REDUX-TOOLKIT
import {configureStore} from '@reduxjs/toolkit';
//SLICES
import userSlice from './users/userSlice';

const rootReducer = combineReducers({
    user: userSlice,
});

// const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export type RootState = ReturnType<typeof store.getState>;
