import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	name: '',
	toggleSidebar: false
};

export const appSlice = createSlice({
	name: 'app',
	initialState,
	reducers: {
		updateUsername: (state, action) => {
			state.name = action.payload;
		},
		toggleSidebar: (state, action) => {
			state.toggleSidebar = !state.toggleSidebar;
		},
	},
});

export const { updateUsername, toggleSidebar} = appSlice.actions;
export default appSlice.reducer;
