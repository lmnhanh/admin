import {
	faBars,
	faChartLine,
	faPlus,
	faWarning,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import { Button, Card, Modal, TextInput } from 'flowbite-react';
import { useFormik } from 'formik';
import { Fragment, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import ToastPromise from '../../util/ToastPromise';
import { setAuthorized } from '../../../libs/store/slices';
import { setPageNo } from '../../../libs/store/partnerSlice';

export default function PartnerMainPage() {
	const [showAddModal, setShowAddModal] = useState(false);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const formik = useFormik({
		initialValues: {
			fullName: '',
			phoneNumber: '',
			email: '',
			password: 'X2Uqxe&3k@',
		},
		validationSchema: yup.object({
			fullName: yup
				.string()
				.max(50, 'Tối đa 50 kí tự')
				.required('Tên nhà đối tác không được trống!'),
			phoneNumber: yup
				.string()
				.max(20, 'Tối đa 20 kí tự!')
				.required('Số điện thoại không được trống!'),
			email: yup
				.string()
				.email('Email không hợp lệ')
				.max(50, 'Tối đa 50 kí tự!')
				.required('Email không được trống'),
		}),
		onSubmit: async (values) => {
			ToastPromise(axios.post('/api/authenticate/register', values), {
				pending: 'Đang thêm đối tác bán hàng',
				success: (response) => {
					setShowAddModal(false);
					dispatch(setPageNo(99999));
					return `Đã thêm ${values.fullName}`;
				},
				error: (error) => {
					(error.response.status === 401 || error.response.status === 403) &&
						dispatch(setAuthorized(false));
					if (error.response.status === 400)
						formik.setErrors({
							email: error.response.data.email ?? undefined,
							phoneNumber: error.response.data.phoneNumber ?? undefined,
						});
					return 'Lỗi! Không thể thêm đối tác!';
				},
			});
		},
	});

	const handleToggleAddModal = () => {
		formik.resetForm();
		setShowAddModal((prev) => !prev);
	};
	return (
		<Fragment>
			<Modal
				show={showAddModal}
				onKeyDown={(event) => {
					event.key === 'Enter' && formik.handleSubmit();
				}}
				dismissible={true}
				size={'xxl'}
				onClose={handleToggleAddModal}>
				<Modal.Header>Thêm đối tác bán hàng</Modal.Header>
				<Modal.Body className='flex flex-col'>
					<div className={`grid grid-cols-3 gap-x-2`}>
						<div className='items-center'>
							<span className='font-semibold'>
								Tên đối tác <span className='text-red-600'>*</span>
							</span>
							<TextInput
								sizing={'md'}
								type={'text'}
								maxLength={'50'}
								id={'fullName'}
								name={'fullName'}
								onChange={formik.handleChange}
								value={formik.values.fullName}
								placeholder={'Lê Minh An'}
								color={
									formik.touched.fullName && formik.errors.fullName && 'failure'
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
						<div className='items-center'>
							<span className='font-semibold'>
								Số điện thoại <span className='text-red-600'>*</span>
							</span>
							<TextInput
								sizing={'md'}
								type={'text'}
								maxLength={'20'}
								id={'phoneNumber'}
								name={'phoneNumber'}
								onChange={formik.handleChange}
								value={formik.values.phoneNumber}
								placeholder={'+84933490772'}
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
													<FontAwesomeIcon icon={faWarning} className='px-1' />
													{formik.errors.phoneNumber}
												</span>
											)}
									</span>
								}
							/>
						</div>
						<div className='items-center'>
							<span className='font-semibold'>
								Email <span className='text-red-600'>*</span>
							</span>
							<TextInput
								sizing={'md'}
								type={'email'}
								maxLength={'50'}
								id={'email'}
								name={'email'}
								onChange={formik.handleChange}
								value={formik.values.email}
								placeholder={'haisan4hai@gmail.com'}
								color={formik.touched.email && formik.errors.email && 'failure'}
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
					</div>
					<span className='font-semibold text-sm text-red-500'>
						<FontAwesomeIcon className='text-red-500 mr-1' icon={faWarning} />
						Lưu ý:
					</span>
					<div className='items-center  text-red-500 text-sm pl-5'>
						<div>
							Email của đối tác cần được đối tác xác nhận trước khi có thể đăng
							nhập và tạo đơn hàng.
						</div>
						<div>
							Mật khẩu mặc định để đăng nhập:{' '}
							<span className='text-black font-semibold'>X2Uqxe&3k@</span>
						</div>
						<div>Đối tác sẽ phải đổi mật khẩu sau lần đăng nhập đầu tiên.</div>
					</div>
					<Button
						size={'sm'}
						className='w-fit px-3 mt-2 self-center'
						gradientDuoTone={'greenToBlue'}
						onClick={formik.handleSubmit}>
						Thêm
					</Button>
				</Modal.Body>
			</Modal>
			<div className='flex gap-2'>
				<Link to={'/trading_partner'}>
					<Button
						className='h-8 rounded-lg text-center min-w-max'
						size={'xs'}
						gradientDuoTone={'cyanToBlue'}>
						<FontAwesomeIcon icon={faBars} className='pr-2 w-4 h-4' />
						Danh sách đối tác bán hàng
					</Button>
				</Link>
				<Link to={'/trading_partner/overall'}>
					<Button
						className='w-fit h-8 rounded-lg text-center min-w-max'
						size={'xs'}
						gradientDuoTone={'cyanToBlue'}>
						<FontAwesomeIcon icon={faChartLine} className='pr-2 w-4 h-4' />
						Thống kê tổng quát
					</Button>
				</Link>
				<Button
					size={'xs'}
					gradientDuoTone={'cyanToBlue'}
					onClick={handleToggleAddModal}
					className='w-fit h-8 rounded-lg text-center min-w-max'>
					<FontAwesomeIcon icon={faPlus} className='pr-2 w-4 h-4' />
					Thêm đối tác bán hàng
				</Button>
			</div>
			<Outlet />
		</Fragment>
	);
}
