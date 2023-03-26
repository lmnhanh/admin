import {
	Card,
	Checkbox,
	Label,
	TextInput,
	Button,
	Table,
	Badge,
} from 'flowbite-react';
import { useFormik } from 'formik';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faXmark,
	faHome,
	faCheck,
	faArrowLeft,
	faPlus,
	faTrash,
	faWarning,
} from '@fortawesome/free-solid-svg-icons';
import * as yup from 'yup';
import { useParams, useNavigate, Link } from 'react-router-dom';
import ToastPromise from '../../../util/ToastPromise';
import axios from 'axios';
import { Fragment, useCallback, useEffect, useState } from 'react';
import BreadcrumbPath from '../../../util/BreadCrumbPath';
import { FormatCurrency } from '../../../../libs/helper';

export default function NewProductDetail() {
	const { id } = useParams();
	const [details, setDetails] = useState([]);
	const [editing, setEditing] = useState(false);
	const navigate = useNavigate();
	const formik = useFormik({
		initialValues: {
			id: 1,
			productId: id,
			unit: '',
			description: '',
			importPrice: 1000,
			toWholeSale: 1000,
			retailPrice: 1000,
			wholePrice: 1000,
			isActive: true,
		},
		validationSchema: yup.object({
			unit: yup
				.string()
				.max(30, 'Tối đa 30 kí tự')
				.required('Loại, phẩm cách không được trống!'),
			description: yup
				.string()
				.max(60, 'Tối đa 60 kí tự')
				.required('Mô tả về sản phẩm là bắt buộc!'),
			retailPrice: yup
				.number()
				.min(0, 'Giá bán lẻ không hợp lệ!')
				.max(100000000, 'Giá bán lẻ không hợp lệ!')
				.required('Giá bán lẻ không được trống!'),
			wholePrice: yup
				.number()
				.min(0, 'Giá bán sỉ không hợp lệ!')
				.max(100000000, 'Giá bán sỉ không hợp lệ!')
				.required('Giá bán sỉ không được trống!'),
			importPrice: yup
				.number()
				.min(0, 'Giá nhập không hợp lệ!')
				.max(500000000, 'Giá nhập không hợp lệ!')
				.required('Giá nhập không được trống!'),
			toWholeSale: yup
				.number()
				.min(0, 'Điều kiện không hợp lệ!')
				.max(500000000, 'Điều kiện không hợp lệ!')
				.required('Điều kiện không được trống!'),
		}),
		onSubmit: (values) => {
			try {
				ToastPromise(axios.post('/api/productdetails/', values), {
					pending: 'Đang thêm chi tiết sản phẩm',
					success: (response) => {
						setDetails([...details, response.data]);
						formik.resetForm();
						return (
							<div className=''>Đã thêm loại {response.data.description}</div>
						);
					},
					error: (error) => {
						return 'Lỗi! Không thể thêm chi tiết sản phẩm!';
					},
				});
			} catch (error) {
				navigate('/');
			}
		},
	});

	const handleDelete = useCallback(async () => {
		ToastPromise(axios.delete(`/api/productdetails/${formik.values.id}`), {
			pending: 'Đang xóa chi tiết sản phẩm',
			success: (response) => {
				setDetails([...details, response.data]);
				formik.resetForm();
				return (
					<div className=''>Đã đã xóa chi tiết {response.data.description}</div>
				);
			},
			error: (error) => {
				return 'Lỗi! Không thể xóa chi tiết sản phẩm!';
			},
		});
	}, [formik.values.id]);

	const fetchDetails = useCallback(async () => {
		const { status, data } = await axios.get(
			`api/productdetails?productId=${id}`
		);
		status === 200 && setDetails(data);
	}, [id]);

	useEffect(() => {
		fetchDetails();
	}, [fetchDetails]);

	useEffect(() => {
		document.title = 'Chi tiết sản phẩm';
	}, []);

	const handleDetailClicked = (detail) => {
		setEditing(true);
		formik.setValues({
			id: detail.id,
			productId: detail.productId,
			unit: detail.unit,
			description: detail.description,
			importPrice: detail.importPrice,
			toWholeSale: detail.toWholeSale,
			retailPrice: detail.retailPrice,
			wholePrice: detail.wholePrice,
			isActive: detail.isActive,
		});
	};

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
					{ to: '/product', text: 'Sản phẩm' },
					{ to: `/product/${id}/detail`, text: 'Chi tiết sản phẩm' },
				]}
			/>
			<div className='container'>
				<Card className='relative mb-1'>
					<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2'>
						<div>
							<Label htmlFor='unit'>Loại, đơn vị, phẩm cách:</Label>
							<TextInput
								id='unit'
								sizing={'md'}
								maxLength={30}
								type={'text'}
								name={'unit'}
								value={formik.values.unit}
								onChange={formik.handleChange}
								placeholder={'20 con/kg, 1,3 kg/con, ...'}
								color={formik.touched.unit && formik.errors.unit && 'failure'}
								helperText={
									<span>
										{formik.touched.unit && formik.errors.unit && (
											<span>
												<FontAwesomeIcon icon={faWarning} className='px-1' />
												{formik.errors.unit}
											</span>
										)}
									</span>
								}
							/>
						</div>
						<div>
							<Label htmlFor='description'>Mô tả chi tiết:</Label>
							<TextInput
								id={'description'}
								name={'description'}
								sizing={'md'}
								type={'text'}
								value={formik.values.description}
								onChange={formik.handleChange}
								placeholder={'Tôm loại 1, cua loại 1, ...'}
								color={
									formik.touched.description &&
									formik.errors.description &&
									'failure'
								}
								helperText={
									<span>
										{formik.touched.description &&
											formik.errors.description && (
												<span>
													<FontAwesomeIcon icon={faWarning} className='px-1' />
													{formik.errors.description}
												</span>
											)}
									</span>
								}
							/>
						</div>
						<div>
							<Label htmlFor='importPrice'>Giá nhập vào:</Label>
							<TextInput
								id={'importPrice'}
								name={'importPrice'}
								sizing={'md'}
								min={0}
								type={'number'}
								value={formik.values.importPrice}
								onChange={formik.handleChange}
								placeholder={'Đơn vị: VNĐ/kg'}
								color={
									formik.touched.importPrice &&
									formik.errors.importPrice &&
									'failure'
								}
								helperText={
									<span>
										{formik.touched.importPrice &&
											formik.errors.importPrice && (
												<span>
													<FontAwesomeIcon icon={faWarning} className='px-1' />
													{formik.errors.importPrice}
												</span>
											)}
									</span>
								}
							/>
						</div>

						<div>
							<Label htmlFor='wholePrice'>Gián bán sỉ:</Label>
							<TextInput
								id={'wholePrice'}
								name={'wholePrice'}
								sizing={'md'}
								min={0}
								type={'number'}
								value={formik.values.wholePrice}
								onChange={formik.handleChange}
								placeholder={'Đơn vị: VNĐ/kg'}
								color={
									formik.touched.wholePrice &&
									formik.errors.wholePrice &&
									'failure'
								}
								helperText={
									<span>
										{formik.touched.wholePrice && formik.errors.wholePrice && (
											<span>
												<FontAwesomeIcon icon={faWarning} className='px-1' />
												{formik.errors.wholePrice}
											</span>
										)}
									</span>
								}
							/>
						</div>
						<div>
							<Label htmlFor='retailPrice'>Gián bán lẻ:</Label>
							<TextInput
								id={'retailPrice'}
								name={'retailPrice'}
								min={0}
								sizing={'md'}
								type={'number'}
								value={formik.values.retailPrice}
								onChange={formik.handleChange}
								placeholder={'Đơn vị: VNĐ/kg'}
								color={
									formik.touched.retailPrice &&
									formik.errors.retailPrice &&
									'failure'
								}
								helperText={
									<span>
										{formik.touched.retailPrice &&
											formik.errors.retailPrice && (
												<span>
													<FontAwesomeIcon icon={faWarning} className='px-1' />
													{formik.errors.retailPrice}
												</span>
											)}
									</span>
								}
							/>
						</div>
						<div>
							<Label htmlFor='toWholeSale'>Điền kiện đạt giá sỉ:</Label>
							<TextInput
								title='Đơn hàng đạt điều kiện như thế nào để có thể lấy với giá sỉ'
								id={'toWholeSale'}
								name={'toWholeSale'}
								min={0}
								sizing={'md'}
								type={'number'}
								value={formik.values.toWholeSale}
								onChange={formik.handleChange}
								placeholder={'Đơn vị: kg'}
								color={
									formik.touched.toWholeSale &&
									formik.errors.toWholeSale &&
									'failure'
								}
								helperText={
									<span>
										{formik.touched.toWholeSale &&
											formik.errors.toWholeSale && (
												<span>
													<FontAwesomeIcon icon={faWarning} className='px-1' />
													{formik.errors.toWholeSale}
												</span>
											)}
									</span>
								}
							/>
						</div>
						<div className='flex gap-2 ml-2 mt-0 lg:mt-5 items-center'>
							<Checkbox
								name='isActive'
								id='isActive'
								checked={formik.values.isActive}
								onChange={formik.handleChange}
							/>
							<Label htmlFor='isActive' className='cursor-pointer'>
								Đang kinh doanh
							</Label>
						</div>
					</div>
					<Link
						to={`/product/${id}`}
						replace={true}
						className={'absolute bottom-6'}>
						<Button
							size={'xs'}
							gradientDuoTone={'tealToLime'}
							className={'w-fit'}>
							<FontAwesomeIcon icon={faArrowLeft} className={'w-4 h-4 mr-1'} />{' '}
							Sản phẩm
						</Button>
					</Link>
					{editing ? (
						<div className='flex self-center gap-x-2'>
							<Button
								size={'xs'}
								gradientDuoTone={'pinkToOrange'}
								onClick={() => {
									setEditing(false);
									formik.resetForm();
								}}>
								<FontAwesomeIcon icon={faXmark} className={'mr-1'} />
								Hủy thay đổi
							</Button>
							<Button
								size={'xs'}
								gradientDuoTone={'greenToBlue'}
								className={'px-2'}
								onClick={() => {}}>
								<FontAwesomeIcon icon={faCheck} className={'mr-1'} />
								Lưu chỉnh sửa
							</Button>
							<Button
								size={'xs'}
								gradientDuoTone={'pinkToOrange'}
								onClick={() => {
									handleDelete();
								}}>
								<FontAwesomeIcon icon={faTrash} className={'mr-1'} />
								Xóa
							</Button>
						</div>
					) : (
						<Button
							size={'xs'}
							gradientDuoTone={'greenToBlue'}
							className={'w-fit self-center'}
							onClick={formik.handleSubmit}>
							<FontAwesomeIcon icon={faPlus} className={'mr-1'} />
							Thêm
						</Button>
					)}
				</Card>
				<Table hoverable={true}>
					<Table.Head>
						<Table.HeadCell>Loại, phẩm cách</Table.HeadCell>
						<Table.HeadCell>Mô tả</Table.HeadCell>
						<Table.HeadCell>Giá nhập</Table.HeadCell>
						<Table.HeadCell>Giá sỉ</Table.HeadCell>
						<Table.HeadCell>Giá lẻ</Table.HeadCell>
						<Table.HeadCell>Điều kiện giá sỉ</Table.HeadCell>
						<Table.HeadCell>Trạng thái</Table.HeadCell>
					</Table.Head>
					<Table.Body className='divide-y'>
						{details.map((item, index) => (
							<Table.Row
								onClick={() => {
									handleDetailClicked(item);
								}}
								className='bg-white mx-1 cursor-pointer hover:bg-gradient-to-r hover:from-blue-100 hover:to-gray-100'
								key={index}>
								<Table.Cell>{item.unit}</Table.Cell>
								<Table.Cell>{item.description}</Table.Cell>
								<Table.Cell>{FormatCurrency(item.importPrice)}</Table.Cell>
								<Table.Cell>{FormatCurrency(item.retailPrice)}</Table.Cell>
								<Table.Cell>{FormatCurrency(item.wholePrice)}</Table.Cell>
								<Table.Cell>{`> ${item.toWholeSale} kg`}</Table.Cell>
								<Table.Cell>
									{item.isActive ? (
										<Badge className='w-fit' color={'success'}>
											<FontAwesomeIcon icon={faCheck} className='mr-1' />
											Đang kinh doanh
										</Badge>
									) : (
										<Badge color={'dark'}>
											<FontAwesomeIcon icon={faXmark} className='mr-1' />
											Ngừng kinh doanh
										</Badge>
									)}
								</Table.Cell>
							</Table.Row>
						))}
					</Table.Body>
				</Table>
			</div>
		</Fragment>
	);
}
