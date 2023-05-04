import axios from 'axios';
import { Badge, Button, Checkbox, Table } from 'flowbite-react';
import { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../../../util/Loader';
import { FormatCurrency } from '../../../../libs/helper';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faArrowLeft,
	faArrowRight,
	faTrash,
} from '@fortawesome/free-solid-svg-icons';
import {
	deleteCart,
	toggleSelectAll,
	toggleSelectCart,
	updateCart,
} from '../../../../libs/store/slices';
import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';
import Swal from 'sweetalert2';

export default function CartDetailPage() {
	const [cartProducts, setCartProducts] = useState(null);
	const { carts } = useSelector((state) => state.app);
	const [total, setTotal] = useState(0);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	useEffect(() => {
		document.title = 'Giỏ hàng';
		const fetchProductDetails = async () => {
			const listDetailIds = carts.map((cart) => cart.productDetailId);
			const { status, data } = await axios.get(
				`/api/productdetails/list?ids=${listDetailIds.join(',')}`
			);
			if (status === 200) {
				setCartProducts(data.filter(cart => cart.stock > 0));
				calcualteTotalPrices(data);
			}
		};
		carts.length === 0 ? setCartProducts([]) : fetchProductDetails();
	}, []);

	const calcualteTotalPrices = useCallback(
		(cartProducts) => {
			let temp = 0;
			carts
				.filter((cart) => cart.selected)
				.forEach((cart) => {
					let targetProduct = cartProducts?.find(
						(detail) => Number(cart.productDetailId) === detail.id
					);

					let targetPrice = Number(
						targetProduct?.toWholesale >= Number(cart?.quantity)
							? targetProduct?.retailPrice
							: targetProduct?.wholePrice
					);

					Number(targetProduct?.currentDiscount) >= 0 &&
					Number(targetProduct?.currentDiscount) >= 100
						? (targetPrice -= Number(targetProduct?.currentDiscount))
						: (targetPrice *= 1 - Number(targetProduct?.currentDiscount) / 100);
					temp = temp + Number(targetPrice) * Number(cart.quantity);
				});
			setTotal(temp);
		},
		[carts]
	);

	useEffect(() => {
		calcualteTotalPrices(cartProducts);
	}, [carts]);

	const handleBlur = (productDetailId, quantity) => {
		if (Number(quantity) === 0) {
			dispatch(deleteCart(productDetailId));
		}
	};

	const handleNavigateToOrderPage = (total) => {
		navigate('/shop/order/new', {state: {
			total: total
		}})
	};

	const handleInputChange = (productDetailId, quantity) => {
		dispatch(updateCart([productDetailId, quantity]));
	};

	return cartProducts !== null ? (
		<div className='m-2'>
			<div className='text-lg uppercase font-semibold'>Giỏ hàng của bạn</div>
			{cartProducts.length !== 0 ? (
				<Fragment>
					<Table hoverable={true}>
						<Table.Head className=' bg-gradient-to-b from-green-200 to-green-100'>
							<Table.HeadCell>Hình ảnh</Table.HeadCell>
							<Table.HeadCell>Tên sản phẩm</Table.HeadCell>
							<Table.HeadCell>Số lượng</Table.HeadCell>
							<Table.HeadCell>Giá hiện tại</Table.HeadCell>
							<Table.HeadCell>Tổng</Table.HeadCell>
							<Table.HeadCell>
								<Checkbox
									id='all'
									checked={carts.every((cart) => cart.selected)}
									onChange={() => dispatch(toggleSelectAll())}
								/>{' '}
								<label htmlFor='all' className='ml-2 cursor-pointer'>
									Chọn tất cả
								</label>
							</Table.HeadCell>
							<Table.HeadCell className='sr-only'>Xóa</Table.HeadCell>
						</Table.Head>
						<Table.Body className='divide-y'>
							{carts.length !== 0 &&
								cartProducts.map((detail, index) => {
									let targetCart = carts.find(
										(cart) => Number(cart.productDetailId) === detail.id
									);
									let targetPrice =
										detail.toWholesale >= targetCart?.quantity
											? detail.retailPrice
											: detail.wholePrice;

									Number(detail.currentDiscount) >= 0 && (
										<Fragment>
											{Number(detail.currentDiscount) >= 100 ? (
												<span>
													{FormatCurrency(
														(targetPrice -= detail.currentDiscount)
													)}
													/kg
												</span>
											) : (
												<span>
													{FormatCurrency(
														(targetPrice *= 1 - detail.currentDiscount / 100)
													)}
													/kg
												</span>
											)}
										</Fragment>
									);
									return (
										targetCart && (
											<Table.Row key={index} className='font-semibold text-md'>
												<Table.Cell>
													<div className='flex gap-x-1'>
														{targetCart.images[0]?.url && (
															<img
																alt={targetCart.productDetailId}
																className='h-16 w-16 object-cover rounded-md shadow-sm'
																src={`https://localhost:7028/api/images/get/${targetCart.images[0]?.url}`}
															/>
														)}
														{targetCart.images[1]?.url && (
															<img
																alt={targetCart.productDetailId}
																className='h-16 w-16 object-cover rounded-md shadow-sm'
																src={`https://localhost:7028/api/images/get/${targetCart.images[1]?.url}`}
															/>
														)}
													</div>
												</Table.Cell>
												<Table.Cell>{`${detail.productName} - ${detail.unit}`}</Table.Cell>
												<Table.Cell>
													<input
														type='number'
														onBlur={(e) =>
															handleBlur(
																targetCart.productDetailId,
																e.target.value
															)
														}
														onChange={(e) => {
															if (
																e.target.value < 0 ||
																e.target.value > detail.stock
															) {
																Swal.fire({
																	title: 'Số lượng vượt quá số lượng tồn',
																	text: `Số lượng còn lại của sản phẩm: ${detail.stock} kg`,
																	icon: 'info',
																	confirmButtonColor: '#3085d6',
																	confirmButtonText: 'Đóng',
																})
																return;
															}
															handleInputChange(
																targetCart.productDetailId,
																e.target.value
															);
														}}
														min={0}
														max={detail.stock}
														value={targetCart?.quantity}
														className='w-20 h-6 mr-2 rounded-md shadow-sm border-slate-400'
													/>
													kg
												</Table.Cell>
												<Table.Cell>
													<div className='flex gap-x-2'>
														{FormatCurrency(targetPrice)}
														<Badge className=''>
															{detail.toWholesale >= targetCart?.quantity
																? 'Giá bán lẻ'
																: 'Giá bán sỉ'}
														</Badge>
													</div>
												</Table.Cell>
												<Table.Cell>
													{FormatCurrency(targetCart?.quantity * targetPrice)}
												</Table.Cell>
												<Table.Cell>
													<Checkbox
														onChange={() => {
															dispatch(toggleSelectCart(detail.id));
														}}
														id={targetCart.productDetailId}
														checked={
															carts.find(
																(cart) => cart.productDetailId === detail.id
															).selected
														}
													/>
													<label
														htmlFor={targetCart.productDetailId}
														className='ml-2 cursor-pointer'>
														Chọn
													</label>
												</Table.Cell>
												<Table.Cell>
													<FontAwesomeIcon
														onClick={() =>
															dispatch(deleteCart(targetCart.productDetailId))
														}
														icon={faTrash}
														title='Xóa'
														className='w-4 h-4 text-red-500 hover:text-red-600 cursor-pointer'
													/>
												</Table.Cell>
											</Table.Row>
										)
									);
								})}
						</Table.Body>
					</Table>
					<Button
						size={'sm'}
						color={'gray'}
						disabled={carts.every(cart => !cart.selected) || total === 0}
						pill
						onClick={()=>handleNavigateToOrderPage(total)}
						className='min-w-fit mx-auto mt-2 text-sm shadow-sm hover:text-blue-600 font-semibold  bg-gradient-to-r from-green-200 to-cyan-100 hover:bg-gradient-to-l'>
						Tổng: {FormatCurrency(total)}
						<FontAwesomeIcon icon={faArrowRight} className='ml-1' />
					</Button>
				</Fragment>
			) : (
				<div className='flex flex-col h-1/2 items-center gap-y-2 justify-center'>
					<div className='text-lg font-semibold'>Giỏ hàng trống</div>
					<Button
						gradientDuoTone={'tealToLime'}
						size={'xs'}
						onClick={() => navigate('/shop', { replace: true })}>
						<FontAwesomeIcon icon={faArrowLeft} className='mr-1' />
						Về trang sản phẩm
					</Button>
				</div>
			)}
		</div>
	) : (
		<Loader />
	);
}
