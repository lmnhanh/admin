import { Button, Checkbox, Label, TextInput, Badge, Modal } from 'flowbite-react';
import { useFormik } from 'formik';
import axios from 'axios';
import ToastPromise from '../../util/ToastPromise';
import * as Yup from 'yup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWarning } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setId } from '../../../libs/store/categorySlice';

export default function NewCategoryModal({handleOnSuccess, show, handleOnClose}) {

	const dispatch = useDispatch();

	const formik = useFormik({
		initialValues: {
			name: '',
			isActive: true,
		},
		validationSchema: Yup.object({
			name: Yup.string()
				.min(2, 'Tên loại hải sản phải nhiều hơn 2 kí tự')
				.max(50, 'Tên loại không vượt quá 50 kí tự')
				.required('Tên loại không được trống'),
		}),
		onSubmit: async (values) => {
			ToastPromise(axios.post('/api/categories', values), {
				pending: 'Đang thêm loại sản phẩm',
				success: (response) => {
					handleOnSuccess();
					return (
						<div className=''>
							Đã thêm {response.data.name}
							<Link to={`/category/edit/${response.data.id}`}>
								<Badge size={'xs'} className='w-fit' color={'info'}>
									Xem chi tiết
								</Badge>
							</Link>
						</div>
					);
				},
				error: (error) => {
					let errors = error.response.data.errors.join(', ');
					return errors;
				},
			});
			values.name = '';
		},
	});

	const handleOnKeyPress = (event)=>{
		if(event.key === "Enter"){
			formik.handleSubmit()
		}
	}

	return (
		<Modal
			show={show}
			dismissible={true}
			size={'sm'}
			onClose={handleOnClose}>
			<Modal.Header>Thêm loại hải sản</Modal.Header>
			<Modal.Body>
				<div className='flex flex-col gap-1'>
					<div className='flex items-center'>
						<Label htmlFor='name' className='w-1/4'>
							Tên loại:{' '}
						</Label>
						<TextInput
							type='text'
							id='name'
							name='name'
							className='w-full'
							sizing={'sm'}
							onKeyPress={handleOnKeyPress}
							onChange={formik.handleChange}
							autoFocus={true}
							value={formik.values.name}
							color={formik.touched.name && formik.errors.name ? 'failure' : ''}
						/>
					</div>
					<div className='text-red-600 self-center text-sm'>
						{formik.touched.name && formik.errors.name && (
							<span className='block'>
								<FontAwesomeIcon icon={faWarning} className='px-1' />
								{formik.errors.name}
							</span>
						)}
					</div>
					<div className='flex items-center gap-2 mt-2'>
						<Checkbox
							className='ml-3'
							name='isActive'
							id='isActive'
							checked={formik.values.isActive}
							onChange={formik.handleChange}
						/>
						<Label htmlFor='isActive' className='cursor-pointer'>
							Đang kinh doanh
						</Label>
					</div>
					<Button
						size={'sm'}
						className='w-fit px-3 self-center'
						gradientMonochrome={'info'}
						onClick={formik.handleSubmit}>
						Thêm
					</Button>
				</div>
			</Modal.Body>
		</Modal>
	);
}
