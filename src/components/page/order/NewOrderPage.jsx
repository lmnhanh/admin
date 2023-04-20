import {
	Card,
	Label,
	Button,
	Table,
	Badge,
	Textarea,
	TextInput,
} from 'flowbite-react';
import { useFormik } from 'formik';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faHome,
	faPlus,
	faWarning,
	faArrowRight,
	faArrowLeft,
} from '@fortawesome/free-solid-svg-icons';
import * as yup from 'yup';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Fragment, useEffect, useState } from 'react';
import { FormatCurrency } from '../../../libs/helper';
import ToastPromise from '../../util/ToastPromise';
import BreadcrumbPath from '../../util/BreadCrumbPath';
import SelectableInput from '../../util/SelectableInput';
import Swal from 'sweetalert2';
export default function NewOrderPage() {
	const [customers, setCustomers] = useState([]);
	const [products, setProducts] = useState([]);
	const [details, setDetails] = useState([]);
	const [orderDetails, setOrderDetails] = useState([]);
	const [detailStep, setDetailStep] = useState(false);
	const [userStep, setUserStep] = useState(true);
	const [confirmStep, setConfirmStep] = useState(!userStep);
	const navigate = useNavigate();

	const formik = useFormik({
		initialValues: {
			description: '',
			userId: '',
			total: 0,
			carts: [],

			details: [],
			productDetailId: 0,
			quantity: 1,

			stock: 0,
		},
		validationSchema: yup.object({
			quantity: yup
				.number()
				.min(1, 'Số lượng bán không hợp lệ!')
				.required('Số lượng bán không được trống!'),
			description: yup
				.string()
				.required('Chú thích đơn hàng không được trống!'),
		}),
		onSubmit: (values) => {
			Swal.fire({
				title: values.unit,
				text: 'Xác nhận? Đơn hàng sẽ không được chỉnh sửa sau khi thêm!',
				icon: 'question',
				confirmButtonColor: '#108506',
				confirmButtonText: 'Thêm đơn hàng',
			}).then((result) => {
				result.isConfirmed &&
					ToastPromise(
						axios.post('/api/orders/', {
							description: formik.values.description,
							userId: formik.values.userId,
							total: formik.values.total,
							carts: formik.values.carts,
						}),
						{
							pending: 'Đang thêm đơn bán hàng',
							success: (response) => {
								navigate(`/order/${response.data.id}`);
								return (
									<div>
										Đã thêm đơn bán hàng
										<Link to={`/order/${response.data.id}`} replace={true}>
											<Badge size={'xs'} className='w-fit' color={'info'}>
												Xem chi tiết
											</Badge>
										</Link>
									</div>
								);
							},
							error: (error) => {
								return 'Lỗi! Không thể thêm đơn bán hàng!';
							},
						}
					);
			});
		},
	});

	const handleProductChange = async (productId) => {
		formik.values.productDetailId = null;
		const { data, status } = await axios.get(
			`/api/productdetails?productId=${productId}&isInStock=true`
		);
		if (status === 200) {
			formik.values.details = data.map((item) => ({
				value: item.id,
				label: `${item.unit} (${FormatCurrency(item.wholePrice)})`,
			}));
			formik.values.productDetailId = data[0]?.id;
			formik.setFieldValue('stock', data[0]?.stock);
			setDetails(data);
		}
	};

	const handleProductDetailChange = (detailId) => {
		formik.values.productDetailId = detailId;
		formik.setFieldValue(
			'stock',
			details[details.findIndex((detail) => detail.id === Number(detailId))]
				.stock
		);
	};

	const handleAddButtonClick = () => {
		if (formik.values.quantity > formik.values.stock) {
			formik.setFieldError(
				'quantity',
				'Số lượng bán vượt quá mức số lượng còn lại của sản phẩm'
			);
			return;
		}
		var existedCart = orderDetails.findIndex(
			(cart) => cart.productDetailId === Number(formik.values.productDetailId)
		);
		var detail = details.find(
			(detail) => detail.id === Number(formik.values.productDetailId)
		);
		if (existedCart === -1) {
			setOrderDetails((prev) => [
				...prev,
				{
					productDetailId: Number(formik.values.productDetailId),
					productDetail: detail.unit,
					wholePrice: detail.wholePrice,
					quantity: formik.values.quantity,
				},
			]);
		} else {
			setOrderDetails((prev) => {
				prev[existedCart].quantity = formik.values.quantity;
				return [...prev];
			});
		}
	};

	const handleCalculateTotal = () => {
		formik.values.total = orderDetails.reduce((total, detail) => {
			return total + detail.wholePrice * detail.quantity;
		}, 0);
		formik.values.carts = orderDetails.map((detail) => ({
			userId: formik.values.userId,
			productDetailId: detail.productDetailId,
			quantity: detail.quantity,
		}));
	};

	useEffect(() => {
		const fetchCustomers = async () => {
			const { data, status } = await axios.get(`/api/users?role=Customer`);
			if (status === 200 && data.length !== 0) {
				setCustomers(
					data.map((item) => ({
						value: item.id,
						label: item.fullName,
					}))
				);
				formik.values.userId = data[0].id;
			}
		};

		const fetchProducts = async () => {
			const { data, status } = await axios.get(`/api/products?page=0`);
			if (status === 200) {
				setProducts([
					{
						value: 0,
						label: 'Chọn sản phẩm',
					},
					...data.products.map((item) => ({
						value: item.id,
						label: item.name,
					})),
				]);
			}
		};

		fetchCustomers();
		fetchProducts();
		document.title = 'Thêm đơn bán hàng';
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
					{ to: '/order', text: 'Đơn bán hàng' },
					{ to: `/order/new`, text: 'Thêm đơn bán hàng mới' },
				]}
			/>
			<Card className='relative'>
				{userStep && (
					<div className='flex flex-col items-center gap-y-2'>
						<div className='w-full md:w-1/2'>
							<Label htmlFor='userId'>Chọn đối tác bán hàng:</Label>
							<SelectableInput
								id={'userId'}
								defaultValue={customers[0]}
								isSearchable={true}
								onChange={(selected) => {
									formik.values.userId = selected.value;
								}}
								options={customers}
							/>
						</div>
						<Button
							size={'xs'}
							gradientDuoTone={'greenToBlue'}
							disabled={formik.values.userId === ''}
							onClick={() => {
								setUserStep(false);
								setDetailStep(true);
							}}>
							Tiếp tục
							<FontAwesomeIcon icon={faArrowRight} className={'ml-1'} />
						</Button>
					</div>
				)}
				{(detailStep || confirmStep) && (
					<Fragment>
						<div className='text-md font-semibold'>{`Đơn nhập từ: ${
							customers.find(
								(customer) => customer.value === formik.values.userId
							).label
						}`}</div>
						<Table hoverable={true}>
							<Table.Head>
								<Table.HeadCell>Loại, phẩm cách</Table.HeadCell>
								<Table.HeadCell>Giá sỉ (đồng/kg)</Table.HeadCell>
								<Table.HeadCell>{`Số lượng (kg)`}</Table.HeadCell>
							</Table.Head>
							<Table.Body className='divide-y'>
								{orderDetails.map((item, index) => (
									<Table.Row
										title={'Click để xóa'}
										onClick={() => {
											orderDetails.splice(index, 1);
											setOrderDetails([...orderDetails]);
											handleCalculateTotal();
										}}
										className='bg-white mx-1 cursor-pointer hover:bg-gradient-to-r hover:from-blue-100 hover:to-gray-100'
										key={index}>
										<Table.Cell>{item.productDetail}</Table.Cell>
										<Table.Cell>{FormatCurrency(item.wholePrice)}</Table.Cell>
										<Table.Cell>{item.quantity} kg</Table.Cell>
									</Table.Row>
								))}
							</Table.Body>
						</Table>
					</Fragment>
				)}
				{detailStep && (
					<Fragment>
						<div className='grid grid-cols-1 lg:grid-cols-3 gap-x-2 items-center'>
							<div>
								<Label htmlFor='product'>Sản phẩm:</Label>
								<SelectableInput
									id={'product'}
									defaultValue={products[0]}
									isSearchable={true}
									onChange={(selected) => {
										handleProductChange(selected.value);
									}}
									options={products}
								/>
							</div>
							<div>
								<Label htmlFor='productDetail'>Chi tiết sản phẩm:</Label>
								<select
									sizing={'sm'}
									id='productDetailId'
									name='productDetailId'
									defaultValue={formik.values.productDetailId}
									onChange={(e) => handleProductDetailChange(e.target.value)}
									className='bg-white w-full h-fit rounded-md border border-gray-300 text-sm text-gray-500 focus:ring-blue-100 focus:ring-2'>
									{formik.values.details.length !== 0 ? (
										formik.values.details.map((detail) => (
											<option key={detail.value} value={detail.value}>
												{detail.label}
											</option>
										))
									) : (
										<option
											key={'0'}
											className={'text-md space-y-6'}
											value={'0'}>
											Chọn sản phẩm
										</option>
									)}
								</select>
							</div>
							<div>
								<Label htmlFor='quantity'>
									Số lượng bán: tối đa {formik.values.stock} kg
								</Label>
								<TextInput
									id={'quantity'}
									title={'Đơn vị: kg'}
									name={'quantity'}
									sizing={'md'}
									min={1}
									max={formik.values.stock}
									type={'number'}
									value={formik.values.quantity}
									onChange={formik.handleChange}
									className={
										'bg-white w-full h-fit rounded-md border border-gray-300 text-sm text-gray-500 focus:ring-blue-100 focus:ring-2'
									}
									placeholder={'Đơn vị là kg'}
									color={
										formik.touched.quantity && formik.errors.quantity
											? 'failure'
											: 'gray'
									}
								/>
								<span className='text-sm text-red-500'>
									{formik.errors.quantity && (
										<span>
											<FontAwesomeIcon icon={faWarning} className='px-1' />
											{formik.errors.quantity}
										</span>
									)}
								</span>
							</div>
						</div>
						<div className='flex justify-between'>
							<Button
								size={'xs'}
								gradientDuoTone={'greenToBlue'}
								disabled={orderDetails.length === 0}
								onClick={() => {
									setDetailStep(false);
									setUserStep(true);
								}}>
								<FontAwesomeIcon icon={faArrowLeft} className={'mr-1'} />
								Chọn đối tác
							</Button>
							<Button
								size={'xs'}
								disabled={
									!formik.values.productDetailId || formik.errors.quantity
								}
								gradientDuoTone={'greenToBlue'}
								onClick={handleAddButtonClick}>
								<FontAwesomeIcon icon={faPlus} className={'mr-1'} />
								Thêm
							</Button>
							<Button
								size={'xs'}
								gradientDuoTone={'greenToBlue'}
								disabled={orderDetails.length === 0}
								onClick={() => {
									handleCalculateTotal();
									setDetailStep(false);
									setConfirmStep(true);
								}}>
								Xác nhận tạo đơn hàng
								<FontAwesomeIcon icon={faArrowRight} className={'ml-1'} />
							</Button>
						</div>
					</Fragment>
				)}

				{confirmStep && (
					<Fragment>
						<div className='flex flex-col items-center gap-2'>
							<div className='grid w-full grid-cols-2'>
								<Textarea
									name='description'
									onChange={formik.handleChange}
									maxLength={500}
									shadow={true}
									rows={3}
									className='text-sm col-span-2'
									placeholder='Chú thích đơn hàng'
								/>
								{formik.errors.description && (
									<div className='bottom-0 text-red-500 text-sm'>
										<FontAwesomeIcon icon={faWarning} className='px-1' />
										{formik.errors.description}
									</div>
								)}
								<div className='place-self-end text-sm font-light'>
									{formik.values.description.length}/500
								</div>
							</div>

							<div className='flex w-full items-center gap-x-2'>
								<Label htmlFor='total' className='w-fit'>
									Tống giá trị đơn hàng:
								</Label>

								<input
									id={'total'}
									name={'total'}
									sizing={'md'}
									min={1}
									type={'number'}
									value={formik.values.total}
									onChange={formik.handleChange}
									className={
										'bg-white w-fit h-fit rounded-md border border-gray-300 text-sm text-gray-500 focus:ring-blue-100 focus:ring-2'
									}
									placeholder={'Tổng giá trị'}
								/>
								<div>{FormatCurrency(formik.values.total)}</div>
							</div>
							<Button
								size={'xs'}
								gradientDuoTone={'greenToBlue'}
								disabled={formik.errors.description}
								onClick={formik.handleSubmit}
								className={'w-fit self-center'}>
								<FontAwesomeIcon icon={faPlus} className={'mr-1'} />
								Xác nhận tạo đơn hàng
							</Button>
						</div>
						<Button
							size={'xs'}
							gradientDuoTone={'greenToBlue'}
							className={'absolute bottom-6'}
							onClick={() => {
								setDetailStep(true);
								setConfirmStep(false);
							}}>
							<FontAwesomeIcon icon={faArrowLeft} className={'mr-1'} />
							Chỉnh sửa đơn hàng
						</Button>
					</Fragment>
				)}
			</Card>
		</Fragment>
	);
}
