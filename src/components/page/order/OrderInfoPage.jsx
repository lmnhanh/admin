import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Loader from '../../util/Loader';
import { useDispatch } from 'react-redux';
import { setAuthorized } from '../../../libs/store/slices';
import { Fragment, useEffect, useState, useCallback } from 'react';
import BreadcrumbPath from '../../util/BreadCrumbPath';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faArrowLeft,
	faCheck,
	faCheckToSlot,
	faClock,
	faDollar,
	faHome,
	faUserCheck,
	faWarning,
	faXmark,
} from '@fortawesome/free-solid-svg-icons';
import {
	Badge,
	Button,
	Card,
	Modal,
	Table,
	Label,
	TextInput,
	Textarea,
} from 'flowbite-react';
import 'react-image-gallery/styles/css/image-gallery.css';
import '../product/imageGallery.css';
import ToastPromise from '../../util/ToastPromise';
import { useFormik } from 'formik';
import * as yup from 'yup';
import FilterBadge from '../../util/FilterBadge';
import { FormatCurrency, ParseToDate } from '../../../libs/helper';

export default function OrderInfoPage(props) {
	const { id } = useParams();
	const [order, setOrder] = useState(null);
	const [processing, setProcessing] = useState(false);
	const [selectedCart, setSelectedCart] = useState(null);
	const [showModal, setShowModal] = useState(false);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const formik = useFormik({
		initialValues: {
			id: id,
			userId: null,
			description: '',
			total: 1,
			carts: [],

			price: 0,
			quantity: 1,
			productDetailId: 0,
			realQuantity: 1,
		},
		validationSchema: yup.object({
			description: yup
				.string()
				.max(500, 'Tối đa 500 kí tự')
				.required('Chú thích về đơn hàng là bắt buộc!'),
			realQuantity: yup
				.number()
				.min(1, 'Số lượng giao không hợp lệ')
				.required('Số lượng giao không được trống'),
		}),
		onSubmit: (values) => {
			console.log(values);
			ToastPromise(axios.put(`/api/orders/${id}`, values), {
				pending: 'Đang lưu thông tin đơn hàng',
				success: (response) => {
					fetchOrder();
					return <div>Đã lưu thông tin đơn hàng</div>;
				},
				error: (error) => {
					return 'Lỗi! Không thể lưu thông tin đơn hàng!';
				},
			});
		},
	});

	const handleToggleModal = () => {
		setShowModal((prev) => !prev);
		formik.setErrors({realQuantity: undefined})
	};

	const fetchOrder = useCallback(async () => {
		const { status, data } = await axios.get(`/api/orders/${id}`);
		if (status === 200 && data) {
			setOrder(data);
			formik.values.description = data.description;
			formik.values.carts = data.carts.map((detail) => ({
				userId: detail.user?.id ?? null,
				toWholesale: detail.productDetail.toWholesale,
				retailPrice: detail.productDetail.retailPrice,
				wholePrice: detail.productDetail.wholePrice,
				id: detail.id,
				unit: detail.productDetail.unit,
				productName: detail.productDetail.productName,
				productDetailId: detail.productDetail.id,
				price:
					data.user === null
						? detail.quantity >= detail.productDetail.toWholesale
							? detail.productDetail.wholePrice
							: detail.productDetail.retailPrice
						: detail.productDetail.wholePrice,
				quantity: detail.quantity,
				realQuantity: detail.realQuantity,
			}));
		}
	}, [id]);

	const handleRowClick = (cart) => {
		handleToggleModal();
		setProcessing(true);
		setSelectedCart(cart);
		formik.values.price = cart.price;
		formik.values.cartId = cart.id;
		formik.values.productDetailId = cart.productDetailId;
		formik.values.quantity = cart.quantity;
		formik.values.realQuantity = cart.quantity;
	};

	useEffect(() => {
		document.title = 'Thông tin đơn bán hàng';
		try {
			fetchOrder();
		} catch (error) {
			if (error.response.status === 401 || error.response.status === 403) {
				dispatch(setAuthorized({ authorized: false }));
			}
		}
	}, [id, fetchOrder, dispatch]);

	return order !== null ? (
		<Fragment>
			<BreadcrumbPath
				items={[
					{
						to: '/',
						text: (
							<>
								<FontAwesomeIcon icon={faHome} /> Home
							</>
						),
					},
					{ to: '/order', text: 'Đơn bán hàng' },
					{ to: `/order/${id}`, text: 'Thông tin đơn bán hàng' },
				]}
			/>
			<Modal
				show={processing && showModal}
				dismissible={true}
				size={'lg'}
				onClose={handleToggleModal}>
				<Modal.Header>{`${selectedCart?.productName}: ${selectedCart?.unit}`}</Modal.Header>
				<Modal.Body className='flex flex-col'>
					<label htmlFor='quantity'>
						Số lượng đặt:{' '}
						<span className='font-semibold'>{formik.values.quantity} kg</span>
					</label>
					<div>
						<label htmlFor='realQuantity'>
							Số lượng sẽ giao:
							<span className='font-semibold'>
								{' '}
								{formik.values.realQuantity} kg
							</span>
						</label>
						<TextInput
							sizing={'sm'}
							min={0}
							type={'number'}
							id={'realQuantity'}
							name={'realQuantity'}
							onChange={formik.handleChange}
							value={formik.values.realQuantity}
							placeholder={formik.values.realQuantity}
							color={formik.errors.realQuantity && 'failure'}
							helperText={
								formik.errors.realQuantity && (
									<span>
										<FontAwesomeIcon icon={faWarning} className='px-1' />
										{formik.errors.realQuantity}
									</span>
								)
							}
						/>
					</div>
					<div className='flex gap-2'>
						<span className='grow flex gap-x-2 items-center'>
							Đơn giá bán:{' '}
							<span className='font-semibold'>
								{FormatCurrency(selectedCart?.userId === null
						? formik.values.realQuantity >= selectedCart?.toWholesale
							? selectedCart?.wholePrice
							: selectedCart?.retailPrice
						: selectedCart?.wholePrice,)}
							</span>
							<Badge size={'xs'} color={'success'} className={'w-fit'}>
								{selectedCart?.user === null
									? formik.values.realQuantity >=
									  selectedCart?.toWholesale
										? 'Giá sỉ'
										: 'Giá lẻ'
									: 'Giá sỉ'}
							</Badge>
						</span>
						<span className='grow'>
							Tổng:{' '}
							<span className='font-semibold'>
								{FormatCurrency(
									formik.values.price * formik.values.realQuantity
								)}
							</span>
						</span>
					</div>
					<Button
						size={'xs'}
						className='w-fit px-3 mt-2 self-center'
						gradientDuoTone={'cyanToBlue'}
						onClick={() => {
							formik.values.carts.splice(
								formik.values.carts.findIndex((cart) => cart.id === formik.cartId),
								1,
								{
									unit: selectedCart.unit,
									productName: selectedCart.productName,
									price: selectedCart.price,
									quantity: selectedCart.quantity,
									id: selectedCart.id,
									productDetailId: formik.values.productDetailId,
									realQuantity: formik.values.realQuantity,
									userId: order.user?.id ?? null,
								}
							);
							handleToggleModal();
						}}>
						Lưu
					</Button>
				</Modal.Body>
			</Modal>
			<div className='container min-w-max'>
				<Card className='relative'>
					{!order.isProccesed &&
						!order.isSuccess &&
						(!processing ? (
							<Button
								className='absolute top-3 right-3'
								size={'sm'}
								onClick={() => setProcessing(true)}
								gradientMonochrome={'failure'}>
								<FontAwesomeIcon icon={faCheckToSlot} className={'mr-1'} />
								Xử lí đơn hàng
							</Button>
						) : (
							<Button
								className='absolute top-3 right-3'
								size={'sm'}
								onClick={formik.handleSubmit}
								gradientMonochrome={'success'}>
								<FontAwesomeIcon icon={faCheckToSlot} className={'mr-1'} />
								Xác nhận đã xử lí đơn hàng
							</Button>
						))}
					<div className='flex gap-x-1 items-center'>
						<Fragment>
							{!order.isProccesed && !order.isSuccess && (
								<FilterBadge
									color={'warning'}
									label='Đang chờ xử lí'
									icon={faClock}
								/>
							)}
							{order.isProccesed && !order.isSuccess && (
								<FilterBadge
									color={'info'}
									label='Đã xử lí'
									icon={faUserCheck}
								/>
							)}

							{order.isSuccess && order.isProccesed && (
								<FilterBadge
									color={'success'}
									label='Thành công'
									icon={faCheck}
								/>
							)}
							{!order.isProccesed && order.isSuccess && (
								<FilterBadge
									color={'failure'}
									label='Thất bại'
									icon={faXmark}
								/>
							)}
							<FilterBadge
								label={`Tạo: ${ParseToDate(order.dateCreate)}`}
								icon={faClock}
								color={'info'}
							/>
							{order.dateProccesed && (
								<FilterBadge
									label={`Xử lí: ${ParseToDate(order.dateProccesed)}`}
									icon={faClock}
									color={'purple'}
								/>
							)}
						</Fragment>
					</div>
					<div className='grid grid-cols-2 gap-2'>
						<div className='font-semibold'>
							Đơn bán hàng cho:{' '}
							<span className='text-md font-bold'>
								{order.user?.fullName ?? 'Khách vãng lai'}
							</span>
						</div>
						<div className='font-semibold flex gap-x-2 items-center'>
							Tổng giá trị:
							<Badge
								color={'info'}
								size={'sm'}
								className={'w-fit shadow-sm text-md font-bold'}>
								{FormatCurrency(order.total)}
							</Badge>
						</div>
						{!processing ? (
							<div className='font-semibold flex gap-x-2 items-center'>
								Thông tin thêm:
								<span className='text-md'>{order.description}</span>
							</div>
						) : (
							<Fragment>
								<Textarea
									rows={4}
									value={formik.values.description}
									onChange={formik.handleChange}
									className={'col-span-2'}
									placeholder='Chú thích về đơn hàng'
								/>
								{formik.errors.description && (
									<span className='text-red-500 text-sm'>
										<FontAwesomeIcon icon={faWarning} className='px-1' />
										{formik.errors.description}
									</span>
								)}
							</Fragment>
						)}
					</div>
					<Table hoverable={true}>
						<Table.Head>
							<Table.HeadCell>#</Table.HeadCell>
							<Table.HeadCell>Sản phẩm</Table.HeadCell>
							<Table.HeadCell>Loại, phẩm cách</Table.HeadCell>
							<Table.HeadCell>Giá bán</Table.HeadCell>
							<Table.HeadCell>Số lượng đặt (kg)</Table.HeadCell>
							<Table.HeadCell>Số lượng giao (kg)</Table.HeadCell>
						</Table.Head>
						<Table.Body className='divide-y'>
							{formik.values.carts.map((item, index) => (
								<Table.Row
									onClick={
										!order.dateProccesed
											? () => {
													handleRowClick(item);
											  }
											: undefined
									}
									className='bg-white mx-1 cursor-pointer hover:bg-gradient-to-r hover:from-cyan-100 hover:to-pink-100'
									key={index}>
									<Table.Cell>{index + 1}</Table.Cell>
									<Table.Cell className='font-medium text-gray-900'>
										{item.productName}
									</Table.Cell>
									<Table.Cell className='font-medium text-gray-900'>
										{item.unit}
									</Table.Cell>
									<Table.Cell className='font-medium text-gray-900 flex gap-2'>
										{FormatCurrency(item.price)}
										<Badge size={'xs'} color={'success'} className={'w-fit'}>
											{item?.user === null
												? item?.realQuantity >= item?.toWholesale
													? 'Giá sỉ'
													: 'Giá lẻ'
												: 'Giá sỉ'}
										</Badge>
									</Table.Cell>
									<Table.Cell className='font-medium text-gray-900'>
										{item.quantity} kg
									</Table.Cell>
									<Table.Cell className='font-medium text-gray-900'>
										{item.realQuantity} kg
									</Table.Cell>
								</Table.Row>
							))}
						</Table.Body>
					</Table>
					<Button
						size={'xs'}
						className={'w-fit'}
						gradientDuoTone={'tealToLime'}
						onClick={() => {
							navigate(-1);
						}}>
						<FontAwesomeIcon icon={faArrowLeft} className='mr-1' />
						Trở về
					</Button>
				</Card>
			</div>
		</Fragment>
	) : (
		<Loader />
	);
}
