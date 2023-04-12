import { createSlice } from '@reduxjs/toolkit';

export const orderSlice = createSlice({
	name: 'order',
	initialState: {
		userName: '',
		filter: 'processing',
		productName: '0',
		fromPrice: -1,
		toPrice: -1,
		fromDate: "",
		toDate: new Date().toISOString(),
		sort: 'datecreate',
		order: 'desc',
		pageNo: 1,
		pageSize: 10
	},
	reducers: {
		setOrder: (state, action) => {
			state.order = action.payload;
		},
		setSort: (state, action) => {
			state.sort = action.payload;
		},
		setFilter: (state, action) => {
			state.filter = action.payload;
		},
		setUserName: (state, action) => {
			state.userName = action.payload;
		},
		setProductName: (state, action) => {
			state.productName = action.payload;
		},
		setFromDate: (state, action) => {
			state.fromDate = action.payload;
		},
		setToDate: (state, action)=>{
			state.toDate = action.payload;
		},
		setPageSize: (state, action)=>{
			state.pageSize = action.payload;
		},
		setFromPrice: (state, action)=>{
			state.fromPrice = action.payload;
		},
		setPageNo: (state, action)=>{
			state.pageNo = action.payload;
		},
		setToPrice: (state, action)=>{
			state.toPrice = action.payload;
		},
		setOptionToDefault: (state, action) => {
			state.filter = 'processing';
			state.userName = '';
			state.productName = '0';
			state.fromDate = "";
			state.toDate = new Date().toISOString();
			state.fromPrice = -1;
			state.toPrice = -1;
			state.sort = 'datecreate';
			state.order = 'desc';
			state.pageNo = 1;
			state.pageSize = 10;
		}
	},
});

export const {
	setOrder,
	setSort,
	setUserName,
	setFromDate,
	setToDate,
	setProductName,
	setOptionToDefault,
	setPageNo,
	setPageSize,
	setFromPrice,
	setToPrice,
	setFilter
} = orderSlice.actions;
export const orderReducer = orderSlice.reducer;
