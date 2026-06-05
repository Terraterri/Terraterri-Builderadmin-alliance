import { configureStore } from '@reduxjs/toolkit';
import ExpoSlice from './slices/ExpoSlice';
import ProjectManagementSlice from './slices/ProjectManagementSlice';
import UserSlice from './slices/UserSlice';
const Store = configureStore({
  reducer: {
    expo: ExpoSlice,
    projectManagement: ProjectManagementSlice,
    user: UserSlice
  }
});

export default Store;
