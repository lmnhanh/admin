import { createSlice } from "@reduxjs/toolkit";

export const productSlice = createSlice({
	name: 'product',
	initialState: {
		name: '',
		filter: 'active',
		sort: 'dateupdate',
		order: 'desc',
		pageNo: 1,
		pageSize: 5
	},
	reducers: {
		setFilter: (state, action) => {
			state.filter = action.payload;
		},
		setPageNo: (state, action) => {
			state.pageNo = action.payload;
		},
		setPageSize: (state, action) => {
			state.pageSize = action.payload;
		},
		setOrder: (state, action) => {
			state.order = action.payload;
		},
		setSort: (state, action) => {
			state.sort = action.payload;
		},
		setName: (state, action) => {
			state.name = action.payload;
		},
		setOptionToDefault: (state, action) =>{
			state.filter = '';
			state.order = 'desc';
			state.sort = 'dateupdate';
			state.name = '';
		},
		setOptionToNewest: (state, action) =>{
			state.order = 'desc';
			state.sort = 'dateupdate';
			state.name = '';
		}
	}
});
export const {setFilter, setOrder, setSort, setName, setOptionToDefault, setOptionToNewest, setPageNo, setPageSize} = productSlice.actions
export const productReducer =  productSlice.reducer