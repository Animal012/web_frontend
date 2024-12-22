import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../api/API";

// Интерфейс для сражения
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

interface Fight {
    id: string;
    fight_name: string;
    result: string;
    sailors: number;
    ships: { ship: Ship; admiral: string }[];
    created_at: string;
    status: string;
}

// Типизация для initialState
interface FightState {
    fight: Fight | null;
    loading: boolean;
    error: string | null;
}

const initialState: FightState = {
    fight: null,
    loading: false,
    error: null,
};

// Асинхронные экшены для работы с API
export const fetchFightDetails = createAsyncThunk<Fight, string>(
    "fights/fetchFightDetails",
    async (fightId) => {
        const response = await API.getFightById(Number(fightId));
        return response.json();
    }
);

export const updateFightFields = createAsyncThunk<void, { fightId: number; fightName: string; result: string }>(
    "fights/updateFightFields",
    async ({ fightId, fightName, result }) => {
        await API.changeAddFields(fightId, fightName, result);
    }
);

export const updateShipFields = createAsyncThunk<void, { shipId: number; fightId: number; admiral: string }>(
    "fights/updateShipFields",
    async ({ shipId, fightId, admiral }) => {
        await API.changeShipFields(shipId, fightId, admiral);
    }
);

export const deleteFight = createAsyncThunk<void, number>(
    "fights/deleteFight",
    async (fightId) => {
        await API.deleteFight(fightId);
    }
);

export const deleteShipFromFight = createAsyncThunk<void, { fightId: number; shipId: number }>(
    "fights/deleteShipFromFight",
    async ({ fightId, shipId }) => {
        await API.deleteShipFromDraft(fightId, shipId);
    }
);

const fightSlice = createSlice({
    name: "fights",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchFightDetails.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchFightDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.fight = action.payload;
            })
            .addCase(fetchFightDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Ошибка при загрузке данных о сражении";
            })
            .addCase(deleteFight.fulfilled, (state) => {
                state.fight = null;
            })
            .addCase(deleteShipFromFight.fulfilled, (state, action) => {
                if (state.fight) {
                    state.fight.ships = state.fight.ships.filter(
                        (ship) => Number(ship.ship.id) !== action.meta.arg.shipId
                    );
                }
            });
            
    },
});

export default fightSlice.reducer;
