import { createSlice } from '@reduxjs/toolkit';

export const invoiceSlice = createSlice({
	name: 'invoice',
	initialState: {
		venderName: '0',
		productName: '0',
		fromPrice: -1,
		toPrice: -1,
		fromDate: "",
		toDate: new Date().toISOString(),
		sort: 'datecreate',
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
		setVenderName: (state, action) => {
			state.venderName = action.payload;
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
			state.venderName = '0';
			state.productName = '0';
			state.fromDate = "";
			state.fromPrice = -1;
			state.toPrice = -1;
			state.toDate = new Date().toISOString();
			state.sort = 'datecreate';
			state.order = 'desc';
			state.pageNo = 1;
			state.pageSize = 5;
		}
	},
});

export const {
	setOrder,
	setSort,
	setVenderName,
	setFromDate,
	setToDate,
	setProductName,
	setOptionToDefault,
	setPageNo,
	setPageSize,
	setFromPrice,
	setToPrice
} = invoiceSlice.actions;
export const invoiceReducer = invoiceSlice.reducer;
