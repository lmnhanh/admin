import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	name: '',
	carts: [],
	scope: 'Admin',
	refresh: true,
	toggleSidebar: true,
};

export const appSlice = createSlice({
	name: 'app',
	initialState,
	reducers: {
		setRefresh: (state, action) => {
			state.refresh = !state.refresh;
		},
		updateUsername: (state, action) => {
			state.name = action.payload;
		},
		toggleSidebar: (state, action) => {
			state.toggleSidebar = !state.toggleSidebar;
		},
		setScope: (state, action) => {
			state.scope = action.payload;
		},
		setCarts: (state, action) => {
			state.carts = [...action.payload];
		},
		addCart: (state, action) => {
			let existedIndex = state.carts.findIndex(
				(cart) => cart.productDetailId === action.payload[0]
			);
			let quantity =
				Number(action.payload[2]) === 0 ? 1 : Number(action.payload[2]);
			existedIndex === -1
				? (state.carts = [
						{
							productDetailId: action.payload[0],
							images: action.payload[1],
							quantity: quantity,
							selected: false,
						},
						...state.carts,
				  ])
				: (state.carts[existedIndex].quantity =
						Number(state.carts[existedIndex].quantity) + quantity);
		},
		toggleSelectCart: (state, action) => {
			let existedIndex = state.carts.findIndex(
				(cart) => cart.productDetailId === action.payload
			);
			existedIndex !== -1 &&
				(state.carts[existedIndex].selected =
					!state.carts[existedIndex].selected);
		},
		toggleSelectAll: (state, action) => {
			let isSeletedAll = state.carts.every((cart) => !cart.selected);
			state.carts = [
				...state.carts.map((cart) => {
					cart.selected = isSeletedAll;
					return cart;
				}),
			];
		},
		updateCart: (state, action) => {
			let existedIndex = state.carts.findIndex(
				(cart) => cart.productDetailId === action.payload[0]
			);
			existedIndex !== -1 &&
				(state.carts[existedIndex].quantity = Number(action.payload[1]));
		},
		descreaseByOne: (state, action) => {
			let existedIndex = state.carts.findIndex(
				(cart) => cart.productDetailId === action.payload
			);
			console.log(existedIndex);
			existedIndex !== -1 && state.carts[existedIndex].quantity--;
			if (state.carts[existedIndex].quantity <= 0)
				state.carts.splice(existedIndex, 1);
		},
		inscreaseByOne: (state, action) => {
			let existedIndex = state.carts.findIndex(
				(cart) => cart.productDetailId === action.payload
			);
			existedIndex !== -1 && state.carts[existedIndex].quantity++;
		},
		deleteCart: (state, action) => {
			let existedIndex = state.carts.findIndex(
				(cart) => cart.productDetailId === action.payload
			);
			state.carts.splice(existedIndex, 1);
		},
	},
});

export const authSlice = createSlice({
	name: 'auth',
	initialState: { token: '', authorized: false, id: ''},
	reducers: {
		setToken: (state, action) => {
			state.token = action.payload;
		},
		setId: (state, action) => {
			state.id = action.payload;
		},
		setAuthorized: (state, action) => {
			if (action.payload.authorized === false){
				state.token = '';
				state.id = '';
			}
			else state.token = action.payload.token;
			
			state.authorized = action.payload.authorized;
		},
	},
});

export const {
	updateUsername,
	toggleSidebar,
	setScope,
	addCart,
	toggleSelectAll,
	descreaseByOne,
	inscreaseByOne,
	deleteCart,
	updateCart,
	toggleSelectCart,
	setCarts,
	setRefresh
} = appSlice.actions;
export const { setToken, setAuthorized, setId} = authSlice.actions;

export const authReducer = authSlice.reducer;
export default appSlice.reducer;
