import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import API from "../api/API";

// Типы данных для ответа API
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

interface ShipState {
    ships: Ship[];
    loading: boolean;
    error: string | null;
    shipDetails: Ship | null;  // Для хранения данных о конкретном корабле
}

interface FetchShipsResponse {
    ships: Ship[];
    draft_fight_id: string;
    count: number;
}

// Начальное состояние
const initialState: ShipState = {
    ships: [],
    loading: false,
    error: null,
    shipDetails: null,  // Для конкретного корабля
};

// Thunk для загрузки всех кораблей
export const fetchShips = createAsyncThunk<FetchShipsResponse, void>(
    "ship/fetchShips",
    async (_, { rejectWithValue }) => {
        try {
            const response = await API.getShips();
            const data: FetchShipsResponse = await response.json();
            return data;
        } catch (error) {
            return rejectWithValue("Ошибка при загрузке данных");
        }
    }
);

export const fetchShipDetails = createAsyncThunk<Ship, string>(
    "ship/fetchShipDetails",
    async (shipId, { rejectWithValue }) => {
        try {
            const response = await API.getShipDetails(shipId);
            const data: Ship = await response.json(); // Прямо получаем объект Ship
            return data;
        } catch (error) {
            return rejectWithValue("Ошибка при загрузке данных о корабле");
        }
    }
);

export const addShip = createAsyncThunk<Ship, Ship>(
    "ship/addShip",
    async (newShip, { rejectWithValue }) => {
        try {
            const response = await API.addShip(
                newShip.ship_name,
                newShip.description,
                newShip.year,
                newShip.length,
                newShip.displacement,
                newShip.crew,
                newShip.country
            );
            const data: Ship = await response.json();
            return data;  // Возвращаем созданный корабль
        } catch (error) {
            return rejectWithValue("Ошибка при добавлении корабля");
        }
    }
);

export const updateShipDetails = createAsyncThunk<Ship, Ship>(
    "ship/updateShipDetails",
    async (ship, { rejectWithValue }) => {
        try {
            const response = await API.changeShip(
                Number(ship.id),
                ship.ship_name,
                ship.description,
                ship.year,
                ship.length,
                ship.displacement,
                ship.crew,
                ship.country
            );
            const data: Ship = await response.json();
            return data;
        } catch (error) {
            return rejectWithValue("Ошибка при обновлении данных о корабле");
        }
    }
);

const shipSlice = createSlice({
    name: "ship",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // Обработка загрузки всех кораблей
        builder
            .addCase(fetchShips.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchShips.fulfilled, (state, action: PayloadAction<FetchShipsResponse>) => {
                state.ships = action.payload.ships;
                state.loading = false;
                state.error = null;
            })
            .addCase(fetchShips.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(fetchShipDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchShipDetails.fulfilled, (state, action: PayloadAction<Ship>) => {
                state.shipDetails = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(fetchShipDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(addShip.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addShip.fulfilled, (state, action: PayloadAction<Ship>) => {
                // Вы можете добавить новый корабль в массив ships, если хотите
                state.ships.push(action.payload);
                state.loading = false;
                state.error = null;
            })
            .addCase(addShip.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(updateShipDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateShipDetails.fulfilled, (state, action: PayloadAction<Ship>) => {
                state.shipDetails = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(updateShipDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export default shipSlice.reducer;
