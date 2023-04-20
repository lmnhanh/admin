import { createSlice } from '@reduxjs/toolkit';
import { FormatDateToInput } from '../helper';

export const promotionSlice = createSlice({
	name: 'promotion',
	initialState: {
		name: '',
		filter: 'takingplace',
		productId: '0',
		fromDate: '',
		type: '',
		toDate: '',
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
		setName: (state, action) => {
			state.name = action.payload;
		},
		setProductId: (state, action) => {
			state.productId = action.payload;
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
		setPageNo: (state, action)=>{
			state.pageNo = action.payload;
		},
		setType: (state, action)=>{
			state.type = action.payload;
		},
		setOptionToDefault: (state, action) => {
			state.filter = 'takingplace';
			state.name = '';
			state.productId = '0';
			state.fromDate = '';
			state.toDate = '';
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
	setProductId,
	setName,
	setType,
	setFromDate,
	setToDate,
	setOptionToDefault,
	setPageNo,
	setPageSize,
	setFilter
} = promotionSlice.actions;
export const promotionReducer = promotionSlice.reducer;
