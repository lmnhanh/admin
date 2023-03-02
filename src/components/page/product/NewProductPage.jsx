import { faHome, faWarning } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useFormik } from 'formik';
import BreadcrumbPath from './../../util/BreadCrumbPath';
import * as yup from 'yup';
import { Button, Card, Label, TextInput } from 'flowbite-react';
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
import { useEffect, useState } from 'react';

registerPlugin(
	FilePondPluginImageExifOrientation,
	FilePondPluginFileValidateSize,
	FilePondPluginImagePreview,
	FilePondPluginFileValidateType
);

export default function NewProductPage(props) {
	const token = useSelector((state) => state.auth.token);
	const [categories, setCategories] = useState([]);

	const formik = useFormik({
		initialValues: {
			name: '',
			wellknownId: '',
			desciption: '',
			imageIds: [],
			categoryId: '',
			isActive: true,
			isRecommended: false,
		},
		validationSchema: yup.object({
			name: yup.string().max(50, "Tối đa 50 kí tự").required('Tên sản phẩm không được trống!'),
			wellknownId: yup.string()
				.max(20, 'Tối đa 20 kí tự!')
				.required('Mã sản phẩm không được trống!'),
		}),
		onSubmit: (values) => {
			console.log(values);
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
		<div>
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

			<div className='container'>
				<Card>
					<span className='mr-3 text-md font-bold'>Thêm sản phẩm mới</span>
					<div className='grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-3'>
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
						<div className='flex flex-col w-full'>
							<Label htmlFor='name'>Loại sản phẩm:</Label>
							<SelectableInput
								isSearchable={true}
								onChange={(selected) => {
									formik.values.categoryId = selected.value
								}}
								options={categories ?? []}
							/>
						</div>
					</div>

					<FilePond
						files={formik.values.imageIds}
						allowFileSizeValidation={true}
						maxFileSize='2MB'
						labelMaxFileSize='< 2MB'
						labelMaxFileSizeExceeded='Ảnh quá lớn'
						allowFileTypeValidation={true}
						allowReorder={true}
						acceptedFileTypes={['image/*']}
						labelFileTypeNotAllowed='Chỉ chọn ảnh!'
						server={{
							process: {
								url: 'https://localhost:7028/api/products/UploadImage',
								method: 'POST',
								headers: {
									Authorization: `Bearer ${token}`,
								},
								withCredentials: false,
								onload: (response) => {
									console.log(response)
									formik.values.imageIds.push({source: response, options: {
										type: 'local'
									}});
								},
							},
							load: async (source, load, error, progress, abort, headers) => {
								const response = await axios.get(`/api/images/${source}`);
		
								async function urltoFile(url, filename, mimeType) {
									const res = await fetch(url);
									const buf = await res.arrayBuffer();
									return new File([buf], filename, { type: mimeType });
								}
		
								urltoFile(
									`data:text/plain;base64,${response.data}`,
									'1146811_5370495.jpg',
									'image/jpg'
								).then(function (file) {
									load(file);
								});
								error('oh my goodness');
								//headers(headersString);
								//progress(true, 0, 1024);
								return {
									abort: () => {
										abort();
									},
								};
							},
							remove: async (source, load, error) => {
								const response = await axios.delete(`/api/images/${source}`);
								const { status } = response;
								if(status === 204){
									let index = formik.values.imageIds.findIndex(image => image.source === source);
									formik.values.imageIds.splice(index,1)
									load();
								} else error('Lỗi!');
								//load();
							},
							fetch: null,
							revert: null,
						}}
						allowMultiple={true}
						allowRevert={false}
						allowDrop={true}
						maxFiles={10}
						name='images'
						labelIdle='Kéo hoặc <span class="filepond--label-action">chọn</span> hình cho sản phẩm'
					/>
					<Button onClick={formik.handleSubmit}>Submit</Button>
				</Card>
			</div>
		</div>
	);
}
