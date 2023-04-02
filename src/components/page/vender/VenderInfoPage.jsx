import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Loader from '../../util/Loader';
import { useDispatch } from 'react-redux';
import { setAuthorized } from '../../../libs/store/slices';
import { Fragment, useEffect, useRef, useState, useCallback } from 'react';
import BreadcrumbPath from '../../util/BreadCrumbPath';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faArrowLeft,
	faArrowRight,
	faBuildingUser,
	faChartLine,
	faCheck,
	faHandshakeAlt,
	faHome,
	faMailBulk,
	faPencil,
	faPenToSquare,
	faPhone,
	faPlusCircle,
	faTrashCan,
	faWarning,
	faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { Button, Card, Dropdown, Textarea, TextInput } from 'flowbite-react';
import { Link } from 'react-router-dom';
import 'react-image-gallery/styles/css/image-gallery.css';
import '../product/imageGallery.css';
import ToastPromise from '../../util/ToastPromise';
import { useFormik } from 'formik';
import * as yup from 'yup';
import FilterBadge from '../../util/FilterBadge';
import { ParseToDate } from '../../../libs/helper';

export default function VenderInfoPage(props) {
	const { id } = useParams();
	const [vender, setVender] = useState(null);
	const [editing, setEditing] = useState(false);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const formik = useFormik({
		initialValues: {
			id: '',
			name: '',
			phoneNumber: '',
			email: '',
			company: '',
			description: '',
			dateStart: '',
		},
		validationSchema: yup.object({
			name: yup
				.string()
				.max(50, 'Tối đa 50 kí tự')
				.required('Tên nhà cung cấp không được trống!'),
			phoneNumber: yup
				.string()
				.max(20, 'Tối đa 20 kí tự!')
				.required('Số điện thoại không được trống!'),
			email: yup
				.string()
				.email('Email không hợp lệ')
				.max(50, 'Tối đa 50 kí tự!')
				.required('Email không được trống!'),
			company: yup.string().max(50, 'Tối đa 50 kí tự!'),
			description: yup.string().max(200, 'Tối đa 200 kí tự!'),
		}),
		onSubmit: async (values) => {
			ToastPromise(axios.put(`/api/venders/${id}`, values), {
				pending: 'Đang cập nhật nhà cung cấp',
				success: (response) => {
					setEditing(false);
					return 'Cập nhật thành công';
				},
				error: (error) => {
					return 'Lỗi! Không thể cập nhật nhà cung cấp!';
				},
			});
		},
	});

	const handleClickIconEdit = () => {
		formik.setValues(vender);
		setEditing((prev) => !prev);
	};

	const fetchVender = useCallback(async () => {
		const { status, data } = await axios.get(`/api/venders/${id}`);
		if (status === 200 && data) {
			setVender(data);
			formik.setValues(data);
		}
	}, [id]);

	useEffect(() => {
		document.title = 'Thông tin đơn nhập hàng';

		try {
			fetchVender();
		} catch (error) {
			if (error.response.status === 401) {
				dispatch(setAuthorized({ authorized: false }));
			}
		}
	}, [id, fetchVender, dispatch, editing]);

	const handleDelete = async () => {
		ToastPromise(axios.delete(`/api/venders/${vender.id}`), {
			pending: 'Đang xóa nhà cung cấp',
			success: (response) => {
				navigate('/vender', { replace: true });
				return <div>Đã xóa {vender.name}</div>;
			},
			error: (error) => {
				return 'Lỗi! Không thể xóa nhà cung cấp!';
			},
		});
	};

	return vender !== null ? (
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
					{ to: '/vender', text: 'Nhà cung cấp' },
					{ to: `/vender/${id}`, text: 'Thông tin nhà cung cấp' },
				]}
			/>

			<div className='container min-w-max'>
				<Card className='relative'>
					<div className='absolute md:top-3 md:right-3 invisible md:visible'>
						{!editing && (
							<Dropdown
								label='Tùy chọn'
								placement='left-start'
								gradientDuoTone={'cyanToBlue'}
								size={'xs'}>
								<Dropdown.Item
									className='w-full hover:text-blue-600 hover:bg-gradient-to-r hover:from-cyan-100 hover:to-gray-100'
									onClick={() => {
										setEditing(true);
									}}>
									<FontAwesomeIcon
										className='pr-1 w-4 h-4 text-blue-500'
										icon={faPenToSquare}
									/>
									Chỉnh sửa thông tin
								</Dropdown.Item>
								<Dropdown.Item
									className='w-full hover:text-blue-600 hover:bg-gradient-to-r hover:from-cyan-100 hover:to-gray-100'
									onClick={handleDelete}>
									<FontAwesomeIcon
										className='pr-1 w-4 h-4 text-red-500'
										icon={faTrashCan}
									/>
									Xóa
								</Dropdown.Item>
								<Dropdown.Divider />
								<Dropdown.Item
									className='w-full hover:text-blue-600 hover:bg-gradient-to-r hover:from-cyan-100 hover:to-gray-100'
									onClick={() => {
										navigate(`/invoice/new?vender=${vender.id}`);
									}}>
									<FontAwesomeIcon
										icon={faPlusCircle}
										className='pr-1 w-4 h-4 text-green-500'
									/>
									Thêm hóa đơn nhập hàng
								</Dropdown.Item>
								<Dropdown.Item
									className='w-full hover:text-blue-600 hover:bg-gradient-to-r hover:from-cyan-100 hover:to-gray-100'
									onClick={() => {
										navigate(`/vender/${vender.id}/statistic`);
									}}>
									<FontAwesomeIcon
										className='pr-1 w-4 h-4 text-green-500'
										icon={faChartLine}
									/>
									Thống kê chi tiết
								</Dropdown.Item>
							</Dropdown>
						)}
					</div>
					<div className='flex gap-x-1 items-center'>
						{!editing && (
							<Fragment>
								<FilterBadge
									label={formik.values.phoneNumber}
									icon={faPhone}
									color={'success'}
								/>
								<FilterBadge
									label={formik.values.email}
									icon={faMailBulk}
									color={'info'}
								/>
								{formik.values.company !== '' && (
									<FilterBadge
										label={formik.values.company}
										icon={faBuildingUser}
										color={'purple'}
									/>
								)}
								<FilterBadge
									label={ParseToDate(formik.values.dateStart)}
									icon={faHandshakeAlt}
									color={'indigo'}
								/>
							</Fragment>
						)}
					</div>
					{!editing && (
						<div className='items-center'>
							<span className='font-semibold'>Nhà cung cấp: </span>
							<span className='text-md font-bold'>{formik.values.name}</span>
							<FontAwesomeIcon
								icon={faPencil}
								onClick={handleClickIconEdit}
								className={'w-3 h-4 ml-2 cursor-pointer hover:text-blue-600'}
							/>
						</div>
					)}
					<div className={`grid grid-cols-${editing ? 3 : 2} gap-x-2`}>
						{!editing && (
							<div className='items-center'>
								<span className='font-semibold'>Mã số: </span>
								<Fragment>
									<span className='text-md'>{formik.values.id}</span>
								</Fragment>
							</div>
						)}
						{editing && (
							<Fragment>
								<div className='items-center'>
									<span className='font-semibold'>Nhà cung cấp: </span>
									<TextInput
										sizing={'md'}
										type={'text'}
										maxLength={'50'}
										id={'name'}
										name={'name'}
										onChange={formik.handleChange}
										value={formik.values.name}
										placeholder={vender.name}
										color={
											formik.touched.name && formik.errors.name && 'failure'
										}
										helperText={
											<span>
												{formik.touched.name && formik.errors.name && (
													<span>
														<FontAwesomeIcon
															icon={faWarning}
															className='px-1'
														/>
														{formik.errors.name}
													</span>
												)}
											</span>
										}
									/>
								</div>
								<div className='items-center'>
									<span className='font-semibold'>Số điện thoại: </span>
									<TextInput
										sizing={'md'}
										type={'text'}
										maxLength={'20'}
										id={'phoneNumber'}
										name={'phoneNumber'}
										onChange={formik.handleChange}
										value={formik.values.phoneNumber}
										placeholder={vender.phoneNumber}
										color={
											formik.touched.phoneNumber &&
											formik.errors.phoneNumber &&
											'failure'
										}
										helperText={
											<span>
												{formik.touched.phoneNumber &&
													formik.errors.phoneNumber && (
														<span>
															<FontAwesomeIcon
																icon={faWarning}
																className='px-1'
															/>
															{formik.errors.phoneNumber}
														</span>
													)}
											</span>
										}
									/>
								</div>
							</Fragment>
						)}
						{editing && (
							<div className='items-center'>
								<span className='font-semibold'>Email: </span>
								<TextInput
									sizing={'md'}
									type={'email'}
									maxLength={'50'}
									id={'email'}
									name={'email'}
									onChange={formik.handleChange}
									value={formik.values.email}
									placeholder={vender.email}
									color={
										formik.touched.email && formik.errors.email && 'failure'
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
						)}
						{editing && (
							<div className='items-center'>
								<span className='font-semibold'>Doanh nghiệp: </span>
								<TextInput
									sizing={'md'}
									type={'text'}
									maxLength={'50'}
									id={'company'}
									name={'company'}
									onChange={formik.handleChange}
									value={formik.values.company}
									placeholder={vender.company}
									color={
										formik.touched.company && formik.errors.company && 'failure'
									}
									helperText={
										<span>
											{formik.touched.company && formik.errors.company && (
												<span>
													<FontAwesomeIcon icon={faWarning} className='px-1' />
													{formik.errors.company}
												</span>
											)}
										</span>
									}
								/>
							</div>
						)}
						<div className={`items-center ${editing && 'col-span-2'}`}>
							<span className='font-semibold'>Mô tả bổ sung: </span>
							{!editing ? (
								<span className='text-md'>{formik.values.description}</span>
							) : (
								<Textarea
									className='text-sm'
									rows={'3'}
									maxLength={'200'}
									sizing={'md'}
									type={'text'}
									id={'description'}
									name={'description'}
									onChange={formik.handleChange}
									value={formik.values.description}
									placeholder={vender.description}
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
														<FontAwesomeIcon
															icon={faWarning}
															className='px-1'
														/>
														{formik.errors.description}
													</span>
												)}
										</span>
									}
								/>
							)}
						</div>
					</div>
					{editing ? (
						<div className='flex gap-x-1 self-center'>
							<Button
								size={'xs'}
								gradientDuoTone={'pinkToOrange'}
								onClick={handleClickIconEdit}>
								<FontAwesomeIcon icon={faXmark} className={'mr-1'} />
								Hủy
							</Button>
							<Button
								size={'xs'}
								gradientDuoTone={'greenToBlue'}
								onClick={formik.handleSubmit}>
								<FontAwesomeIcon icon={faCheck} className={'mr-1'} />
								Lưu thay đổi
							</Button>
						</div>
					) : (
						<Fragment>
							<div className='flex gap-x-2 justify-between'>
								<Button
									size={'xs'}
									gradientDuoTone={'tealToLime'}
									onClick={() => {
										navigate(-1);
									}}>
									<FontAwesomeIcon
										icon={faArrowLeft}
										className='pr-2 w-4 h-4'
									/>
									Trở về
								</Button>
								<Button
									className={'self-center'}
									size={'xs'}
									onClick={()=> navigate(`/invoice/new?vender=${vender.id}`)}
									gradientDuoTone={'greenToBlue'}>
									Thêm hóa đơn nhập hàng
									<FontAwesomeIcon icon={faArrowRight} className={'ml-1'} />
								</Button>
							</div>
						</Fragment>
					)}
				</Card>
				<div>Danh sách hóa đơn</div>
			</div>
		</Fragment>
	) : (
		<Loader />
	);
}
