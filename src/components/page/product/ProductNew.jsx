import { faWarning, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useFormik } from 'formik';
import * as yup from 'yup';
import {
	Badge,
	Button,
	Checkbox,
	Label,
	Modal,
	TextInput,
} from 'flowbite-react';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import axios from 'axios';
import SelectableInput from '../../util/SelectableInput';
import { useEffect, useState, useRef, React, Fragment } from 'react';
import TextEditor from '../../util/TextEditor';
import { Link, useNavigate } from 'react-router-dom';
import ToastPromise from '../../util/ToastPromise';
import Swal from 'sweetalert2';

export default function ProductNew() {
	const [categories, setCategories] = useState([]);
	const quillRef = useRef({ value: '' });
	const navigate = useNavigate();

	const formik = useFormik({
		initialValues: {
			id: 1,
			name: '',
			wellKnownId: '',
			description: '',
			categoryId: '',
			isActive: true,
			isRecommended: false,
		},
		validationSchema: yup.object({
			name: yup
				.string()
				.max(50, 'Tối đa 50 kí tự')
				.required('Tên sản phẩm không được trống!'),
			wellKnownId: yup
				.string()
				.max(20, 'Tối đa 20 kí tự!')
				.required('Mã sản phẩm không được trống!'),
		}),
		onSubmit: async (values) => {
			Swal.fire({
				title: values.name,
				text: 'Xác nhận thêm sản phẩm',
				icon: 'question',
				confirmButtonColor: '#108506',
				confirmButtonText: 'Thêm',
			}).then((result) => {
				if (result.isConfirmed) {
					formik.values.description = quillRef.current.value.toString();
					ToastPromise(
						axios.post('/api/products/', {
							name: values.name,
							wellKnownId: values.wellKnownId,
							categoryId: values.categoryId,
							description: values.description,
							isActive: values.isActive,
							isRecommended: values.isRecommended,
						}),
						{
							pending: 'Đang thêm sản phẩm',
							success: (response) => {
								navigate(`/product/${response.data.id}/detail`);
								return (
									<div className=''>
										Đã thêm {response.data.name}
										<Link to={`/product/${response.data.id}`}>
											<Badge size={'xs'} className='w-fit' color={'info'}>
												Xem chi tiết
											</Badge>
										</Link>
									</div>
								);
							},
							error: (error) => {
								if (error.response?.status === 400) {
									let finalObj = {};
									error.response?.data.forEach((item) =>
										Object.assign(finalObj, item)
									);
									formik.setErrors(finalObj);
									return 'Lỗi! Không thể thêm sản phẩm!';
								}
							},
						}
					);
				}
			});
		},
	});

	useEffect(() => {
		document.title = 'Thêm sản phẩm';
		const fetchListCategories = async () => {
			const { status, data } = await axios.get(
				'/api/categories?page=0&filter=active'
			);
			if (status === 200 && data.categories.length !== 0) {
				setCategories(
					data.categories.map((item) => ({
						value: item.id,
						label: item.name,
					}))
				);
				formik.values.categoryId = data.categories[0].id;
			}
		};
		fetchListCategories();
	}, []);

	return categories.length === 0 ? (
		<div className='self-center flex gap-2'>
			<span className='text-lg'>
				Cần thêm loại sản phẩm trước khi thêm sản phẩm mới!
			</span>
			<Button
				gradientDuoTone={'cyanToBlue'}
				size={'xs'}
				onClick={() => navigate('/category')}>
				Thêm ngay
				<FontAwesomeIcon icon={faArrowRight} className={'ml-1'} />
			</Button>
		</div>
	) : (
		<Fragment>
			<div className='grid grid-cols-2 gap-2 md:grid-cols-3'>
				<div className='flex flex-col'>
					<Label htmlFor='wellKnownId'>Mã sản phẩm:</Label>
					<TextInput
						sizing={'md'}
						type={'text'}
						id={'wellKnownId'}
						name={'wellKnownId'}
						onChange={formik.handleChange}
						value={formik.values.wellKnownId}
						placeholder='CUA_CA_MAU_L1'
						color={
							formik.touched.wellKnownId &&
							formik.errors.wellKnownId &&
							'failure'
						}
						helperText={
							formik.touched.wellKnownId &&
							formik.errors.wellKnownId && (
								<span>
									<FontAwesomeIcon icon={faWarning} className='px-1' />
									{formik.errors.wellKnownId}
								</span>
							)
						}
					/>
				</div>
				<div className='flex flex-col'>
					<Label htmlFor='name'>Tên sản phẩm:</Label>
					<TextInput
						sizing={'md'}
						type={'text'}
						id={'name'}
						name={'name'}
						onChange={formik.handleChange}
						value={formik.values.name}
						placeholder='Cua cà mau loại 1'
						color={formik.touched.name && formik.errors.name && 'failure'}
						helperText={
							formik.touched.name &&
							formik.errors.name && (
								<span>
									<FontAwesomeIcon icon={faWarning} className='px-1' />
									{formik.errors.name}
								</span>
							)
						}
					/>
				</div>
				<div className='flex flex-col w-full col-span-2 md:col-span-1'>
					<Label htmlFor='category'>Loại sản phẩm:</Label>
					<SelectableInput
						id={'category'}
						defaultValue={categories[0]}
						isSearchable={true}
						onChange={(selected) => {
							formik.values.categoryId = selected.value;
						}}
						options={categories ?? []}
					/>
				</div>
				<div className='flex flex-col col-span-3 sm:col-span-2 row-span-2 w-full mb-10'>
					<Label htmlFor='description'>Mô tả:</Label>
					<TextEditor
						id={'description'}
						quillRef={quillRef}
						value={formik.values.description}
					/>
				</div>
				<div className='flex flex-col gap-2 mt-4'>
					<div className='flex gap-2 ml-2 mt-2 md:mt-0 items-center'>
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
					<div className='flex gap-2 ml-2 mt-2 md:mt-0 items-center'>
						<Checkbox
							name='isRecommended'
							id='isRecommended'
							checked={
								formik.values.isActive ? formik.values.isRecommended : false
							}
							onChange={formik.handleChange}
							disabled={!formik.values.isActive}
						/>
						<Label htmlFor='isRecommended' className='cursor-pointer'>
							Sản phẩm đề xuất
						</Label>
					</div>
				</div>
			</div>
			<Button
				size={'xs'}
				gradientDuoTone={'greenToBlue'}
				className={'w-fit self-center'}
				onClick={formik.handleSubmit}>
				Thêm chi tiết sản phẩm
				<FontAwesomeIcon icon={faArrowRight} className={'ml-2'} />
			</Button>
		</Fragment>
	);
}
