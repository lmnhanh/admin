import { Badge, Button, Modal, TextInput } from 'flowbite-react';
import { Fragment, useEffect, useState } from 'react';
import Loader from '../../../util/Loader';
import axios from 'axios';
import ImageGallery from 'react-image-gallery';
import './imageGallery.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faArrowLeft,
	faArrowRight,
	faCartPlus,
	faCheck,
} from '@fortawesome/free-solid-svg-icons';
import { FormatCurrency } from '../../../../libs/helper';
import { useNavigate, useParams } from 'react-router-dom';
import { addCart } from '../../../../libs/store/slices';
import Swal from 'sweetalert2';
import { useDispatch } from 'react-redux';

export default function ProductShopInfoPage() {
	const [product, setProduct] = useState(null);
	const [cartQuantity, setCartQuantity] = useState(1);
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const [selectedDetail, setSelectedDetail] = useState(null);
	const { id } = useParams();

	const handleDetailBadgeClick = (detailId) => {
		setSelectedDetail(detailId);
	};

	const handleAddCart = () => {
		dispatch(addCart([selectedDetail, product, cartQuantity]));
		var targetDetail = product.details.find(
			(detail) => detail.id === selectedDetail
		);
		Swal.fire({
			title: 'Thêm giỏ hàng thành công',
			text: `+${cartQuantity} kg ${product.name} loại ${targetDetail.unit}`,
			icon: 'success',
			confirmButtonColor: '#3085d6',
			confirmButtonText: 'Đóng',
		});
	};

	const handleInputChange = (e) => {
		var targetDetail = product.details.find(
			(detail) => detail.id === selectedDetail
		);
		if (e.target.value < 0 || e.target.value > targetDetail.stock) {
			e.target.value = 1;
			return;
		}
		setCartQuantity(e.target.value);
	};

	useEffect(() => {
		const fetchProduct = async () => {
			const { status, data } = await axios.get(`/api/products/${id}`);
			if (status === 200) {
				setProduct(data);
				setSelectedDetail(data.details[0].id);
			}
		};
		fetchProduct();
	}, []);

	return (
		<div className='min-w-min overflow-hidden p-2'>
			{product !== null ? (
				<Fragment>
					<div className='flex flex-col md:flex-row gap-4'>
						<div className='w-full'>
							<ImageGallery
								id={'productInfo'}
								items={product.images.map((item) => ({
									original: `https://localhost:7028/api/images/get/${item.url}`,
									thumbnail: `https://localhost:7028/api/images/get/${item.url}`,
								}))}
								lazyLoad={true}
								showNav={false}
								slideOnThumbnailOver={true}
							/>
						</div>
						<div className='flex flex-col gap-1'>
							<div className='text-2xl my-2 font-semibold'>{product?.name}</div>

							<div className='flex flex-wrap gap-2 mb-2'>
								<span className='font-semibold'>Loại: </span>
								{product.details.map((detail, index) => (
									<Badge
										key={detail.id}
										color={'gray'}
										onClick={() => handleDetailBadgeClick(detail.id)}
										className='bg-gradient-to-r min-w-fit from-green-200 to-green-100 rounded-full px-4 cursor-pointer text-black'
										size={'md'}>
										{selectedDetail === detail.id && (
											<FontAwesomeIcon
												icon={faCheck}
												className='text-green-700 mr-2'
											/>
										)}
										{detail.unit}
									</Badge>
								))}
							</div>
							<div className='flex flex-wrap gap-2 mb-2'>
								{product.details.map(
									(detail, index) =>
										selectedDetail === detail.id && (
											<Fragment key={index}>{detail.description}</Fragment>
										)
								)}
							</div>
							<div className='flex justify-between'>
								<div>
									<span className='font-semibold mr-2'>Giá bán: </span>
									{product.details.map(
										(detail, index) =>
											detail.id === selectedDetail &&
											(Number(product.currentDiscount) === 0 ? (
												<span key={index}>
													{FormatCurrency(detail.retailPrice)}/kg
												</span>
											) : (
												<Fragment key={detail.id}>
													<span className='line-through mr-2' key={index}>
														{FormatCurrency(detail.retailPrice)}
													</span>
													{Number(product.currentDiscount) >= 100 ? (
														<span>
															{FormatCurrency(
																detail.retailPrice - product.currentDiscount
															)}
															/kg
														</span>
													) : (
														<span>
															{FormatCurrency(
																detail.retailPrice *
																	(1 - product.currentDiscount / 100)
															)}
															/kg
														</span>
													)}
												</Fragment>
											))
									)}
								</div>
								<div>
									<span className='font-semibold mr-2'>Giá bán sỉ: </span>
									{product.details.map(
										(detail, index) =>
											detail.id === selectedDetail &&
											(Number(product.currentDiscount) === 0 ? (
												<span key={index}>
													{FormatCurrency(detail.wholePrice)}/kg
												</span>
											) : (
												<Fragment key={detail.id}>
													<span className='line-through mr-2'>
														{FormatCurrency(detail.wholePrice)}
													</span>
													{Number(product.currentDiscount) >= 100 ? (
														<span>
															{FormatCurrency(
																detail.wholePrice - product.currentDiscount
															)}
															/kg
														</span>
													) : (
														<span>
															{FormatCurrency(
																detail.wholePrice *
																	(1 - product.currentDiscount / 100)
															)}
															/kg ({`khi mua trên ${detail.toWholesale} kg`})
														</span>
													)}
												</Fragment>
											))
									)}
								</div>
							</div>
							{product.details.map(
								(detail, index) =>
									detail.id === selectedDetail && (
										<Fragment key={index}>
											<div>
												<span className='font-semibold mr-2'>
													Số lượng còn lại:{' '}
												</span>
												<span key={index}>{detail.stock} kg</span>
											</div>
											{detail.stock > 0 && (
												<Fragment>
													<div className='flex gap-x-2'>
														<span className='font-semibold mr-2'>
															Số lượng mua:{' '}
														</span>
														<input
															type='number'
															onClick={(e) => e.stopPropagation()}
															onChange={handleInputChange}
															min={1}
															max={detail.stock}
															value={cartQuantity}
															className='w-16 h-6 rounded-md shadow-md border-slate-400'
														/>
														kg
													</div>
													<div className='flex gap-x-2 items-center justify-center mt-2'>
														<Button
															onClick={handleAddCart}
															size={'sm'}
															color={'gray'}
															className='min-w-fit bg-gradient-to-r shadow-md from-green-200 to-green-100 cursor-pointer text-black'>
															<FontAwesomeIcon
																icon={faCartPlus}
																className='mr-1'
															/>
															Thêm vào giỏ hàng
														</Button>
														hoặc
														<Button
															size={'sm'}
															color={'gray'}
															className='min-w-fit bg-gradient-to-r from-blue-200 to-cyan-100 cursor-pointer text-black'>
															Mua ngay
															<FontAwesomeIcon
																icon={faArrowRight}
																className='ml-1'
															/>
														</Button>
													</div>
												</Fragment>
											)}
										</Fragment>
									)
							)}
							<p
								className='max-h-52 mb-2 overflow-y-auto border-t mt-2'
								dangerouslySetInnerHTML={{
									__html: product.description,
								}}></p>
						</div>
					</div>
				</Fragment>
			) : (
				<Loader className='h-56' />
			)}
		</div>
	);
}
