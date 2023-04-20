import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	Badge,
	Button,
	Card,
	Label,
	Modal,
	Select,
	Table,
	TextInput,
	Textarea,
	Timeline,
} from 'flowbite-react';
import { Fragment, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
	faAngleLeft,
	faAngleRight,
	faBars,
	faChartLine,
	faHome,
	faMoneyBill,
	faPlus,
	faWarning,
} from '@fortawesome/free-solid-svg-icons';
import BreadcrumbPath from '../../util/BreadCrumbPath';
import Loader from '../../util/Loader';
import axios from 'axios';
import SelectableInput from '../../util/SelectableInput';
import * as yup from 'yup';
import { useFormik } from 'formik';
import ToastPromise from '../../util/ToastPromise';
import { ParseToDate } from './../../../libs/helper';
import ReactPaginate from 'react-paginate';

export default function StockMainPage(props) {
	const [products, setProducts] = useState(null);
	const [productDetails, setProductDetails] = useState([]);
	const [selectedProductDetail, setSelectedProductDetail] = useState(null);
	const [selectedProduct, setSelectedProduct] = useState(null);
	const [changes, setChanges] = useState([]);
	const [pageNo, setPageNo] = useState(1);
	const [fromDate, setFromDate] = useState('');
	const [toDate, setToDate] = useState(new Date().toISOString());
	const [pagesize, setPagesize] = useState(10);
	const [totalPage, setTotalPage] = useState(1);
	const [showModal, setShowModal] = useState(false);
	const navigate = useNavigate();

	const formik = useFormik({
		initialValues: {
			productDetailId: '',
			isManualUpdate: true,
			description: '',
			value: 1,
		},
		validationSchema: yup.object({
			value: yup
				.number()
				.min(0, 'Số lượng không hợp lệ')
				.required('Số lượng còn lại không được trống!'),
			description: yup
				.string()
				.required('Chú thích cho cập nhật số lượng sản phẩm là bắt buộc!'),
		}),
		onSubmit: async (values) => {
			ToastPromise(axios.post('/api/stocks', values), {
				pending: 'Đang cập nhật số lượng sản phẩm',
				success: (response) => {
					setShowModal(false);
					fetchProductDetails(selectedProduct);
					fetchChanges(
						formik.values.productDetailId,
						pageNo,
						pagesize,
						fromDate,
						toDate
					);
					return `Đã cập nhật số lượng sản phẩm`;
				},
				error: (error) => {
					return 'Lỗi!Không thể cập nhật số lượng sản phẩm!';
				},
			});
		},
	});

	const handleChangePagesize = (pagesize) => {
		setPagesize(pagesize);
		fetchChanges(selectedProductDetail, 1, pagesize, fromDate, toDate);
	};

	const handleChangeFromDate = (date) => {
		setFromDate(date);
		fetchChanges(selectedProductDetail, 1, pagesize, date, toDate);
	};

	const handleChangeToDate = (date) => {
		setToDate(date);
		fetchChanges(selectedProductDetail, 1, pagesize, fromDate, date);
	};

	const handlePageChange = (page) => {
		setPageNo(page);
		fetchChanges(selectedProductDetail, page, pagesize, fromDate, toDate);
	};

	const handleToggleModal = () => {
		formik.resetForm();
		setShowModal((prev) => !prev);
	};

	const handleProductChange = async (productId) => {
		setSelectedProduct(productId);
		setSelectedProductDetail(null);
		if (productId !== '') fetchProductDetails(productId);
		else {
			setProductDetails = [];
		}
	};

	const fetchProductDetails = async (productId) => {
		const { data, status } = await axios.get(
			`/api/productdetails?productId=${productId}&isInStock=false`
		);
		if (status === 200 && data.length !== 0) {
			setProductDetails(data);
			setSelectedProductDetail(data[0]?.id);
			fetchChanges(data[0]?.id, pageNo, pagesize, fromDate, toDate);
		}
	};

	const fetchChanges = async (
		productDetailId,
		page,
		size,
		fromDate,
		toDate
	) => {
		const { data, status } = await axios.get(
			`/api/stocks/${productDetailId}/changes?page=${page}&size=${size}&fromDate=${fromDate}&toDate=${toDate}`
		);
		if (status === 200) {
			setChanges(data.changes);
			setTotalPage(data.totalPages);
		}
	};

	const handleProductDetailChange = async (productDetailId) => {
		setSelectedProductDetail(productDetailId);
		formik.values.productDetailId = productDetailId;
		formik.values.value = productDetails.find(
			(product) => product.id === productDetailId
		)?.stock;

		productDetailId !== '' &&
			fetchChanges(productDetailId, pageNo, pagesize, fromDate, toDate);
	};

	useEffect(() => {
		document.title = 'Quản lí số lượng sản phẩm';

		const fetchProducts = async () => {
			const { data, status } = await axios.get(`/api/products?page=0`);
			if (status === 200) {
				setProducts(
					data.products.map((item) => ({
						value: item.id,
						label: item.name,
					}))
				);
				if (data.products.length !== 0) {
					setSelectedProduct(data.products[0]?.id);
					fetchProductDetails(data.products[0]?.id);
				}
			}
		};

		fetchProducts();
	}, []);

	return products !== null ? (
		<Fragment>
			<Modal
				show={showModal}
				dismissible={true}
				size={'lg'}
				onClose={handleToggleModal}>
				<Modal.Header>
					Cập nhật:{' '}
					{
						productDetails.find(
							(product) => product.id === selectedProductDetail
						)?.unit
					}
				</Modal.Header>
				<Modal.Body className='flex flex-col'>
					<Label htmlFor='manualUpdate'>{`Số lượng (kg) hiện tại`}</Label>
					<TextInput
						sizing={'md'}
						min={0}
						type={'number'}
						id={'manualUpdate'}
						name={'value'}
						className={'text-sm'}
						onChange={formik.handleChange}
						value={formik.values.value}
						placeholder={formik.values.value}
						color={formik.errors.value && 'failure'}
						helperText={
							<span>
								{formik.errors.value && (
									<span>
										<FontAwesomeIcon icon={faWarning} className='px-1' />
										{formik.errors.value}
									</span>
								)}
							</span>
						}
					/>
					<Label htmlFor='description'>Chú thích</Label>
					<Textarea
						id={'description'}
						name={'description'}
						onChange={formik.handleChange}
						value={formik.values.description}
						placeholder={formik.values.description}
						color={formik.errors.description && 'failure'}
						helperText={
							<span>
								{formik.errors.description && (
									<span>
										<FontAwesomeIcon icon={faWarning} className='px-1' />
										{formik.errors.description}
									</span>
								)}
							</span>
						}
					/>
					<Button
						size={'xs'}
						className='w-fit px-3 mt-2 self-center'
						gradientDuoTone={'cyanToBlue'}
						onClick={formik.handleSubmit}>
						Cập nhật
					</Button>
				</Modal.Body>
			</Modal>
			<div className='flex gap-2'>
				<Link to={'/invoice'}>
					<Button
						className='h-8 rounded-lg text-center min-w-max'
						size={'xs'}
						gradientDuoTone={'cyanToBlue'}>
						<FontAwesomeIcon icon={faBars} className='pr-2 w-4 h-4' />
						Danh sách đơn nhập hàng
					</Button>
				</Link>
				<Link to={'/invoice/overall'}>
					<Button
						className='w-fit h-8 rounded-lg text-center min-w-max'
						size={'xs'}
						gradientDuoTone={'cyanToBlue'}>
						<FontAwesomeIcon icon={faChartLine} className='pr-2 w-4 h-4' />
						Thống kê tổng quát
					</Button>
				</Link>
				<Link to={'/invoice/new'}>
					<Button
						size={'xs'}
						gradientDuoTone={'cyanToBlue'}
						className='w-fit h-8 rounded-lg text-center min-w-max'>
						<FontAwesomeIcon icon={faPlus} className='pr-2 w-4 h-4' />
						Thêm đơn nhập hàng
					</Button>
				</Link>
			</div>
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
					{ to: '/stock', text: 'Quản lí số lượng sản phẩm' },
				]}
			/>
			<Card>
				<div className='flex gap-x-3'>
					<div className='w-fit flex flex-col gap-1'>
						<Label htmlFor='products'>Sản phẩm:</Label>
						<SelectableInput
							id={'products`'}
							defaultValue={products[0]}
							isSearchable={true}
							onChange={(selected) => {
								handleProductChange(selected.value);
							}}
							options={products}
						/>
						<Table hoverable={true}>
							<Table.Head>
								<Table.HeadCell>Loại, phẩm cách</Table.HeadCell>
								<Table.HeadCell>Số lượng hiện tại</Table.HeadCell>
							</Table.Head>
							<Table.Body className='divide-y'>
								{productDetails.map((item, index) => (
									<Table.Row
										title='Click để xem chi tiết'
										className={`${
											selectedProductDetail === item.id
												? 'bg-gradient-to-r from-cyan-100 to-pink-100'
												: 'bg-white'
										} mx-1 cursor-pointer hover:bg-gradient-to-r hover:from-cyan-100 hover:to-pink-100`}
										key={index}
										onClick={() => {
											handleProductDetailChange(item.id);
										}}>
										<Table.Cell className='font-medium'>{item.unit}</Table.Cell>
										<Table.Cell className='text-gray-900'>
											{item.stock.toFixed()}
										</Table.Cell>
									</Table.Row>
								))}
							</Table.Body>
						</Table>
						{selectedProductDetail !== null && (
							<Button
								size={'xs'}
								gradientDuoTone={'cyanToBlue'}
								onClick={() => handleToggleModal()}
								className={'w-fit self-center'}>
								Cập nhật số lượng
							</Button>
						)}
					</div>

					<div className='grow ml-4 items-center'>
						{selectedProductDetail !== null && (
							<div className='flex gap-x-2 mb-2'>
								<div className='grow'>
									<Label>Ngày tạo từ:</Label>
									<TextInput
										type={'date'}
										sizing={'sm'}
										onChange={(e) => {
											handleChangeFromDate(
												e.target.value || new Date().toISOString()
											);
										}}
									/>
								</div>
								<div className='grow'>
									<Label>Đến:</Label>
									<TextInput
										type={'date'}
										sizing={'sm'}
										onChange={(e) => {
											handleChangeToDate(
												e.target.value || new Date().toISOString()
											);
										}}
									/>
								</div>
							</div>
						)}

						<Table hoverable={true}>
							<Table.Head>
								<Table.HeadCell>Ngày thực hiện</Table.HeadCell>
								<Table.HeadCell>Loại biến động</Table.HeadCell>
								<Table.HeadCell>Số lượng</Table.HeadCell>
								<Table.HeadCell>Mô tả</Table.HeadCell>
							</Table.Head>
							{selectedProductDetail !== null && (
								<Table.Body className='divide-y'>
									{changes.map((item, index) => (
										<Table.Row
											title='Click để xem chi tiết'
											className='bg-white mx-1 cursor-pointer hover:bg-gradient-to-r hover:from-cyan-100 hover:to-pink-100'
											key={index}
											onClick={() => {
												item.type === 'Đơn bán hàng' &&
													navigate(`/order/${item.id}`);
												item.type === 'Đơn nhập hàng' &&
													navigate(`/invoice/${item.id}`);
											}}>
											<Table.Cell>{ParseToDate(item.dateUpdate)}</Table.Cell>
											<Table.Cell className='whitespace-nowrap font-medium text-gray-900'>
												{item.type}
											</Table.Cell>
											<Table.Cell className='whitespace-nowrap font-medium text-gray-900'>
												{item.orderId !== '' || item.invoiceId === '' ? (
													<Badge color={'failure'} className={'w-fit'}>{`${
														item.value < 0 ? '+ ' : '- '
													}${Math.abs(item.value).toFixed(2)} kg`}</Badge>
												) : (
													<Badge
														color={'success'}
														className={'w-fit'}>{`+ ${item.value} kg`}</Badge>
												)}
											</Table.Cell>
											<Table.Cell className='whitespace-nowrap font-medium text-gray-900'>
												{item.description}
											</Table.Cell>
										</Table.Row>
									))}
								</Table.Body>
							)}
						</Table>
						<div className=' bg-white bottom-0 flex justify-center'>
							{totalPage !== 1 && (
								<ReactPaginate
									className='flex items-center rounded-md w-fit self-center m-2 gap-1'
									breakLabel='...'
									nextLabel={
										<FontAwesomeIcon
											icon={faAngleRight}
											className='w-10 py-1'
										/>
									}
									nextClassName={'text-gray-500 font-bold text-center'}
									previousLabel={
										<FontAwesomeIcon icon={faAngleLeft} className='w-10 py-1' />
									}
									previousClassName={'text-center text-gray-500 font-bold'}
									onPageChange={(e) => handlePageChange(e.selected + 1)}
									pageClassName={
										'border border-gray-300 rounded flex items-center justify-center'
									}
									activeClassName={
										'bg-blue-200 bg-gradient-to-br text-blue-600 font-semibold'
									}
									pageLinkClassName={'w-10 py-1 text-center align-middle'}
									pageRangeDisplayed={2}
									pageCount={totalPage}
									initialPage={pageNo - 1}
									renderOnZeroPageCount={null}
								/>
							)}
							{selectedProductDetail !== null && (
								<Select
									sizing={'sm'}
									name='perpage'
									defaultValue={pagesize}
									onChange={(e) => handleChangePagesize(e.target.value)}
									className='w-fit h-fit mt-2 bg-gray-50 border text-middle border-gray-300 text-gray-900 text-sm rounded-lg'>
									<option value={'10'}>10 bản ghi</option>
									<option value={'25'}>25 bản ghi</option>
									<option value={'50'}>50 bản ghi</option>
								</Select>
							)}
						</div>
					</div>
				</div>
			</Card>
		</Fragment>
	) : (
		<Loader />
	);
}
