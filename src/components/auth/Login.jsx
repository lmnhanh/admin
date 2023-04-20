import { Button, Card, Checkbox, Label, TextInput } from 'flowbite-react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWarning } from '@fortawesome/free-solid-svg-icons';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { setAuthorized, updateUsername } from '../../libs/store/slices';
import { useNavigate, useLocation } from 'react-router-dom';
import Loader from '../util/Loader';
import { useState } from 'react';
import useQuery from './../util/useQuery';
import jwtDecode from 'jwt-decode';

export default function Login(props) {
	const [login, setLogin] = useState(false);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const query = useQuery()

	const formik = useFormik({
		initialValues: {
			email: '',
			password: '',
			remember: true,
		},
		validationSchema: Yup.object({
			email: Yup.string().email('Invalid email format').required('Required!'),
			password: Yup.string()
				.min(4, 'Minimum 4 characters')
				.required('Required!'),
		}),
		onSubmit: async (values) => {
			setLogin(true)
			const response = await axios.post('/api/authenticate/login', {
				username: values.email,
				password: values.password,
			});
			const { status, data } = response;
			if (status === 200) {
				const {scope} = jwtDecode(data.access_token);
				if(scope.includes('Admin')){
					//dispatch(setToken(data.access_token));
					//dispatch(setScope(data.scope));
					dispatch(setAuthorized({token: data.access_token, authorized: true}));
					dispatch(updateUsername(values.email));
					navigate(`/${query.get('returnUrl')??''}`, { replace: true });
				}else{
					navigate("/notfound", { replace: true });
				}
			}
		},
	});
	
	return (
		<div className='flex justify-center h-screen min-w-min'>
			<div className='w-full mt-20 sm:w-1/2 lg:w-1/3'>
				<Card>
					<form
						className='flex flex-col justify-center align-middle'
						onSubmit={formik.handleSubmit}>
						<div>
							<Label htmlFor='email' value='Your email' />
						</div>
						<TextInput
							id='email'
							shadow
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
						<div className='mb-2 block'>
							<Label htmlFor='password' value='Your password' />
						</div>
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
						<div className='flex items-center gap-2 mt-2'>
							<Checkbox
								id='remember'
								className='cursor-pointer'
								checked={formik.values.remember}
								onChange={formik.handleChange}
							/>
							<Label htmlFor='remember' className='cursor-pointer'>
								Ghi nhớ đăng nhập
							</Label>
						</div>
						<Button
							type='submit'
							gradientDuoTone={'cyanToBlue'}
							size={'xs'}
							className={`w-fit mt-2 self-center cu ${login && 'cursor-wait'}`}>
							{login && <Loader size={'xs'} className={'mr-2'}/>}Đăng nhập
						</Button>
					</form>
				</Card>
			</div>
		</div>
	);
}
