import React, { Component } from 'react';
import { Outlet } from 'react-router-dom';
import MainSidebar from './MainSidebar';
import Header from './Header';

export class Root extends Component {
	render() {
		return (
			<div className='flex h-screen w-full flex-col overflow-hidden'>
				<Header/>
				<div className='flex h-full w-full overflow-hidden'>
					<MainSidebar />
					<main className='flex-1 overflow-auto p-1'>
						<Outlet/>
					</main>
				</div>
			</div>
		);
	}
}
