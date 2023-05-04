import axios from 'axios';
import { Button, Checkbox, Label, TextInput } from 'flowbite-react';
import { useFormik } from 'formik';
import jwtDecode from 'jwt-decode';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import { setAuthorized, updateUsername } from '../../../../libs/store/slices';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faWarning } from '@fortawesome/free-solid-svg-icons';
import Loader from '../../../util/Loader';
import ToastPromise from '../../../util/ToastPromise';
import Swal from 'sweetalert2';

export default function ShopRegister() {
	const [register, setRegister] = useState(false);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const formik = useFormik({
		initialValues: {
			fullName: '',
			phoneNumber: '',
			email: '',
			password: '',
			confirmPassword: '',
		},
		validationSchema: yup.object({
			fullName: yup
				.string()
				.max(50, 'Tối đa 50 kí tự')
				.required('Họ và tên không được trống!'),
			phoneNumber: yup
				.string()
				.max(20, 'Tối đa 20 kí tự!')
				.required('Số điện thoại không được trống!'),
			email: yup
				.string()
				.email('Email không hợp lệ')
				.max(50, 'Tối đa 50 kí tự!')
				.required('Email không được trống'),
			password: yup
				.string()
				.required('Mật khẩu không được trống')
				.matches(
					/^.*(?=.{6,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/,
					'Mật khẩu không hợp lệ'
				),
			confirmPassword: yup
				.string()
				.required('Xác nhận mật khẩu không được trống')
				.oneOf([yup.ref('password'), null], "Passwords don't match."),
		}),
		onSubmit: async (values) => {
			setRegister(true);
			ToastPromise(axios.post('/api/authenticate/register', values), {
				pending: 'Đang gửi yêu cầu đăng kí',
				success: (response) => {
					setRegister(false);
					Swal.fire({
						title: 'Đăng kí tài khoản thành công',
						text: 'Vui lòng xác minh email vừa gửi đến hộp thư của bạn!',
						icon: 'success',
						confirmButtonColor: '#108506',
						confirmButtonText: 'Đóng',
					});
					return 'Đăng kí thành công!';
				},
				error: (error) => {
					setRegister(false);
					if (error.response.status === 400)
						formik.setErrors({
							email: error.response.data.email ?? undefined,
							phoneNumber: error.response.data.phoneNumber ?? undefined,
						});
					return 'Lỗi! Không thể đăng kí tài khoản!';
				},
			});
		},
	});

	return (
		<section className='grid grid-cols-1 md:grid-cols-2 gap-2 mt-3'>
			<div>
				<p className='text-xl font-medium tracking-tight text-black'>
					Đăng kí tài khoản đối tác bán hàng
				</p>
				<p>
					Sau khi được đăng kí, cửa hàng sẽ liên hệ với bạn để hoàn tất một số
					thỏa thuận, và sau đó bạn sẽ:
				</p>
				<ul className='list-disc list-inside font-light'>
					<li className='mt-1'>
						Bạn sẽ được mua các sản phẩm với giá sỉ với bất kì số lượng nào
					</li>
					<li className='mt-1'>
						Thường xuyên nhận được những thông báo về ưu đãi hay những sản phẩm
						mới
					</li>
					<li className='mt-1'>
						Sử dụng tính năng trạng thái và lịch sử đơn hàng
					</li>
					<li className='mt-1'>Sử dụng đầy đủ tính năng giỏ hàng</li>
				</ul>
				<div className='flex flex-col items-center justify-center gap-3 mt-2 lg:flex-row lg:justify-start'>
					<Button
						size={'sm'}
						pill
						color={'gray'}
						onClick={() => navigate('/shop/login')}
						className='min-w-fit text-sm shadow-sm hover:text-blue-600 font-semibold  bg-gradient-to-r from-green-200 to-cyan-100 hover:bg-gradient-to-l'>
						Đăng nhập ngay
						<FontAwesomeIcon icon={faArrowRight} className='ml-1' />
					</Button>
				</div>
			</div>
			<div className='w-full px-6'>
				<div>
					<div className='text-2xl uppercase text-black font-bold'>Đăng kí</div>
				</div>
				<div className={`flex flex-col gap-1`}>
					<div>
						<Label htmlFor='fullName'>
							Họ và tên <span className='text-red-600'>*</span>
						</Label>
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
					<div>
						<Label htmlFor='phoneNumber'>
							Số điện thoại <span className='text-red-600'>*</span>
						</Label>
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
									{formik.touched.phoneNumber && formik.errors.phoneNumber ? (
										<span>
											<FontAwesomeIcon icon={faWarning} className='px-1' />
											{formik.errors.phoneNumber}
										</span>
									) : (
										<span>
											Cửa hàng sẽ liên hệ với bạn qua số điện thoại cung cấp
										</span>
									)}
								</span>
							}
						/>
					</div>
					<div>
						<Label htmlFor='email'>
							Email <span className='text-red-600'>*</span>
						</Label>
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
									{formik.touched.email && formik.errors.email ? (
										<span>
											<FontAwesomeIcon icon={faWarning} className='px-1' />
											{formik.errors.email}
										</span>
									) : (
										<span>
											Mã xác minh sẽ được gửi đến địa chỉ email cung cấp
										</span>
									)}
								</span>
							}
						/>
					</div>
					<div>
						<Label htmlFor='password'>
							Mật khẩu <span className='text-red-600'>*</span>
						</Label>
						<TextInput
							sizing={'md'}
							type={'password'}
							maxLength={'50'}
							id={'password'}
							name={'password'}
							onChange={formik.handleChange}
							value={formik.values.password}
							placeholder={'Mật khẩu'}
							color={
								formik.touched.password && formik.errors.password && 'failure'
							}
							helperText={
								<span>
									{formik.touched.password && formik.errors.password ? (
										<span>
											<FontAwesomeIcon icon={faWarning} className='px-1' />
											{formik.errors.password}
										</span>
									) : (
										<span>
											Mật khẩu cần ít nhất 6 kí tự, 1 kí tự hoa, 1 chữ số và 1
											kí tự đặc biệt
										</span>
									)}
								</span>
							}
						/>
					</div>
					<div>
						<Label htmlFor='confirmPassword'>
							Xác nhận mật khẩu <span className='text-red-600'>*</span>
						</Label>
						<TextInput
							sizing={'md'}
							type={'password'}
							maxLength={'50'}
							id={'confirmPassword'}
							name={'confirmPassword'}
							onChange={formik.handleChange}
							value={formik.values.confirmPassword}
							placeholder={'Xác nhận mật khẩu'}
							color={
								formik.touched.confirmPassword &&
								formik.errors.confirmPassword &&
								'failure'
							}
							helperText={
								<span>
									{formik.touched.confirmPassword &&
										formik.errors.confirmPassword && (
											<span>
												<FontAwesomeIcon icon={faWarning} className='px-1' />
												{formik.errors.confirmPassword}
											</span>
										)}
								</span>
							}
						/>
					</div>
					<Button
						type='submit'
						pill={true}
						color={'dark'}
						onClick={formik.handleSubmit}
						size={'sm'}
						className={`mt-2 self-center w-full ${
							register && 'cursor-wait'
						} hover:bg-slate-700`}>
						{register && <Loader size={'xs'} className={'mr-2'} />}Đăng kí
					</Button>
				</div>
			</div>
		</section>
	);
}
