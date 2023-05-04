import {
	faBars,
	faChevronLeft,
	faChevronRight,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Fragment, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function SideBar() {
	const { pathname } = useLocation();
	const [expand, setExpand] = useState(false);
	const activeClassName =
		'bg-gradient-to-r py-2 from-green-100 to-purple-100 text-blue-600 font-semibold';
	return (
		<Fragment>
			<div
				className={`${
					expand ? 'flex min-w-max h-fit' : '-translate-x-full w-0'
				} md:flex relative flex-col md:translate-x-0 md:min-w-max px-1 md:border-x space-y-1 bg-white`}>
				<div className='overflow-hidden'>
					<p className='font-bold text-sm rounded-md p-2 uppercase bg-gradient-to-r from-green-200 to-green-100 text-black'>
						Danh mục sản phẩm
						<FontAwesomeIcon
							icon={faBars}
							onClick={() => setExpand((prev) => !prev)}
							className={`md:hidden ${
								expand ? '' : 'top-2 -right-2'
							} right-0 top-2 absolute px-2 z-9 w-4 h-4 cursor-pointer hover:text-blue-600`}
						/>
					</p>
					<Link
						className={`inline-flex ${
							pathname === '/shop/' ? activeClassName : 'text-gray-700'
						} items-center w-full py-1 pl-3 m-0.5 transition duration-200 ease-in-out transform rounded-lg focus:shadow-outline hover:bg-gray-100 hover:scale-105 hover:text-blue-500`}
						to={'/shop'}>
						Hải sản tươi
					</Link>
					<Link
						className={`inline-flex ${
							pathname === '/shop/' ? activeClassName : 'text-gray-700'
						} items-center w-full py-1 pl-3 m-0,5 transition duration-200 ease-in-out transform rounded-lg focus:shadow-outline hover:bg-gray-100 hover:scale-105 hover:text-blue-500`}
						to={'/shop'}>
						Khô hải sản
					</Link>
				</div>
			</div>
		</Fragment>
	);
}
