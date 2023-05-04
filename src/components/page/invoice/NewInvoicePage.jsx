import { Card, Label, Button, Table, Badge } from 'flowbite-react';
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
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Fragment, useEffect, useState } from 'react';
import { FormatCurrency } from '../../../libs/helper';
import ToastPromise from '../../util/ToastPromise';
import BreadcrumbPath from '../../util/BreadCrumbPath';
import SelectableInput from '../../util/SelectableInput';
import useQuery from '../../util/useQuery';

export default function NewInvoicePage() {
	const query = useQuery();
	const [venders, setVenders] = useState([]);
	const [products, setProducts] = useState([]);
	const [details, setDetails] = useState([]);
	const [invoiceDetails, setInvoiceDetails] = useState([]);
	const [detailStep, setDetailStep] = useState(false);
	const [venderStep, setVenderStep] = useState(true);
	const [confirmStep, setConfirmStep] = useState(!venderStep);
	const navigate = useNavigate();

	const formik = useFormik({
		initialValues: {
			venderId: query.get('vender') ?? '',
			invoiceDetails: [],
			details: [],
			quantity: 1,
			realTotal: 1,
			productDetailId: 0,
		},
		validationSchema: yup.object({
			quantity: yup
				.number()
				.min(1, 'Số lượng nhập không hợp lệ!')
				.required('Số lượng không được trống!'),
		}),
		onSubmit: (values) => {
			ToastPromise(
				axios.post('/api/invoices/', {
					venderId: formik.values.venderId,
					invoiceDetails: formik.values.invoiceDetails,
					realTotal: formik.values.realTotal,
				}),
				{
					pending: 'Đang thêm đơn nhập hàng',
					success: (response) => {
						setVenderStep(true);
						setDetailStep(false);
						setConfirmStep(false);
						formik.resetForm();
						return (
							<div>
								Đã thêm đơn nhập hàng
								<Link to={`/invoice/${response.data.id}`}>
									<Badge size={'xs'} className='w-fit' color={'info'}>
										Xem chi tiết
									</Badge>
								</Link>
							</div>
						);
					},
					error: (error) => {
						return 'Lỗi! Không thể thêm đơn nhập hàng!';
					},
				}
			);
		},
	});

	const handleProductChange = async (productId) => {
		formik.values.productDetailId = null;
		const { data, status } = await axios.get(
			`/api/productdetails?productId=${productId}`
		);
		if (status === 200) {
			formik.values.details = data.map((item) => ({
				value: item.id,
				label: `${item.unit} (${FormatCurrency(item.importPrice)})`,
			}));
			formik.values.productDetailId = data[0]?.id;
			setDetails(data);
		}
	};

	const handleProductDetailChange = (detailId) => {
		formik.values.productDetailId = detailId;
	};

	const handleAddButtonClick = () => {
		let detail = details.find(
			(detail) => detail.id === Number.parseInt(formik.values.productDetailId)
		);
		var existDetailIndex = invoiceDetails.findIndex(
			(detail) =>
				detail.productDetailId ===
				Number.parseInt(formik.values.productDetailId)
		);
		if (existDetailIndex === -1) {
			setInvoiceDetails((prev) => [
				...prev,
				{
					productDetailId: Number.parseInt(formik.values.productDetailId),
					productDetail: detail.unit,
					importPrice: detail.importPrice,
					quantity: formik.values.quantity,
				},
			]);
		} else {
			setInvoiceDetails((prev) => {
				prev[existDetailIndex].quantity = formik.values.quantity;
				return [...prev];
			});
		}
	};

	useEffect(() => {
		const vender = query.get('vender');
		const fetchVenders = async () => {
			const { data, status } = await axios.get(`/api/venders?page=0`);
			if (status === 200 && data.venders.length !== 0) {
				setVenders(
					data.venders.map((item) => ({
						value: item.id,
						label: item.name,
					}))
				);
				formik.values.venderId = vender ?? data.venders[0].id;
			}
		};

		const fetchProducts = async () => {
			const { data, status } = await axios.get(`/api/products?page=0`);
			if (status === 200) {
				setProducts([
					{ label: 'Chọn sản phẩm', value: 0 },
					...data.products.map((item) => ({
						value: item.id,
						label: item.name,
					})),
				]);
			}
		};

		fetchVenders();
		fetchProducts();
		document.title = 'Thêm đơn nhập hàng';
	}, [query]);

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
					{ to: '/invoice', text: 'Đơn nhập hàng' },
					{ to: `/invoice/new`, text: 'Thêm đơn nhập hàng mới' },
				]}
			/>
			<Card className='relative'>
				{venderStep && (
					<div className='flex flex-col items-center gap-y-2'>
						<div className='w-full md:w-1/2'>
							<Label htmlFor='venderId'>Chọn nhà cung cấp sản phẩm:</Label>
							<SelectableInput
								id={'venderId'}
								defaultValue={venders.find(
									(v) => v.value === formik.values.venderId
								)}
								isSearchable={true}
								onChange={(selected) => {
									formik.values.venderId = selected.value;
								}}
								options={venders ?? []}
							/>
						</div>
						<Button
							size={'xs'}
							gradientDuoTone={'greenToBlue'}
							disabled={formik.values.venderId === ''}
							onClick={() => {
								setVenderStep(false);
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
							venders.find((vender) => vender.value === formik.values.venderId)
								.label
						}`}</div>
						<Table hoverable={true}>
							<Table.Head>
								<Table.HeadCell>Loại, phẩm cách</Table.HeadCell>
								<Table.HeadCell>Giá nhập (đồng/kg)</Table.HeadCell>
								<Table.HeadCell>{`Số lượng (kg)`}</Table.HeadCell>
							</Table.Head>
							<Table.Body className='divide-y'>
								{invoiceDetails.map((item, index) => (
									<Table.Row
										title={'Click để xóa'}
										onClick={() => {
											invoiceDetails.splice(index, 1);
											setInvoiceDetails([...invoiceDetails]);
										}}
										className='bg-white mx-1 cursor-pointer hover:bg-gradient-to-r hover:from-blue-100 hover:to-gray-100'
										key={index}>
										<Table.Cell>{item.productDetail}</Table.Cell>
										<Table.Cell>{FormatCurrency(item.importPrice)}</Table.Cell>
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
								<Label htmlFor='quantity'>Số lượng nhập:</Label>
								<input
									id={'quantity'}
									title={'Đơn vị: kg'}
									name={'quantity'}
									sizing={'md'}
									min={1}
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
								disabled={invoiceDetails.length === 0}
								onClick={() => {
									setDetailStep(false);
									setVenderStep(true);
								}}>
								<FontAwesomeIcon icon={faArrowLeft} className={'mr-1'} />
								Chọn nhà cung cấp
							</Button>
							<Button
								size={'xs'}
								disabled={!formik.values.productDetailId}
								gradientDuoTone={'greenToBlue'}
								onClick={handleAddButtonClick}>
								<FontAwesomeIcon icon={faPlus} className={'mr-1'} />
								Thêm
							</Button>
							<Button
								size={'xs'}
								gradientDuoTone={'greenToBlue'}
								disabled={invoiceDetails.length === 0}
								onClick={() => {
									formik.values.realTotal = invoiceDetails.reduce(
										(total, detail) => {
											return total + detail.importPrice * detail.quantity;
										},
										0
									);
									formik.values.invoiceDetails = invoiceDetails.map(
										(detail) => ({
											productDetailId: detail.productDetailId,
											quantity: detail.quantity,
										})
									);
									setDetailStep(false);
									setConfirmStep(true);
								}}>
								Xác nhận đơn nhập
								<FontAwesomeIcon icon={faArrowRight} className={'ml-1'} />
							</Button>
						</div>
					</Fragment>
				)}

				{confirmStep && (
					<Fragment>
						<div className='flex flex-col items-center gap-2'>
							<div className='flex w-full items-center gap-x-2'>
								<Label htmlFor='realTotal' className='w-fit'>
									Tống giá trị đơn nhập:
								</Label>
								<input
									id={'realTotal'}
									name={'realTotal'}
									sizing={'md'}
									min={1}
									type={'number'}
									value={formik.values.realTotal}
									onChange={formik.handleChange}
									className={
										'bg-white w-fit h-fit rounded-md border border-gray-300 text-sm text-gray-500 focus:ring-blue-100 focus:ring-2'
									}
									placeholder={'Tổng giá trị'}
								/>
								<div>{FormatCurrency(formik.values.realTotal)}</div>
							</div>
							<Button
								size={'xs'}
								gradientDuoTone={'greenToBlue'}
								onClick={formik.handleSubmit}
								className={'w-fit self-center'}>
								<FontAwesomeIcon icon={faPlus} className={'mr-1'} />
								Xác nhận thêm đơn nhập
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
							Chỉnh sửa đơn nhập
						</Button>
					</Fragment>
				)}
			</Card>
		</Fragment>
	);
}
