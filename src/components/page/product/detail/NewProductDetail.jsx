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
} from '@fortawesome/free-solid-svg-icons';
import * as yup from 'yup';
import { useParams, useNavigate, Link } from 'react-router-dom';
import ToastPromise from '../../../util/ToastPromise';
import axios from 'axios';
import { Fragment, useCallback, useEffect, useState } from 'react';
import BreadcrumbPath from '../../../util/BreadCrumbPath';

export default function NewProductDetail() {
	const { id } = useParams();
	const [details, setDetails] = useState([]);
	const navigate = useNavigate();
	const formik = useFormik({
		initialValues: {
			productId: id,
			unit: '',
			description: '',
			importPrice: 1,
			toWholeSale: 1,
			retailPrice: 1,
			wholePrice: 1,
			isActive: true,
		},
		validationSchema: yup.object({
			unit: yup
				.string()
				.max(30, 'Tối đa 50 kí tự')
				.required('Loại, phẩm cách không được trống!'),
			retailPrice: yup
				.number()
				.min(0, 'Giá bán lẻ không hợp lệ!')
				.required('Giá bán lẻ không được trống!'),
			wholePrice: yup
				.number()
				.min(0, 'Giá bán sỉ không hợp lệ!')
				.required('Giá bán sỉ không được trống!'),
			importPrice: yup
				.number()
				.min(0, 'Giá nhập không hợp lệ!')
				.required('Giá nhập không được trống!'),
		}),
		onSubmit: (values) => {
			try {
				ToastPromise(axios.post('/api/productdetails/', values), {
					pending: 'Đang thêm chi tiết sản phẩm',
					success: (response) => {
						setDetails([...details, response.data]);
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

	const fetchDetails = useCallback(async () => {
		const { status, data } = await axios.get(
			`api/productdetails?productId=${id}`
		);
		status === 200 && setDetails(data);
		console.log(data);
	}, [id]);

	useEffect(() => {
		fetchDetails();
	}, [fetchDetails]);

	useEffect(() => {
		document.title = 'Chi tiết sản phẩm';
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
					{ to: '/product', text: 'Sản phẩm' },
					{ to: `/product/${id}/detail`, text: 'Chi tiết sản phẩm' },
				]}
			/>
			<div className='container'>
				<Card>
					<Card className='relative'>
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
								/>
							</div>
							<div>
								<Label htmlFor='description'>Mô tả chi tiết:</Label>
								<TextInput
									id={'description'}
									name={'description'}
									sizing={'md'}
									type={'text'}
									value={formik.values.xdescription}
									onChange={formik.handleChange}
									placeholder={'Tôm loại 1, cua loại 1, ...'}
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
						<div className='flex gap-x-1 self-center'>
							<Link to={`/product/${id}`}>
								<Button size={'xs'} color={'gray'} className={'w-fit'}>
									<FontAwesomeIcon icon={faArrowLeft} className={'w-4 h-4'} />
								</Button>
							</Link>
							<Button
								size={'xs'}
								gradientMonochrome={'info'}
								className={'w-fit '}
								onClick={formik.handleSubmit}>
								Thêm chi tiết
							</Button>
						</div>
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
							{details.map((item) => (
								<Table.Row
									className='bg-white mx-1 cursor-pointer hover:bg-gradient-to-r hover:from-blue-100 hover:to-gray-100'
									key={item.id}>
									<Table.Cell>{item.unit}</Table.Cell>
									<Table.Cell>{item.description}</Table.Cell>
									<Table.Cell>{item.importPrice}</Table.Cell>
									<Table.Cell>{item.retailPrice}</Table.Cell>
									<Table.Cell>{item.wholePrice}</Table.Cell>
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
				</Card>
			</div>
		</Fragment>
	);
}
