import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Modal, Label, TextInput, Textarea } from 'flowbite-react';
import { Fragment, useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import {
	faBars,
	faChartLine,
	faPlus,
	faWarning,
} from '@fortawesome/free-solid-svg-icons';
import { useDispatch } from 'react-redux';
import { useFormik } from 'formik';
import * as yup from 'yup';
import ToastPromise from '../../util/ToastPromise';
import axios from 'axios';
import { setPageNo } from '../../../libs/store/venderSlice';

export default function VenderMainPage(props) {
	const [showAddModal, setShowAddModal] = useState(false);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const formik = useFormik({
		initialValues: {
			name: '',
			phoneNumber: '',
			email: '',
			company: '',
			description: '',
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
			try {
				ToastPromise(axios.post('/api/venders', values), {
					pending: 'Đang thêm nhà cung cấp',
					success: (response) => {
						setShowAddModal(false);
						dispatch(setPageNo(99999));
						return `Đã thêm ${values.name}`;
					},
					error: (error) => {
						return 'Lỗi!Không thể thêm nhà cung cấp!';
					},
				});
			} catch (error) {
				navigate('/', { replace: true });
			}
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
				onKeyDown={(event)=>{
					event.key === 'Enter' && formik.handleSubmit();
				}}
				dismissible={true}
				size={'xxl'}
				onClose={handleToggleAddModal}>
				<Modal.Header>Thêm nhà cung cấp</Modal.Header>
				<Modal.Body className='flex flex-col'>
					<div className={`grid grid-cols-3 gap-x-2`}>
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
								placeholder={'Cơ sở hải sản Tư Hải'}
								color={formik.touched.name && formik.errors.name && 'failure'}
								helperText={
									<span>
										{formik.touched.name && formik.errors.name && (
											<span>
												<FontAwesomeIcon icon={faWarning} className='px-1' />
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
							<span className='font-semibold'>Email: </span>
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
								placeholder={'Danh nghiệp tư nhân 3 Đạt'}
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
						<div className='items-center col-span-2'>
							<span className='font-semibold'>Mô tả bổ sung: </span>
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
								placeholder={'Vựa hải sản chính tại Gành Hào, Bạc Liêu, ...'}
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
				<Link to={'/vender'}>
					<Button
						className='h-8 rounded-lg text-center min-w-max'
						size={'xs'}
						gradientDuoTone={'cyanToBlue'}>
						<FontAwesomeIcon icon={faBars} className='pr-2 w-4 h-4' />
						Danh sách nhà cung cấp
					</Button>
				</Link>
				<Link to={'/vender/overall'}>
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
					Thêm nhà cung cấp
				</Button>
			</div>
			<Outlet />
		</Fragment>
	);
}
