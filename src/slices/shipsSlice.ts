import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { useSelector } from 'react-redux';
import { RootState } from '../store';

interface ShipsState {
    ship_name?: string
}

const initialState: ShipsState = {
    ship_name: ''
};

const shipsSlice = createSlice({
    name: "ships",
    initialState,
    reducers: {
        setShipName(state, action: PayloadAction<string>) {
            state.ship_name = action.payload;
        }
    },
});

export const useTitle = () => useSelector((state: RootState) => state.ships.ship_name);

export const {
    setShipName,
} = shipsSlice.actions;

export default shipsSlice.reducer;
