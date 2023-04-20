import axios from 'axios';

export function ParseToDate(timestamp, mode = 0) {
	if (mode === 0)
		return new Intl.DateTimeFormat('vi-VN', {
			year: 'numeric',
			month: 'numeric',
			day: 'numeric',
			hour: 'numeric',
			minute: 'numeric',
			second: 'numeric',
			hour12: false,
			timeZone: 'Asia/Ho_Chi_Minh',
		}).format(new Date(timestamp));
		return new Intl.DateTimeFormat('vi-VN', {
			year: 'numeric',
			month: 'numeric',
			day: 'numeric',
			timeZone: 'Asia/Ho_Chi_Minh',
		}).format(new Date(timestamp));
}

export function FormatDateToInput(dateString){
	var date = new Date(dateString);
	var getYear = date.toLocaleString("default", { year: "numeric" });
	var getMonth = date.toLocaleString("default", { month: "2-digit" });
	var getDay = date.toLocaleString("default", { day: "2-digit" });
	return getYear + "-" + getMonth + "-" + getDay;
}

export function FormatCurrency(number) {
	return new Intl.NumberFormat('vi-VN', {
		style: 'currency',
		currency: 'VND',
	}).format(number);
}

export const fetchCategory = (
	pageNo = 1,
	pagesize = 5,
	name = '',
	filter = '',
	sort = 'dateupdate',
	order = 'desc'
) => {
	return axios.get(
		`https://localhost:7028/api/categories?page=${pageNo}&size=${pagesize}&name=${name}&filter=${filter}&sort=${sort}&order=${order}`
	);
};

export const getTokenSilent = () => {
	axios.post(
		'https://localhost:5001/connect/token',
		{
			client_id: 'Admin_LmA7@!@D',
			client_secret: '1554db43-3015-47a8-a748-55bd76b6af48',
			grant_type: 'client_credentials',
			scope: 'Admin',
		},
		{
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
		}
	);
};
