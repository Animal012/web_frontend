import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Ship {
    id: string;
    ship_name: string;
    description: string;
    year: number;
    displacement: number;
    length: number;
    crew: number;
    country: string;
    photo: string;
}

interface ShipsState {
    ships: Ship[];
    filteredShips: Ship[];
    searchQuery: string;
    shipsInBucket: number;
    draftId: number | null;
}

const initialState: ShipsState = {
    ships: [],
    filteredShips: [],
    searchQuery: "",
    shipsInBucket: 0,
    draftId: null,
};

const shipsSlice = createSlice({
    name: "ships",
    initialState,
    reducers: {
        setShips(state, action: PayloadAction<Ship[]>) {
            state.ships = action.payload;
            state.filteredShips = action.payload;
        },
        setSearchQuery(state, action: PayloadAction<string>) {
            state.searchQuery = action.payload;
            state.filteredShips = state.ships.filter((ship) =>
                ship.ship_name.toLowerCase().includes(action.payload.toLowerCase())
            );
        },
        setShipsInBucket(state, action: PayloadAction<number>) {
            state.shipsInBucket = action.payload;
        },
        setDraftId(state, action: PayloadAction<number | null>) {
            state.draftId = action.payload;
        },
    },
});

export const { setShips, setSearchQuery, setShipsInBucket, setDraftId } =
    shipsSlice.actions;

export const selectShips = (state: any) => state.ships.filteredShips;
export const selectSearchQuery = (state: any) => state.ships.searchQuery;
export const selectShipsInBucket = (state: any) => state.ships.shipsInBucket;

export default shipsSlice.reducer;
