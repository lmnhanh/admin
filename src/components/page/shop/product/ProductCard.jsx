import { Badge, Button } from 'flowbite-react';
import { FormatCurrency } from './../../../../libs/helper';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartPlus } from '@fortawesome/free-solid-svg-icons';
import { Fragment, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addCart } from '../../../../libs/store/slices';
import Swal from 'sweetalert2';
import ProductShopInfoPage from './ProductShopInfoPage';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function ProductCard({ product }) {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { authorized, id } = useSelector((state) => state.auth);
	const [cartQuantity, setCartQuantity] = useState(1);

	const handleAddCart = () => {
		if(authorized){
			const addCart = async ()=>{
				const { status }= await axios.post('/api/orders/cart', {
					quantity: cartQuantity,
					realQuantity: 0,
					productDetailId: product.details[0].id,
					userid: id
				});
				if(status === 201){
					Swal.fire({
						title: 'Thêm giỏ hàng thành công',
						text: `+${cartQuantity} kg ${product.details[0].unit}`,
						icon: 'success',
						confirmButtonColor: '#3085d6',
						confirmButtonText: 'Đóng',
					});
				}
			}
			addCart();
		}else{
			dispatch(addCart([product.details[0].id, product.images, cartQuantity]));
			Swal.fire({
				title: 'Thêm giỏ hàng thành công',
				text: `+${cartQuantity} kg ${product.details[0].unit}`,
				icon: 'success',
				confirmButtonColor: '#3085d6',
				confirmButtonText: 'Đóng',
			});
		}
	};

	const handleInputChange = (e) => {
		if (e.target.value < 0) {
			e.target.value = 1;
			return;
		}
		setCartQuantity(e.target.value);
	};

	return (
		<Fragment>
			<div
				className='shadow-md overflow-hidden rounded-sm cursor-pointer relative p-2'
				onClick={() => navigate(`/shop/product/${product.id}`)}>
				{Number(product.currentDiscount) <= 100 &&
					Number(product.currentDiscount) !== 0 && (
						<Badge
							color={'failure'}
							size={'xs'}
							className='w-fit rounded-md absolute top-1 right-1 z-20'>
							-{product.currentDiscount}%
						</Badge>
					)}
				<img
					alt={product.name}
					className='h-52 object-cover rounded-md shadow-sm hover:scale-105 transition duration-200 ease-in-out transform'
					src={`https://localhost:7028/api/images/get/${product.images[0]?.url}`}
				/>
				<div className='mt-2 font-semibold'>{product.name}</div>
				<div className='flex items-center relative'>
					Loại: {product.details[0].unit}
					{product.details.length - 1 > 0 && (
						<Badge className='text-end right-0 absolute' color={'success'}>
							+{product.details.length - 1} lựa chọn
						</Badge>
					)}
				</div>
				<div className='inline-flex gap-x-2 items-center'>
					Giá bán:
					{Number(product.currentDiscount) === 0 ? (
						<span>
							{FormatCurrency(
								authorized
									? product.details[0].wholePrice
									: product.details[0].retailPrice
							)}
							/kg
						</span>
					) : (
						<Fragment>
							<span className='line-through'>
								{FormatCurrency(
									authorized
										? product.details[0].wholePrice
										: product.details[0].retailPrice
								)}
							</span>
							{Number(product.currentDiscount) >= 100 ? (
								<span>
									{FormatCurrency(
										(authorized
											? product.details[0].wholePrice
											: product.details[0].retailPrice) -
											product.currentDiscount
									)}
									/kg
								</span>
							) : (
								<span>
									{FormatCurrency(
										(authorized
											? product.details[0].wholePrice
											: product.details[0].retailPrice) *
											(1 - product.currentDiscount / 100)
									)}
									/kg
								</span>
							)}
						</Fragment>
					)}
				</div>
				<div className='flex justify-between items-center'>
					<div className='flex gap-x-2'>
						Số lượng:
						<input
							type='number'
							onClick={(e) => e.stopPropagation()}
							onChange={handleInputChange}
							min={1}
							defaultValue={cartQuantity}
							className='w-16 h-6 rounded-md shadow-md border-slate-400'
						/>
						kg
					</div>
					<Button
						color={'gray'}
						onClick={(e) => {
							e.stopPropagation();
							handleAddCart();
						}}
						className='shrink bg-gradient-to-t focus:ring-0 rounded-md from-blue-400 to-blue-300'
						size={'xs'}>
						<FontAwesomeIcon icon={faCartPlus} className='mr-1' />
						Thêm
					</Button>
				</div>

				{/* <div className='flex gap-2 items-center'>
				<Button className='grow bg-gradient-to-r rounded-sm from-green-300 to-cyan-200' color={'gray'} size={'sm'}>
					Mua ngay
				</Button>
				<Button color={'gray'} className='shrink bg-gradient-to-r rounded-sm from-blue-400 to-blue-300' size={'sm'}>
					<FontAwesomeIcon icon={faCartPlus} className='mr-1'/> Thêm giỏ hàng
				</Button>
			</div> */}
			</div>
		</Fragment>
	);
}
