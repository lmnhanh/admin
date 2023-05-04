import {
	Label,
	TextInput,
	Badge,
	Button,
	Textarea,
	Table,
} from 'flowbite-react';
import { useFormik } from 'formik';
import { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import * as yup from 'yup';
import ToastPromise from '../../../util/ToastPromise';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FormatCurrency } from '../../../../libs/helper';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWarning } from '@fortawesome/free-solid-svg-icons';
import { useEffect } from 'react';
import Loader from '../../../util/Loader';
import { data } from 'autoprefixer';
import { deleteCart, setCarts } from '../../../../libs/store/slices';
import { list } from 'postcss';

export default function CheckOutPage() {
	const { carts } = useSelector((state) => state.app);
	const [selectedCarts, setSelectedCarts] = useState(
		carts.filter((cart) => cart.selected)
	);
	const [cartProducts, setCartProducts] = useState(null);
	const location = useLocation();
	const [total, setTotal] = useState(0);
	const navigate = useNavigate();
	const dispatch = useDispatch();

	useEffect(() => {
		document.title = 'Tạo đơn hàng';
		console.log(location.state);
		setTotal(location.state.total);
	}, []);

	const calcualteTotalPrices = useCallback(
		(selectedCarts, cartProducts = []) => {
			let temp = 0;
			selectedCarts.forEach((cart) => {
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
		[selectedCarts]
	);

	useEffect(() => {
		const selected = carts.filter((cart) => cart.selected);
		setSelectedCarts(selected);
		if (selected.length === 0) {
			navigate('/shop/home', { replace: true });
		} else {
			const fetchProductDetails = async () => {
				const listDetailIds = carts
					.filter((cart) => cart.selected)
					.map((cart) => cart.productDetailId);
				const { status, data } = await axios.get(
					`/api/productdetails/list?ids=${listDetailIds.join(',')}`
				);
				if (status === 200) {
					setCartProducts(data);
					calcualteTotalPrices(selected, data);
				}
			};
			fetchProductDetails();
		}
	}, [carts]);

	const formik = useFormik({
		initialValues: {
			fullName: '',
			phoneNumber: '',
			email: '',
			address: '',
			description: '',
			dateOfBirth: '',
			userId: null,
			total: 0,

			details: [],
			productDetailId: 0,
			quantity: 1,

			stock: 0,
		},
		validationSchema: yup.object({
			fullName: yup
				.string()
				.max(50, 'Tối đa 50 kí tự')
				.required('Họ và tên không được trống!'),
			phoneNumber: yup
				.string()
				.max(15, 'Tối đa 15 kí tự!')
				.required('Số điện thoại không được trống'),
			email: yup
				.string()
				.email('Email không hợp lệ')
				.max(100, 'Tối đa 100 kí tự')
				.required('Email không được trống'),
			address: yup
				.string()
				.max(50, 'Tối đa 50 kí tự')
				.required('Địa chỉ không được trống'),
			description: yup.string().max(100, 'Tối đa 100 kí tự'),
		}),
		onSubmit: (values) => {
			Swal.fire({
				title: 'Xác nhận đặt hàng',
				text: 'Đảm bảo rằng bạn kiểm tra kỹ thông tin đặt hàng',
				icon: 'question',
				confirmButtonColor: '#108506',
				confirmButtonText: 'Đặt hàng',
			}).then((result) => {
				result.isConfirmed &&
					ToastPromise(
						axios.post('/api/orders/', {
							description: `Họ tên: ${values.fullName}. SĐT: ${values.phoneNumber}. Email: ${values.email}. Địa chỉ: ${values.address}. Chú thích: ${values.description}`,
							userId: values.userId,
							total: location.state.total,
							carts: selectedCarts.map((cart) => ({
								userId: values.userId,
								productDetailId: cart.productDetailId,
								quantity: cart.quantity,
							})),
						}),
						{
							pending: 'Đang gửi yêu cầu',
							success: (response) => {
								navigate('/shop/home', { replace: true });
								const listSelectedIds = selectedCarts.map(
									(select) => select.productDetailId
								);
								dispatch(
									setCarts(
										carts.filter(
											(cart) =>
												listSelectedIds.findIndex(
													(id) => Number(id) === Number(cart.productDetailId)
												) !== -1
										)
									)
								);
								return (
									<div>
										Đã thêm đơn bán hàng
										<Link to={`/shop/order/${response.data.id}`} replace={true}>
											<Badge size={'xs'} className='w-fit' color={'info'}>
												Xem chi tiết
											</Badge>
										</Link>
									</div>
								);
							},
							error: (error) => {
								return 'Lỗi! Không thể gửi yêu cầu!';
							},
						}
					);
			});
		},
	});

	return (
		<div className='m-2'>
			<div className='text-lg font-semibold uppercase'>Thông tin đặt hàng</div>
			<main className='grid grid-cols-1 lg:grid-cols-12 gap-x-5 gap-y-7 m-2'>
				<div className='col-span-1 lg:col-span-5 border-r pr-3 grid grid-cols-1 gap-y-2'>
					<div>
						<Label htmlFor='fullName' className='min-w-fit'>
							Họ và tên <span className='text-red-500'>*</span>
						</Label>
						<TextInput
							id={'fullName'}
							className='grow'
							title={'Họ và tên'}
							name={'fullName'}
							type={'text'}
							value={formik.values.fullName}
							onChange={formik.handleChange}
							placeholder={'Lê Văn A'}
							color={
								formik.touched.fullName && formik.errors.fullName
									? 'failure'
									: 'gray'
							}
							helperText={
								<span>
									{formik.touched.fullName && formik.errors.fullName && (
										<span>
											<FontAwesomeIcon icon={faWarning} className='px-1' />
											{formik.errors.fullName}
										</span>
									)}
								</span>
							}
						/>
					</div>
					<div>
						<Label htmlFor='phoneNumber' className='min-w-fit'>
							Số điện thoại <span className='text-red-500'>*</span>
						</Label>
						<TextInput
							id={'phoneNumber'}
							className='grow'
							title={'Số điện thoại'}
							name={'phoneNumber'}
							type={'number'}
							value={formik.values.phoneNumber}
							onChange={formik.handleChange}
							placeholder={'0123453533'}
							color={
								formik.touched.phoneNumber && formik.errors.phoneNumber
									? 'failure'
									: 'gray'
							}
							helperText={
								<span>
									{formik.touched.phoneNumber && formik.errors.phoneNumber && (
										<span>
											<FontAwesomeIcon icon={faWarning} className='px-1' />
											{formik.errors.phoneNumber}
										</span>
									)}
								</span>
							}
						/>
					</div>
					<div>
						<Label htmlFor='email' className='min-w-fit'>
							Email <span className='text-red-500'>*</span>
						</Label>
						<TextInput
							id={'email'}
							className='grow'
							title={'email'}
							name={'email'}
							type={'email'}
							value={formik.values.email}
							onChange={formik.handleChange}
							placeholder={'lvana@mail.com.vn'}
							color={
								formik.touched.email && formik.errors.email ? 'failure' : 'gray'
							}
							helperText={
								<span>
									{formik.touched.email && formik.errors.email && (
										<span>
											<FontAwesomeIcon icon={faWarning} className='px-1' />
											{formik.errors.email}
										</span>
									)}
								</span>
							}
						/>
					</div>
					<div>
						<Label htmlFor='dateOfBirth' className='min-w-fit'>
							Ngày sinh
						</Label>
						<TextInput
							className='grow'
							id={'dateOfBirth'}
							title={'Ngày sinh'}
							name={'dateOfBirth'}
							type={'date'}
							value={formik.values.dateOfBirth}
							onChange={formik.handleChange}
							placeholder={'dd/MM/yyyy'}
							color={
								formik.touched.dateOfBirth && formik.errors.dateOfBirth
									? 'failure'
									: 'gray'
							}
						/>
					</div>
					<div>
						<Label htmlFor='address' className='min-w-fit'>
							Địa chỉ <span className='text-red-500'>*</span>
						</Label>
						<Textarea
							className='grow'
							id={'address'}
							title={'address'}
							name={'address'}
							type={'date'}
							value={formik.values.address}
							onChange={formik.handleChange}
							color={
								formik.touched.address && formik.errors.address
									? 'failure'
									: 'gray'
							}
							helperText={
								<span>
									{formik.touched.address && formik.errors.address && (
										<span>
											<FontAwesomeIcon icon={faWarning} className='px-1' />
											{formik.errors.address}
										</span>
									)}
								</span>
							}
						/>
					</div>
					<div>
						<Label htmlFor='description' className='min-w-fit'>
							Chú thích cho người bán
						</Label>
						<Textarea
							rows={2}
							className='grow'
							id={'description'}
							title={'Chú thích cho người bán hàng'}
							name={'description'}
							type={'date'}
							value={formik.values.description}
							onChange={formik.handleChange}
							color={
								formik.touched.description && formik.errors.description
									? 'failure'
									: 'gray'
							}
							helperText={
								<span>
									{formik.touched.description && formik.errors.description && (
										<span>
											<FontAwesomeIcon icon={faWarning} className='px-1' />
											{formik.errors.description}
										</span>
									)}
								</span>
							}
						/>
					</div>
				</div>
				<div className='col-span-1 lg:col-span-7'>
					<div className='text-lg font-semibold uppercase m-2'>
						Chi tiết đơn hàng
					</div>
					{cartProducts !== null ? (
						<Table hoverable={true}>
							<Table.Head className='bg-gradient-to-b from-green-200 to-green-100'>
								<Table.HeadCell className='sr-only'></Table.HeadCell>
								<Table.HeadCell>Sản phẩm</Table.HeadCell>
								<Table.HeadCell>Tổng</Table.HeadCell>
							</Table.Head>
							<Table.Body className='divide-y'>
								{cartProducts.map((detail, index) => {
									let tagretCart = carts.find(
										(cart) => Number(cart.productDetailId) == Number(detail.id)
									);
									let price =
										Number(detail.currentDiscount) === 0
											? detail.retailPrice
											: Number(detail.currentDiscount) >= 100
											? detail.retailPrice - detail.currentDiscount
											: detail.retailPrice * (1 - detail.currentDiscount / 100);

									return (
										tagretCart && (
											<Table.Row key={index}>
												<Table.Cell className='inline-flex'>
													{tagretCart?.images[0]?.url && (
														<img
															alt={tagretCart.productDetailId}
															className='h-16 w-16 object-cover rounded-md shadow-sm m-2'
															src={`https://localhost:7028/api/images/get/${tagretCart.images[0]?.url}`}
														/>
													)}
													{tagretCart?.images[1]?.url && (
														<img
															alt={tagretCart.productDetailId}
															className='h-16 w-16 object-cover rounded-md shadow-sm m-2'
															src={`https://localhost:7028/api/images/get/${tagretCart.images[1]?.url}`}
														/>
													)}
												</Table.Cell>
												<Table.Cell>
													<div className='flex flex-col gap-y-1'>
														<span className='font-semibold'>{`${detail.productName} - ${detail.unit}`}</span>
														<span>
															Giá bán:{' '}
															{Number(detail.currentDiscount) === 0 ? (
																<span>
																	{FormatCurrency(detail.retailPrice)}
																	/kg
																</span>
															) : Number(detail.currentDiscount) >= 100 ? (
																<span>
																	{FormatCurrency(
																		detail.retailPrice - detail.currentDiscount
																	)}
																	/kg
																</span>
															) : (
																<span>
																	{FormatCurrency(
																		detail.retailPrice *
																			(1 - detail.currentDiscount / 100)
																	)}
																	/kg
																</span>
															)}
														</span>
														<div className='flex gap-x-2'>
															Số lượng: {tagretCart?.quantity}
														</div>
													</div>
												</Table.Cell>
												<Table.Cell className='font-bold'>
													{FormatCurrency(tagretCart?.quantity * price)}
												</Table.Cell>
											</Table.Row>
										)
									);
								})}
								<Table.Row>
									<Table.Cell></Table.Cell>
									<Table.Cell className='font-bold'>
										Tổng giá trị đơn hàng:
									</Table.Cell>
									<Table.Cell className='text-lg font-bold'>
										{FormatCurrency(total)}
									</Table.Cell>
								</Table.Row>
							</Table.Body>
						</Table>
					) : (
						<Loader />
					)}

					<Button onClick={formik.handleSubmit}>Tao don hang</Button>
				</div>
			</main>
		</div>
	);
}
