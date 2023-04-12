import { createSlice } from '@reduxjs/toolkit';

export const partnerSlice = createSlice({
	name: 'partner',
	initialState: {
		name: '',
    filter: 'pending',
		sort: 'dateaspartner',
		order: 'desc',
		fromDate: '',
		toDate: '',
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
		setName: (state, action) => {
			state.name = action.payload;
		},
		setFromDate: (state, action) => {
			state.fromDate = action.payload;
		},
		setToDate: (state, action) => {
			state.toDate = action.payload;
		},
    setFilter: (state, action) => {
			state.filter = action.payload;
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
			state.sort = 'dateaspartner';
			state.fromDate = '';
			state.toDate = '';
			state.order = 'desc';
			state.pageNo = 1;
			state.pageSize = 10;
		}
	},
});

export const {
	setOrder,
	setSort,
	setName,
  setFilter,
	setOptionToDefault,
	setPageNo,
	setFromDate,
	setToDate,
	setPageSize
} = partnerSlice.actions;
export const partnerReducer = partnerSlice.reducer;
