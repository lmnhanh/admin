import { createSlice } from "@reduxjs/toolkit";

export const categorySlice = createSlice({
	name: 'category',
	initialState: {
		filter: '',
		sort: '',
		order: '',
		pageNo: 1,
		pageSize: 5
	},
	reducers: {
		setFilter: (state, action) => {
			state.filter = action.payload;
		},
		setOrder: (state, action) => {
			state.order = action.payload;
		},
		setSort: (state, action) => {
			state.sort = action.payload;
		},
		setOptionToDefault: (state, action) =>{
			state.filter = '';
			state.order = '';
			state.sort = '';
		}
	}
});
export const {setFilter, setOrder, setSort, setOptionToDefault} = categorySlice.actions
export const categoryReducer =  categorySlice.reducer