import { Fragment } from 'react';
import { useDispatch } from 'react-redux';
import { FormatCurrency } from '../../../../libs/helper';
import { deleteCart, updateCart } from '../../../../libs/store/slices';
import { useState } from 'react';
import { useEffect } from 'react';
import NewProductDetail from './../../product/detail/NewProductDetail';
import axios from 'axios';
import Loader from './../../../util/Loader';

export default function CartItem({ cart }) {
	const dispatch = useDispatch();
	const [productDetail, setProductDetail] = useState(null);

	const handleBlur = (e) => {
		if (Number(e.target.value) === 0) {
			dispatch(deleteCart(cart.productDetailId));
		}
	};

	useEffect(() => {
		const fetchProductDetails = async () => {
			const { status, data } = await axios.get(
				`/api/productdetails/${cart.productDetailId}`
			);
			if (status === 200) {
				setProductDetail(data);
			}
		};
		fetchProductDetails();
	}, []);

	const handleInputChange = (e) => {
		dispatch(updateCart([cart.productDetailId, e.target.value]));
	};

	return productDetail !== null ? (
		<Fragment>
			<img
				alt={cart.productDetailId}
				className='h-16 w-16 object-cover rounded-md shadow-sm m-2'
				src={`https://localhost:7028/api/images/get/${cart.images[0]?.url}`}
			/>
			<div className='flex flex-col gap-y-1'>
				<span className='font-semibold'>{`${productDetail.productName} - ${productDetail.unit}`}</span>
				<span>
					Giá bán:{' '}
					{Number(productDetail.currentDiscount) === 0 ? (
						<span>{FormatCurrency(productDetail.retailPrice)}/kg</span>
					) : Number(productDetail.currentDiscount) >= 100 ? (
						<span>
							{FormatCurrency(
								productDetail.retailPrice - productDetail.currentDiscount
							)}
							/kg
						</span>
					) : (
						<span>
							{FormatCurrency(
								productDetail.retailPrice *
									(1 - productDetail.currentDiscount / 100)
							)}
							/kg
						</span>
					)}
				</span>
				{productDetail.stock === 0 ? (
					<div>Sản phẩm đã hết hàng</div>
				) : (
					<div className='flex gap-x-2'>
						Số lượng:
						<input
							type='number'
							onClick={(e) => e.stopPropagation()}
							onBlur={handleBlur}
							onChange={handleInputChange}
							min={0}
							value={cart.quantity}
							className='w-20 h-6 rounded-md shadow-sm border-slate-400'
						/>
						kg
					</div>
				)}
			</div>
		</Fragment>
	) : (
		<Loader />
	);
}
