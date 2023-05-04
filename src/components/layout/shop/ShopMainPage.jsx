import { Outlet } from 'react-router-dom';
import NavBar from './Navbar';
import { ToastContainer } from 'react-toastify';
import axios from 'axios';
import { useSelector } from 'react-redux';

export default function ShopMainPage() {
	const { token } = useSelector((state) => state.auth);
	axios.defaults.baseURL = 'https://localhost:7028';
	axios.defaults.headers.common['Authorization'] = `Bearer ${token ?? ''}`;

	return (
		<main id='main' className='flex flex-col h-screen overflow-hidden'>
			<NavBar />
			<div className='px-5 md:px-10 mt-16 h-full overflow-auto mb-12'>
				<Outlet></Outlet>
			</div>
			<ToastContainer
				position='top-right'
				autoClose={2000}
				hideProgressBar={false}
				newestOnTop={false}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss={false}
				draggable
				pauseOnHover={false}
				theme='light'
			/>
		</main>
	);
}
