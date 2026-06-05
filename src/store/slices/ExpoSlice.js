import { createSlice } from '@reduxjs/toolkit';

const ExpoSlice = createSlice({
  name: 'ExpoSlice',
  initialState: {
    expo: {},
    error: {}
  },
  reducers: {
    setExpo: (state, action) => {
      state.expo = { ...state.expo, ...action.payload };
    },
    setError: (state, action) => {
      state.error = { ...state.error, ...action.payload };
    }
  }
});

export const { setExpo, setError } = ExpoSlice.actions;

export default ExpoSlice.reducer;
