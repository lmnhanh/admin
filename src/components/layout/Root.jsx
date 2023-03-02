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
			<div className='flex h-screen pb-5 flex-col overflow-hidden'>
				<Header />
				<div className='flex h-full pb-5 min-w-min'>
					<MainSidebar />
					<main className='flex-1 p-1 overflow-auto min-w-max'>
						<Outlet />
					</main>
				</div>
				<ToastContainer
					position='top-right'
					autoClose={4000}
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
