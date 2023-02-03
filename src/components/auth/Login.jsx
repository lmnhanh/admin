import { Button, Card, Checkbox, Label, TextInput } from 'flowbite-react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faWarning } from '@fortawesome/free-solid-svg-icons';
import { useDispatch } from 'react-redux';
import { updateUsername } from '../../store/userSlice';
import { Link } from 'react-router-dom';

export default function Login(props) {
	const dispatch = useDispatch();

	const formik = useFormik({
		initialValues: {
			name: '',
			email: '',
			password: '',
			remember: true,
		},
		validationSchema: Yup.object({
			name: Yup.string()
				.min(1, 'Name is more than 1 character')
				.max(10, 'Name has max 15 charaters')
				.required('Name is required'),
			email: Yup.string().email('Invalid email format').required('Required!'),
			password: Yup.string()
				.min(4, 'Minimum 4 characters')
				.required('Required!'),
		}),
		onSubmit: (values) => {
			console.table(values);
			dispatch(updateUsername(values.name));
		},
	});

	return (
		<div className='flex justify-center'>
			<div className='w-full md:w-1/2 lg:w-1/3'>
				<Card>
					<form className='flex flex-col' onSubmit={formik.handleSubmit}>
						<div className='mb-2 block'>
							<Label htmlFor='name' value='Your name' />
						</div>
						<TextInput
							autoFocus
							shadow
							autoComplete="true"
							sizing='sm'
							id='name'
							type='text'
							name='name'
							value={formik.values.name}
							onChange={formik.handleChange}
							placeholder='ABC'
							color={
								formik.touched.name
									? formik.errors.name
										? 'failure'
										: 'success'
									: 'gray'
							}
							helperText={
								<span>
									{formik.touched.name ? (
										formik.errors.name ? (
											<span>
												<FontAwesomeIcon icon={faWarning} className='px-1' />
												{formik.errors.name}
											</span>
										) : (
											<span>
												<FontAwesomeIcon
													icon={faCheckCircle}
													className='px-1'
												/>
												Name is valid
											</span>
										)
									) : (
										''
									)}
								</span>
							}
						/>
						<div className='mb-2 block'>
							<Label htmlFor='email' value='Your email' />
						</div>
						<TextInput
							id='email'
							shadow
							sizing='sm'
							type='emai'
							name='email'
							value={formik.values.email}
							onChange={formik.handleChange}
							placeholder='name@flowbite.com'
							color={
								formik.touched.email
									? formik.errors.email
										? 'failure'
										: 'success'
									: 'gray'
							}
							helperText={
								<span>
									{formik.touched.email ? (
										formik.errors.email ? (
											<span>
												<FontAwesomeIcon icon={faWarning} className='px-1' />
												{formik.errors.email}
											</span>
										) : (
											<span>
												<FontAwesomeIcon
													icon={faCheckCircle}
													className='px-1'
												/>
												Email is valid
											</span>
										)
									) : (
										''
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
							sizing='sm'
							value={formik.values.password}
							onChange={formik.handleChange}
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
								Remember me
							</Label>
						</div>
						<Button type='submit'>Submit</Button>
						<Link to="/">
							<Button type='submit'>Back</Button>
						</Link>
					</form>
				</Card>
			</div>
		</div>
	);
}
