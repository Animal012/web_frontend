import { combineReducers, configureStore } from "@reduxjs/toolkit";
import shipsReducer from "./slices/shipsSlice";

const rootReducer = combineReducers({
    ships: shipsReducer,
});

const store = configureStore({
    reducer: rootReducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
