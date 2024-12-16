import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from '../store';

interface ShipsState {
    ship_name?: string;
    searchQuery: string; // Добавляем поле для строки поиска
}

const initialState: ShipsState = {
    ship_name: '',
    searchQuery: '', // Изначально строка поиска пуста
};

const shipsSlice = createSlice({
    name: "ships",
    initialState,
    reducers: {
        setShipName(state, action: PayloadAction<string>) {
            state.ship_name = action.payload;
        },
        setSearchQuery(state, action: PayloadAction<string>) {
            state.searchQuery = action.payload; // Сохраняем строку поиска в глобальном состоянии
        },
        resetFilters(state) {
            Object.assign(state, initialState); // Сбросить состояние к начальному
        },
    },
});

export const { setShipName, setSearchQuery, resetFilters } = shipsSlice.actions;

export const selectSearchQuery = (state: RootState) => state.ships.searchQuery;

export default shipsSlice.reducer;
