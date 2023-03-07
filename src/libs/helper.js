import axios from "axios";

export function ParseToDate(timestamp){
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
}

export const fetchCategory = (pageNo = 1, pagesize = 5, name = '', filter = '', sort = 'dateupdate', order = 'desc') => {
	return axios.get(
		`https://localhost:7028/api/categories?page=${pageNo}&size=${pagesize}&name=${name}&filter=${filter}&sort=${sort}&order=${order}`
	);
}

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