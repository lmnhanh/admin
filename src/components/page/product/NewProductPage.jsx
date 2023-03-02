import { faHome, faWarning } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useFormik } from 'formik';
import BreadcrumbPath from './../../util/BreadCrumbPath';
import * as yup from 'yup';
import {
	Badge,
	Button,
	Card,
	Checkbox,
	Label,
	TextInput,
} from 'flowbite-react';
import { FilePond, registerPlugin } from 'react-filepond';
import './filepond.css';
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import { useSelector } from 'react-redux';
import axios from 'axios';
import SelectableInput from '../../util/SelectableInput';
import { useEffect, useState, useRef, React, Fragment } from 'react';
import TextEditor from './../../util/TextEditor';
import ToastPromise from '../../util/ToastPromise';
import { Link } from 'react-router-dom';
import UpLoadImage from './UploadImage';

registerPlugin(
	FilePondPluginImageExifOrientation,
	FilePondPluginFileValidateSize,
	FilePondPluginImagePreview,
	FilePondPluginFileValidateType
);

export default function NewProductPage(props) {
	const token = useSelector((state) => state.auth.token);
	const [categories, setCategories] = useState([]);
	const quillRef = useRef({ value: '' });

	const formik = useFormik({
		initialValues: {
			name: '',
			wellknownId: '',
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
			wellknownId: yup
				.string()
				.max(20, 'Tối đa 20 kí tự!')
				.required('Mã sản phẩm không được trống!'),
		}),
		onSubmit: async (values) => {
			formik.values.description = quillRef.current.value.toString();
			ToastPromise(
				axios.post('/api/products/', {
					name: values.name,
					wellknownId: values.wellknownId,
					categoryId: values.categoryId,
					description: values.description,
					isActive: values.isActive,
					isRecommended: values.isRecommended
				}),
				{
					pending: 'Đang thêm sản phẩm',
					success: (response) => {
						//handleOnSuccess();
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
						//let errors = error.response.data.errors.join(', ');
						console.log(error)
						return error;
					},
				}
			);
		},
	});

	const fetchListCategories = async () => {
		const { status, data } = await axios.get('/api/categories?page=0');
		status === 200 &&
			setCategories(
				data.categories.map((item) => ({
					value: item.id,
					label: item.name,
				}))
			);
	};

	useEffect(() => {
		fetchListCategories();
	}, []);

	return (
		<div className='place-self-center'>
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
					{ to: '/product', text: 'Sản phẩm' },
					{ to: '/product/new', text: 'Thêm sản phẩm mới' },
				]}
			/>

			<div className='container min-w-max'>
				<Card>
					<span className='mr-3 text-md font-bold'>Thêm sản phẩm mới</span>
					<div className='grid grid-cols-2 gap-2 md:grid-cols-3'>
						<div className='flex flex-col'>
							<Label htmlFor='wellknownId'>Mã sản phẩm:</Label>
							<TextInput
								sizing={'sm'}
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
										{formik.touched.wellknownId &&
											formik.errors.wellknownId && (
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
								sizing={'sm'}
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
								isSearchable={true}
								onChange={(selected) => {
									formik.values.categoryId = selected.value;
								}}
								options={categories ?? []}
							/>
						</div>
						<div className='flex flex-col col-span-3 sm:col-span-2 row-span-2 w-full mb-10'>
							<Label htmlFor='description'>Mô tả:</Label>
							<TextEditor quillRef={quillRef} />
						</div>
						<div className='flex gap-2 ml-2 self-end mt-2 md:mt-0'>
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
						<div className='flex gap-2 ml-2 self-start mt-2 md:mt-0'>
							<Checkbox
								name='isRecommended'
								id='isRecommended'
								checked={formik.values.isRecommended}
								onChange={formik.handleChange}
							/>
							<Label htmlFor='isRecommended' className='cursor-pointer'>
								Sản phẩm đề xuất
							</Label>
						</div>
					</div>
					<Button size={'xs'} className={'w-fit p-1 self-center'} onClick={formik.handleSubmit}>
						Thêm
					</Button>
				</Card>
			</div>
		</div>
	);
}
