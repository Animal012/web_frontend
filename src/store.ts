import { combineReducers, configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import shipsReducer from "./slices/shipsSlice";
import userReducer from "./slices/userSlice";
import fightReducer from "./slices/fightSlice";

const rootReducer = combineReducers({
    ships: shipsReducer,
    user: userReducer,
    fight: fightReducer,
});

const store = configureStore({
    reducer: rootReducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk = ThunkAction<void, RootState, unknown, Action<string>>;

export default store;
