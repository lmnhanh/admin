import { createSlice } from '@reduxjs/toolkit';

export const categorySlice = createSlice({
	name: 'category',
	initialState: {
		name: '',
		filter: '',
		sort: 'dateupdate',
		order: 'desc',
		pageNo: 1,
		pageSize: 5,
		refresh: true,
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
		setName: (state, action) => {
			state.name = action.payload;
		},
		setPageNo: (state, action)=>{
			state.pageNo = action.payload;
		},
		setPageSize: (state, action)=>{
			state.pageSize = action.payload;
		},
		setOptionToDefault: (state, action) => {
			state.name = '';
			state.filter = '';
			state.sort = '';
			state.order = '';
			state.pageNo = 1;
			state.pageSize = 5;
		},
		setRefresh: (state, action)=>{
			state.refresh = !state.refresh;
		},
		setOptionToNewest: (state, action) => {
			state.order = 'desc';
			state.sort = 'dateupdate';
			state.name = '';
			state.pageNo = 1;
			state.refresh = !state.refresh;
		}
	},
});

export const {
	setFilter,
	setOrder,
	setSort,
	setName,
	setOptionToDefault,
	setOptionToNewest,
	setPageNo,
	setPageSize
} = categorySlice.actions;
export const categoryReducer = categorySlice.reducer;
