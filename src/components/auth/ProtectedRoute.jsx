import axios from 'axios';
import jwtDecode from 'jwt-decode';
import { useEffect, useState } from 'react';
import { useStore, useSelector, useDispatch } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { setAuthorized, setToken } from '../../libs/store/slices';
import NotFound404 from './../util/NotFound404';

export default function ProtectedRoute({ redirectPath = '/login', children }) {
	const token = useSelector((state) => state.auth.token);
	const { client_id, scope } = jwtDecode(token);
	const dispatch = useDispatch();
	const authorized = useSelector((state) => state.auth.authorized);

	axios.defaults.baseURL = 'https://localhost:7028';
	axios.defaults.headers.common['Authorization'] = `Bearer ${token ?? ''}`;

	const connect = async () => {
		//try{
			const { status } = await axios.post('/discovery');
			dispatch(setAuthorized(status === 200));
		// }
		// catch(errors){
		// 	setAuthorized(false);
		// }
	};

	useEffect(() => {
		// try {
			// const { kid } = jwtDecode(token, { header: true });

			// if (
			// 	kid === 'F22EFE60D5B22DA53E8CF8E671A0BCA6' &&
			// 	client_id === 'Admin_LmA7@!@D' &&
			// 	scope.includes('Admin')
			// ) {
			// 	console.log('pass');
			// 	setAuthorized(true);
			// }
			connect();
		// } catch (error) {
		// 	console.log('some errors');
		// 	setAuthorized(false);
		// 	//return <NotFound404/>;
		// }
	}, []);
	return authorized ? (children ? children: <Outlet/>) : <Navigate to={redirectPath} />;
	// if (!token) {
	// 	axios.post(
	// 			'https://localhost:5001/connect/token',
	// 			{
	// 				client_id: 'Admin_LmA7@!@D',
	// 				client_secret: '1554db43-3015-47a8-a748-55bd76b6af48',
	// 				grant_type: 'client_credentials',
	// 				scope: 'Admin',
	// 			},
	// 			{
	// 				headers: {
	// 					'Content-Type': 'application/x-www-form-urlencoded',
	// 				},
	// 			}
	// 		)
	// 		.then((response) => {
	// 			store.dispatch(setToken(response.data.access_token))
	// 		});
	// }
}
