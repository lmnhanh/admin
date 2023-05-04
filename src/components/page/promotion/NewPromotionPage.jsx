import {
	faArrowRight,
	faHome,
	faWarning,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	Badge,
	Button,
	Card,
	Label,
	Select,
	TextInput,
	Textarea,
} from 'flowbite-react';
import { useState } from 'react';
import { Fragment } from 'react';
import BreadcrumbPath from '../../util/BreadCrumbPath';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import axios from 'axios';
import Loader from '../../util/Loader';
import { useFormik } from 'formik';
import * as yup from 'yup';
import ToastPromise from '../../util/ToastPromise';
import { FormatDateToInput } from '../../../libs/helper';
import SelectableInput from '../../util/SelectableInput';

export default function NewPromotionPage() {
	const [products, setProducts] = useState(null);
	const [dateStart, setDateStart] = useState(FormatDateToInput(new Date()));
	const [dateEnd, setDateEnd] = useState(
		FormatDateToInput(new Date().setDate(new Date().getDate() + 1))
	);
	const [dateStartError, setDateStartError] = useState(null);
	const [dateEndError, setDateEndError] = useState(null);
	const navigate = useNavigate();

	const formik = useFormik({
		initialValues: {
			name: '',
			description: '',
			stock: 1,
			dateStart: dateStart,
			dateEnd: dateEnd,
			isPercentage: false,
			discount: '5',
			type: '',
			productIds: [],
			isActive: true,
		},
		validationSchema: yup.object({
			name: yup
				.string()
				.max(60, 'Tối đa 50 kí tự')
				.required('Tên khuyến mãi không được trống!'),
			description: yup
				.string()
				.max(500, 'Tối đa 20 kí tự!')
				.required('Mô tả khuyến mãi không được trống!'),
			stock: yup
				.number()
				.min(1, 'Số lượng khuyến mãi không hợp lệ')
				.required('Số lượng không được trống'),
			discount: yup
				.number()
				.min(1, 'Giá trị khuyến mãi không hợp lệ')
				.required('Giá trị không được trống'),
			productIds: yup.array().required('Sản phẩm không được trống'),
		}),
		onSubmit: async (values) => {
			if (dateStartError || dateEndError) {
				return;
			}
			ToastPromise(axios.post('/api/promotions/', values), {
				pending: 'Đang thêm khuyến mãi',
				success: (response) => {
					formik.resetForm();
					return (
						<div className=''>
							Đã thêm khuyến mãi {response.data.name}
							<Link to={`/promotion/${response.data.id}`}>
								<Badge size={'xs'} className='w-fit' color={'info'}>
									Xem chi tiết
								</Badge>
							</Link>
						</div>
					);
				},
				error: (error) => {
					if (error.response?.status === 400) {
						return 'Lỗi! Không thể thêm khuyến mãi!';
					}
				},
			});
		},
	});

	useEffect(() => {
		document.title = 'Thêm khuyến mãi mới';
		const fetchProducts = async () => {
			const { status, data } = await axios.get(
				'/api/products?page=0&hasPromotion=false'
			);
			if (status === 200) {
				setProducts(
					data.products.map((item) => ({
						value: item.id,
						label: item.name,
					}))
				);
			}
		};
		fetchProducts();
	}, []);

	return (
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
					{ to: '/promotion', text: 'Khuyến mãi' },
					{ to: '/promotion/new', text: 'Thêm khuyến mãi mới' },
				]}
			/>
			{products !== null ? (
				<div className='container'>
					<Card className='min-w-min'>
						<span className='mr-3 text-md font-bold'>Thêm khuyến mãi mới</span>
						{products.length == 0 ? (
							<div className='self-center flex gap-2'>
								<span className='text-md'>
									Các sản phẩm đều đã có khuyến mãi! Thêm sản phẩm mới?
								</span>
								<Button
									gradientDuoTone={'cyanToBlue'}
									size={'xs'}
									onClick={() => navigate('/product/new')}>
									Thêm ngay
									<FontAwesomeIcon icon={faArrowRight} className={'ml-1'} />
								</Button>
							</div>
						) : (
							<Fragment>
								<div className='grid min-w-fit md:grid-cols-2 gap-2 lg:grid-cols-3'>
									<div>
										<Label htmlFor='name'>
											Tên khuyến mãi: <span className='text-red-500'>*</span>
										</Label>
										<TextInput
											sizing={'md'}
											type={'text'}
											id={'name'}
											name={'name'}
											onChange={formik.handleChange}
											value={formik.values.name}
											placeholder='Khuyến mãi chào mừng ...'
											color={
												formik.touched.name && formik.errors.name && 'failure'
											}
											helperText={
												formik.touched.name &&
												formik.errors.name && (
													<span>
														<FontAwesomeIcon
															icon={faWarning}
															className='px-1'
														/>
														{formik.errors.name}
													</span>
												)
											}
										/>
									</div>
									<div>
										<Label htmlFor='dateStart'>
											Ngày bắt đầu:<span className='text-red-500'>*</span>
										</Label>
										<TextInput
											sizing={'md'}
											type={'date'}
											id={'dateStart'}
											name={'dateStart'}
											onChange={(event) => {
												setDateStart(event.target.value);
												var date = new Date(event.target.value);
												if (
													date < new Date().setDate(new Date().getDate() - 1) ||
													date > new Date(dateEnd)
												) {
													setDateStartError('Ngày bắt đầu không hợp lệ');
													return;
												}
												formik.values.dateStart = event.target.value;
												setDateStartError(null);
											}}
											value={dateStart}
											color={dateStartError ? 'failure' : 'gray'}
											helperText={
												dateStartError && (
													<span>
														<FontAwesomeIcon
															icon={faWarning}
															className='px-1'
														/>
														{dateStartError}
													</span>
												)
											}
										/>
									</div>
									<div>
										<Label htmlFor='dateEnd'>
											Ngày kết thúc:<span className='text-red-500'>*</span>
										</Label>
										<TextInput
											sizing={'md'}
											type={'date'}
											id={'dateEnd'}
											name={'dateEnd'}
											onChange={(event) => {
												setDateEnd(event.target.value);
												var date = new Date(event.target.value);
												if (date < new Date(dateStart)) {
													setDateEndError('Ngày kết thúc không hợp lệ');
													return;
												}
												formik.values.dateEnd = event.target.value;
												setDateEndError(null);
												setDateStartError(null);
											}}
											value={dateEnd}
											color={dateEndError ? 'failure' : 'gray'}
											helperText={
												dateEndError && (
													<span>
														<FontAwesomeIcon
															icon={faWarning}
															className='px-1'
														/>
														{dateEndError}
													</span>
												)
											}
										/>
									</div>
									<div>
										<Label htmlFor='stock'>
											Số lượng:<span className='text-red-500'>*</span>
										</Label>
										<TextInput
											sizing={'md'}
											type={'number'}
											min={1}
											id={'stock'}
											name={'stock'}
											onChange={formik.handleChange}
											value={formik.values.stock}
											placeholder='10'
											color={formik.errors.stock ? 'failure' : 'gray'}
											helperText={
												formik.errors.stock && (
													<span>
														<FontAwesomeIcon
															icon={faWarning}
															className='px-1'
														/>
														{formik.errors.stock}
													</span>
												)
											}
										/>
									</div>
									<div>
										<Label htmlFor='type'>Loại khuyến mãi:</Label>
										<Select
											sizing={'md'}
											id={'type'}
											name={'type'}
											onChange={(event) => {
												formik.handleChange(event);
												formik.setFieldValue(
													'isPercentage',
													event.target.value === 'percent'
												);
												if (event.target.value === 'percent') {
													formik.setFieldValue('discount', 5);
												}else{
													formik.setFieldValue('discount', 1000);
												}
											}}
											value={formik.values.type}>
											<option value={'fixed'}>
												Giá trị khuyến mãi cố định
											</option>
											<option value={'percent'}>
												Giá trị khuyến mãi theo phần trăm
											</option>
										</Select>
									</div>
									<div>
										<Label htmlFor='discount'>
											Giá trị khuyến mãi:{' '}
											<span className='text-red-500'>*</span> (% hoặc VNĐ)
										</Label>
										<TextInput
											sizing={'md'}
											type={'number'}
											min={1}
											id={'discount'}
											name={'discount'}
											onChange={(event) => {
												formik.handleChange(event);
												if (formik.values.type === 'percent') {
													event.target.value > 100 &&
														formik.setFieldValue('discount', 5);
												}
											}}
											value={formik.values.discount}
											placeholder='Giá trị phụ thuộc vào loại khuyến mãi'
											color={formik.errors.discount && 'failure'}
											helperText={
												formik.errors.discount && (
													<span>
														<FontAwesomeIcon
															icon={faWarning}
															className='px-1'
														/>
														{formik.errors.discount}
													</span>
												)
											}
										/>
									</div>
									{/* <div>
										<Label htmlFor='maxDiscount'>
											Giá trị khuyến mãi tối đa: (VNĐ)
										</Label>
										<TextInput
											sizing={'md'}
											type={'number'}
											min={1}
											disabled={formik.values.type !== 'percent'}
											id={'maxDiscount'}
											name={'maxDiscount'}
											onChange={formik.handleChange}
											value={formik.values.maxDiscount}
											placeholder='Giá trị phụ thuộc vào loại khuyến mãi'
											color={formik.errors.maxDiscount && 'failure'}
											helperText={
												formik.errors.maxDiscount && (
													<span>
														<FontAwesomeIcon
															icon={faWarning}
															className='px-1'
														/>
														{formik.errors.maxDiscount}
													</span>
												)
											}
										/>
									</div> */}
									<div className='col-span-2 lg:col-span-3'>
										<Label htmlFor='maxDiscount'>
											Sản phẩm áp dụng:<span className='text-red-500'>*</span>
										</Label>
										<SelectableInput
											isClearable={true}
											isMultiple={true}
											onChange={(selected) => {
												formik.setFieldValue(
													'productIds',
													selected?.map((option) => option.value)
												);
											}}
											isSearchable={true}
											options={products}
										/>
										{formik.errors.productIds && (
											<span className='text-red-600 text-sm'>
												<FontAwesomeIcon icon={faWarning} className='px-1' />
												{formik.errors.productIds}
											</span>
										)}
									</div>
									<div className='col-span-2 lg:col-span-3 row-span-2'>
										<Label htmlFor='description'>
											Mô tả:<span className='text-red-500'>*</span>
										</Label>
										<Textarea
											rows={4}
											id={'description'}
											description={'description'}
											onChange={formik.handleChange}
											value={formik.values.description}
											placeholder='Mô tả thêm về khuyến mãi ...'
											color={
												formik.touched.description &&
												formik.errors.description &&
												'failure'
											}
											helperText={
												formik.touched.description &&
												formik.errors.description && (
													<span>
														<FontAwesomeIcon
															icon={faWarning}
															className='px-1'
														/>
														{formik.errors.description}
													</span>
												)
											}
										/>
									</div>
								</div>
								<Button
									onClick={(event) => {
										if (formik.values.type !== 'percent') {
											if (formik.values.discount < 1000) {
												formik.setFieldError('discount', 'Giá trị khuyến mãi phải trên 1000 VNĐ')
												return;
											}
										}
										if (formik.values.productIds.length === 0) {
											formik.setFieldError('productIds', 'Sản phẩm áp dụng khuyến mãi là bắt buộc')
											return;
										}
										formik.handleSubmit(event);
									}}
									gradientDuoTone={'cyanToBlue'}
									className='w-fit shadow-md self-center px-2'
									size={'xs'}>
									Thêm khuyến mãi
								</Button>
							</Fragment>
						)}
					</Card>
				</div>
			) : (
				<Loader />
			)}
		</Fragment>
	);
}
