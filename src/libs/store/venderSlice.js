import { createSlice } from '@reduxjs/toolkit';

export const venderSlice = createSlice({
	name: 'vender',
	initialState: {
		name: '',
		sort: 'datestart',
		order: 'desc',
		pageNo: 1,
		pageSize: 5
	},
	reducers: {
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
			state.sort = 'invoice';
			state.order = 'desc';
			state.pageNo = 1;
			state.pageSize = 5;
		}
	},
});

export const {
	setOrder,
	setSort,
	setName,
	setOptionToDefault,
	setPageNo,
	setPageSize
} = venderSlice.actions;
export const venderReducer = venderSlice.reducer;
