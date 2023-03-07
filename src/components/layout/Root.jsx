import React, { Component } from 'react';
import { Outlet } from 'react-router-dom';
import MainSidebar from './MainSidebar';
import Header from './Header';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from './../util/Loader';

export class Root extends Component {
	componentDidMount(){
		return <Loader/>;
	}
	render() {
		return (
			<div className='flex flex-col h-screen pb-5 overflow-hidden'>
				<Header />
				<div className='flex pb-5 overflow-auto'>
					<MainSidebar />
					<main className='flex-1 p-1 overflow-auto'>
						<Outlet />
					</main>
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
			</div>
		);
	}
}
