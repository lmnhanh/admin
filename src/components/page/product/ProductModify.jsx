import {
	faWarning,
	faArrowRight,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Badge, Button, Checkbox, Label, TextInput } from 'flowbite-react';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import axios from 'axios';
import SelectableInput from '../../util/SelectableInput';
import { useEffect, useState, useRef, React, Fragment } from 'react';
import TextEditor from '../../util/TextEditor';
import { Link, useNavigate } from 'react-router-dom';
import ToastPromise from '../../util/ToastPromise';

export default function ProductModify({ product }) {
	const [categories, setcategories] = useState([]);
	const quillRef = useRef({ value: '' });
	const navigate = useNavigate();

	const formik = useFormik({
		initialValues: {
			id: product ? product.id : 1,
			name: product ? product?.name : '',
			wellknownId: product ? product?.wellKnownId : '',
			description: product ? product?.description : '',
			categoryId: product ? product?.categoryId : '',
			isActive: product ? product?.isActive : true,
			isRecommended: product ? product?.isRecommended : false,
		},
		validationSchema: yup.object({
			name: yup
				.string()
				.max(50, 'Tối đa 50 kí tự')
				.required('Tên sản phẩm không được trống!'),
			wellknownId: yup
				.string()
				.max(20, 'Tối đa 20 kí tự!')
				.required('Mã sản phẩm không được trống!'),
		}),
		onSubmit: async (values) => {
			formik.values.description = quillRef.current.value.toString();
			try {
				if (product) {
					console.log('Update');
				} else {
					ToastPromise(
						axios.post('/api/product/', {
							name: values.name,
							wellknownId: values.wellknownId,
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
										<Link to={`/product/edit/${response.data.id}`}>
											<Badge size={'xs'} className='w-fit' color={'info'}>
												Xem chi tiết
											</Badge>
										</Link>
									</div>
								);
							},
							error: (error) => {
								return 'Lỗi! Không thể thêm sản phẩm!';
							},
						}
					);
				}
			} catch (error) {
				navigate('/');
			}
		},
	});

	useEffect(() => {
		document.title = 'Thêm sản phẩm';
		const fetchListcategories = async () => {
			const { status, data } = await axios.get('/api/categories?page=0');
			if (status === 200) {
				setcategories(
					data.categories.map((item) => ({
						value: item.id,
						label: item.name,
					}))
				);
				formik.values.categoryId = product? product.categoryId : data.categories[0].id;
			}
		};
		fetchListcategories();
	}, []);

	return (
		<Fragment>
			<div className='grid grid-cols-2 gap-2 md:grid-cols-3'>
				<div className='flex flex-col'>
					<Label htmlFor='wellknownId'>Mã sản phẩm:</Label>
					<TextInput
						sizing={'md'}
						type={'text'}
						id={'wellknownId'}
						name={'wellknownId'}
						onChange={formik.handleChange}
						value={formik.values.wellknownId}
						placeholder='CUA_CA_MAU_L1'
						color={
							formik.touched.wellknownId &&
							formik.errors.wellknownId &&
							'failure'
						}
						helperText={
							<span>
								{formik.touched.wellknownId && formik.errors.wellknownId && (
									<span>
										<FontAwesomeIcon icon={faWarning} className='px-1' />
										{formik.errors.wellknownId}
									</span>
								)}
							</span>
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
				<div className='flex flex-col w-full col-span-2 md:col-span-1'>
					<Label htmlFor='name'>Loại sản phẩm:</Label>
					<SelectableInput
						defaultValue={categories.find((category)=> category.value === product.categoryId)}
						isSearchable={true}
						onChange={(selected) => {
							formik.values.categoryId = selected.value;
						}}
						options={categories ?? []}
					/>
				</div>
				<div className='flex flex-col col-span-3 sm:col-span-2 row-span-2 w-full mb-10'>
					<Label htmlFor='description'>Mô tả:</Label>
					<TextEditor quillRef={quillRef} value={formik.values.description} />
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
