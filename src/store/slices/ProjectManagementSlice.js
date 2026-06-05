import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  project: {},
  error: {},
  editProjectData: {}
};

const ProjectManagementSlice = createSlice({
  name: 'ProjectManagementSlice',
  initialState,
  reducers: {
    reset: () => initialState,
    setProject: (state, action) => {
      state.project = { ...state.project, ...action.payload };
    },
    setError: (state, action) => {
      state.error = { ...state.error, ...action.payload };
    },
    // For edit project
    setEditProject: (state, action) => {
      state.editProjectData = action.payload;
    },
    // Clear edit project after editing is done
    clearEditProject: (state) => {
      state.editProjectData = null;
    }
  }
});

export const { setProject, setError, reset, setEditProject, clearEditProject } =
  ProjectManagementSlice.actions;

export default ProjectManagementSlice.reducer;
