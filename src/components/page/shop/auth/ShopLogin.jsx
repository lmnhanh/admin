import axios from 'axios';
import { Button, Checkbox, Label, TextInput } from 'flowbite-react';
import { useFormik } from 'formik';
import jwtDecode from 'jwt-decode';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import * as Yup from 'yup';
import { setAuthorized, setId, updateUsername } from '../../../../libs/store/slices';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faWarning } from '@fortawesome/free-solid-svg-icons';
import Loader from '../../../util/Loader';
import useQuery from './../../../util/useQuery';
import { useEffect } from 'react';
import ToastPromise from '../../../util/ToastPromise';

export default function ShopLogin() {
	const [login, setLogin] = useState(false);
	const [param, setParam] = useSearchParams();
	const query = useQuery();
	const confirmEmailToken = query.get('token');
	const user = query.get('user');
	query.delete('user');
	query.delete('token');
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const formik = useFormik({
		initialValues: {
			email: '',
			password: '',
			remember: true,
		},
		validationSchema: Yup.object({
			email: Yup.string()
				.email('Email không hợp lệ')
				.required('Email không được trống'),
			password: Yup.string()
				.min(6, 'Mật khẩu phải ít nhất 6 kí tự')
				.required('Mật khẩu không được trống'),
		}),
		onSubmit: async (values) => {
			setLogin(true);
			try {
				const { status, data }= await axios.post('/api/authenticate/login', {
					username: values.email,
					password: values.password,
				});
				if (status === 200) {
					const { scope, client_id } = jwtDecode(data.access_token);
					if (data.IsPasswordDefault) {
						alert('Làm ơn đổi pass');
					}
					if (scope.includes('Customer')) {
						dispatch(
							setAuthorized({ token: data.access_token, authorized: true })
						);
						dispatch(setId(client_id));
						dispatch(updateUsername(data.username));
						navigate('/shop/home', { replace: true });
					} else {
						setLogin(false);
						formik.setFieldError(
							'email',
							'Thông tin đăng nhập không chính xác'
						);
					}
				}
			} catch (error) {
				formik.setFieldError('email', error.response.data);
				setLogin(false);
			}
		},
	});

	useEffect(() => {
		document.title = 'Đăng nhập';

		if (confirmEmailToken != null && user != null) {
			ToastPromise(
				axios.post(`/api/authenticate/confirmEmail/${user}`, {
					token: confirmEmailToken,
				}),
				{
					pending: 'Đang xác minh email',
					success: (response) => {
						setParam("");
						return 'Xác minh email thành công!';
					},
					error: (error) => {
						return 'Lỗi! Xác minh email thất bại!';
					},
				}
			);
		}
	}, []);

	return (
		<section className='grid grid-cols-1 md:grid-cols-2 gap-2 mt-6'>
			<div>
				<p className='text-xl font-medium tracking-tight text-black'>
					Đăng nhập với tài khoản đối tác bán hàng
				</p>
				<ul className='list-disc list-inside'>
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
						onClick={() => navigate('/shop/register')}
						className='min-w-fit text-sm shadow-sm hover:text-blue-600 font-semibold  bg-gradient-to-r from-green-200 to-cyan-100 hover:bg-gradient-to-l'>
						Đăng kí đối tác bán hàng
						<FontAwesomeIcon icon={faArrowRight} className='ml-1' />
					</Button>
				</div>
			</div>
			<div className='w-full px-6'>
				<div>
					<div className='text-2xl uppercase text-black font-bold'>
						Đăng nhập
					</div>
				</div>
				<form
					className='flex flex-col gap-3 w-full'
					onSubmit={formik.handleSubmit}>
					<div>
						<Label htmlFor='email' value='Email' />
						<TextInput
							id='email'
							shadow
							autoFocus
							sizing='md'
							type='emai'
							name='email'
							value={formik.values.email}
							onChange={formik.handleChange}
							placeholder='Your_email@mail.com'
							autoComplete='true'
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
					<div>
						<Label htmlFor='password' value='Mật khẩu' />
						<TextInput
							id='password'
							name='password'
							shadow
							sizing='md'
							value={formik.values.password}
							onChange={formik.handleChange}
							autoComplete='true'
							type='password'
						/>
					</div>
					<Button
						type='submit'
						pill={true}
						color={'dark'}
						size={'sm'}
						className={`mt-2 self-center w-full ${
							login && 'cursor-wait'
						} hover:bg-slate-700`}>
						{login && <Loader size={'xs'} className={'mr-2'} />}Đăng nhập
					</Button>
				</form>
			</div>
		</section>
	);
}
