import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FightState {
  draftFightId: number | null;
  count: number;
}

const initialState: FightState = {
  draftFightId: null, 
  count: 0,
};

const fightSlice = createSlice({
  name: 'fight',
  initialState,
  reducers: {
    setDraftFight: (state, action: PayloadAction<{ draftFightId: number, count: number }>) => {
      state.draftFightId = action.payload.draftFightId;
      state.count = action.payload.count;
    },
    setTotalShipCount: (state, action: PayloadAction<number>) => {
      state.count = action.payload;
    },
    addShipToFight: (state) => {
      if (state.draftFightId !== null) {
        state.count += 1;
      }
    },
    resetFight: (state) => {
      state.draftFightId = null;
      state.count = 0;
    },
  },
});


export const { setDraftFight, addShipToFight, resetFight, setTotalShipCount } = fightSlice.actions;
export default fightSlice.reducer;