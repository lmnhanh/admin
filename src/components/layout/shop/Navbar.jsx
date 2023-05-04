import {
	faArrowRight,
	faBars,
	faCartShopping,
	faHistory,
	faLock,
	faSearch,
	faSignOut,
	faUser,
	faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Dropdown } from 'flowbite-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CartItem from './../../page/shop/cart/CartItem';
import { useDispatch, useSelector } from 'react-redux';
import { deleteCart, setAuthorized, setCarts, updateUsername } from '../../../libs/store/slices';
import { Fragment } from 'react';
import { replace } from 'formik';
import { useEffect } from 'react';

export default function NavBar() {
	const [expand, setExpand] = useState(false);
	const { carts, name } = useSelector((state) => state.app);
	const {authorized, refresh} = useSelector(state => state.auth);
	const navigate = useNavigate();
	const dispatch = useDispatch();

	useEffect(() => {
		if(authorized){
			dispatch(setCarts([]));
		}
	}, []);

	return (
		<div className='w-full fixed z-50 mx-auto h-15 bg-white border-b'>
			<div className='relative flex flex-col w-full p-3 mx-auto bg-white md:items-center md:justify-between md:flex-row md:px-6 lg:px-8'>
				<div className='flex flex-row items-center justify-between lg:justify-start'>
					<Link
						className='text-lg tracking-tight min-w-fit text-black font-semibold'
						to={'/shop/home'}>
						Hải Sản CM
					</Link>
					<button className='inline-flex items-center justify-center p-2 text-gray-400 hover:text-black focus:outline-none focus:text-black md:hidden'>
						<FontAwesomeIcon
							icon={faBars}
							onClick={() => setExpand((prev) => !prev)}
						/>
					</button>
				</div>
				<nav
					className={`items-center justify-between flex-grow ${
						expand ? 'flex flex-col' : 'hidden'
					} md:pb-0 md:flex md:justify-end md:flex-row`}>
					<div className='flex'>
						<a
							className='px-2 py-2 text-sm text-gray-500 lg:px-6 md:px-3 hover:text-blue-600'
							href='#'>
							Giới thiệu
						</a>
						<a
							className='px-2 py-2 text-sm text-gray-500 lg:px-6 md:px-3 hover:text-blue-600'
							href='#'>
							Liên hệ
						</a>

						<div className='hidden mx-10 md:block lg:ml-auto'>
							<div className='relative'>
								<span className='absolute inset-y-0 left-0 flex items-center pl-3'>
									<FontAwesomeIcon icon={faSearch} />
								</span>
								<input
									type='text'
									className='w-full py-2 pl-10 pr-4 text-black bg-white border border-gray-200 focus:outline-none focus:ring focus:ring-opacity-40 focus:ring-blue-500 sm:text-sm rounded-xl placeholder:text-gray-400 focus:border-blue-500'
									placeholder='Tìm kiếm'
								/>
							</div>
						</div>
					</div>

					<div className='inline-flex items-center gap-2 list-none'>
						<Dropdown
							className='w-1/2 md:w-2/5 lg:w-1/3'
							arrowIcon={false}
							inline={true}
							label={
								<span className='inline-flex items-center'>
									<FontAwesomeIcon icon={faCartShopping} className='mr-1' />
									{carts.length}
								</span>
							}>
							{carts.map((cart, index) => (
								<Dropdown.Item key={index} className='flex justify-between'>
									<CartItem cart={cart} />
									<FontAwesomeIcon
										icon={faXmark}
										className=' hover:text-red-600 w-5 h-5'
										title='Xóa'
										onClick={(e) => {
											e.stopPropagation();
											dispatch(deleteCart(cart.productDetailId));
										}}
									/>
								</Dropdown.Item>
							))}
							{carts.length !== 0 ? (
								<Fragment>
									<Dropdown.Divider />
									<Dropdown.Item className='justify-center'>
										<Button
											color={'gray'}
											className='bg-gradient-to-r min-w-fit from-green-200 to-cyan-100 hover:bg-gradient-to-l'
											size={'sm'}
											onClick={() => navigate('/shop/cart')}>
											Xem chi tiết giỏ hàng
											<FontAwesomeIcon icon={faArrowRight} className='ml-1' />
										</Button>
									</Dropdown.Item>
								</Fragment>
							) : (
								<Dropdown.Item>Giỏ hàng trống</Dropdown.Item>
							)}
						</Dropdown>
						{name ? (
							<Dropdown
								label={name}
								arrowIcon={false}
								color={'gray'}
								pill
								size={'sm'}
								className='min-w-fit text-sm shadow-sm hover:text-blue-600 font-semibold'>
								<Dropdown.Item
									className='hover:text-blue-500'
									icon={() => (
										<FontAwesomeIcon icon={faUser} className='mr-2' />
									)}>
									Chỉnh sửa thông tin
								</Dropdown.Item>
								<Dropdown.Item
									className='hover:text-blue-500'
									icon={() => (
										<FontAwesomeIcon icon={faLock} className='mr-2' />
									)}>
									Đổi mật khẩu
								</Dropdown.Item>
								<Dropdown.Item
									className='hover:text-blue-500'
									icon={() => (
										<FontAwesomeIcon icon={faHistory} className='mr-2' />
									)}>
									Lịch sử đơn hàng
								</Dropdown.Item>
								<Dropdown.Divider />
								<Dropdown.Item
									className='hover:text-blue-500 text-red-600'
									onClick={() => {
										dispatch(updateUsername(null));
										dispatch(setAuthorized(false));
									}}
									icon={() => (
										<FontAwesomeIcon icon={faSignOut} className='mr-2' />
									)}>
									Đăng xuất
								</Dropdown.Item>
							</Dropdown>
						) : (
							<Button
								color={'gray'}
								pill
								onClick={() => navigate('/shop/login')}
								size={'sm'}
								className='min-w-fit text-sm shadow-sm hover:text-blue-600 font-semibold'>
								Đăng nhập
							</Button>
						)}
					</div>
				</nav>
			</div>
		</div>
	);
}
