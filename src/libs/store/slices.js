import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	name: '',
	scope: 'Admin',
	toggleSidebar: false,
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
		setScope: (state, action) => {
			state.scope = action.payload;
		}
	},
});

export const authSlice = createSlice({
	name: 'auth',
	initialState: { token: '', authorized: false },
	reducers: {
		setToken: (state, action) => {
			state.token = action.payload;
		},
		setAuthorized: (state, action) => {

			if(action.payload.authorized === false) state.token = '';
			else state.token = action.payload.token

			state.authorized = action.payload.authorized;
		},
	},
});

export const { updateUsername, toggleSidebar, setScope} = appSlice.actions;
export const { setToken, setAuthorized } = authSlice.actions;

export const authReducer = authSlice.reducer;
export default appSlice.reducer;
