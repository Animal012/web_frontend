import { combineReducers, configureStore } from "@reduxjs/toolkit";
import shipsReducer from "./slices/shipsSlice";
import userReducer from "./slices/userSlice";

const rootReducer = combineReducers({
    ships: shipsReducer,
    user: userReducer,
});

const store = configureStore({
    reducer: rootReducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
