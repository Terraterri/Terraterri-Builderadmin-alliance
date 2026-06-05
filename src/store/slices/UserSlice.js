import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    role: null,
    userData: {}
  },
  reducers: {
    setUserRole(state, action) {
      state.role = action.payload;
    },
    setUserData(state, action) {
      state.userData = { ...action.payload };
    },
    updateUserData(state, action) {
      state.userData = {
        ...state.userData,
        ...action.payload
      };
    },
    clearUser(state) {
      state.role = null;
      state.userData = null;
    }
  }
});

export const { setUserRole, setUserData, updateUserData, clearUser } = userSlice.actions;
export default userSlice.reducer;
