import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { setAuthorized } from '../../libs/store/slices';
import jwtDecode from 'jwt-decode';
import { useEffect } from 'react';
import { useState } from 'react';

export default function ProtectedRoute({
	redirectPath = '/login',
	children,
	role = 'Admin',
}) {
	const authorized = useSelector((state) => state.auth.authorized);
	const dispatch = useDispatch();
	const token = useSelector((state) => state.auth.token);
	const { scope } = token ? jwtDecode(token) : { scope: '' };
	axios.defaults.baseURL = 'https://localhost:7028';
	axios.defaults.headers.common['Authorization'] = `Bearer ${token ?? ''}`;

	// const connect = async () => {
	// 	try{
	// 		const { status } = await axios.post('/discovery');
	// 		console.log('check')
	// 		dispatch(setAuthorized(status === 200));
	// 	}
	// 	catch(errors){
	// 		dispatch(setAuthorized(false));
	// 	}
	// };

	// useEffect(() => {
	// 	token ?? dispatch(setAuthorized(true))
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
	//connect();
	// } catch (error) {
	// 	console.log('some errors');
	// 	setAuthorized(false);
	// 	//return <NotFound404/>;
	// }
	//	}, []);
	// useEffect(() => {
	// 	const { scope } = token ? jwtDecode(token) : { scope: '' };
	// 	if (scope.includes(role))
	// 		dispatch(setAuthorized({ token: token, authorized: true }));

	// 	console.log(authorized === false && token !== '');
	// }, []);

	return authorized && scope.includes(role) ? (
		children ? (
			children
		) : (
			<Outlet />
		)
	) : (
		<Navigate to={redirectPath} replace={true} />
	);
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
