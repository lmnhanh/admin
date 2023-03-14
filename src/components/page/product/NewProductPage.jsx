import {
	faHome,
	faWarning,
	faArrowRight,
	faArrowLeft,
	faPlus,
	faXmark,
} from '@fortawesome/free-solid-svg-icons';
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
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import axios from 'axios';
import SelectableInput from '../../util/SelectableInput';
import { useEffect, useState, useRef, React, Fragment } from 'react';
import TextEditor from './../../util/TextEditor';
import { Link, useNavigate } from 'react-router-dom';
import ProductInfo from './../../util/ProductInfo';
import UpLoadImage from './UploadImage';
import NewProductDetail from './detail/NewProductDetail';
import ToastPromise from '../../util/ToastPromise';

export default function NewProductPage(props) {
	const [categories, setcategories] = useState([]);
	const [productCreated, setProductCreated] = useState(null);
	// const [productDetail, setProductDetail] = useState([{
	// 	unit: '',
	// 	description: '',
	// 	toWholeSale: 1,
	// 	retailPrice: 1,
	// 	wholePrice: 1,
	// 	isActive: true,
	// }]);
	const [step, setStep] = useState(0);
	const quillRef = useRef({ value: '' });
	const navigate = useNavigate();

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
			formik.values.description = quillRef.current.value.toString();
			try {
				ToastPromise(
					axios.post('/api/products/', {
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
			} catch (error) {
				navigate('/');
			}
		},
	});

	const fetchListcategories = async () => {
		const { status, data } = await axios.get('/api/categories?page=0');
		if (status === 200) {
			setcategories(
				data.categories.map((item) => ({
					value: item.id,
					label: item.name,
				}))
			);
			formik.values.categoryId = data.categories[0].id;
		}
	};

	useEffect(() => {
		fetchListcategories();
	}, []);

	return (
		<Fragment>
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
					<Fragment>
						<span className='mr-3 text-md font-bold'>Thêm sản phẩm mới</span>
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
											{formik.touched.wellknownId &&
												formik.errors.wellknownId && (
													<span>
														<FontAwesomeIcon
															icon={faWarning}
															className='px-1'
														/>
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
											formik.values.isActive
												? formik.values.isRecommended
												: false
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

					{/* {step === 1 && (
						<Fragment>
							<span className='mr-3 text-md font-bold'>
								Thêm chi tiết cho sản phẩm
							</span>

							{formik.values.details.map((detail, index) => (
								
									<NewProductDetail value={formik.values.details[index]}/>
							))}

							<div className='flex gap-x-2 justify-between'>
								<Button
									size={'xs'}
									gradientDuoTone={'greenToBlue'}
									className={'w-fit self-center'}
									// onClick={formik.handleSubmit}
									onClick={() => {
										setStep(0);
									}}>
									<FontAwesomeIcon icon={faArrowLeft} className={'mr-2'} />
									Thông tin sản phẩm
								</Button>
								<Button
									size={'xs'}
									gradientDuoTone={'greenToBlue'}
									className={'w-fit self-center'}
									// onClick={formik.handleSubmit}
									onClick={() => {
										// setProductDetail([...productDetail,{
										// 	unit: '',
										// 	description: '',
										// 	toWholeSale: 1,
										// 	retailPrice: 1,
										// 	wholePrice: 1,
										// 	isActive: true,
										// }])
										formik.setValues({
											...formik.values,
											details: [
												...formik.values.details,
												{
													unit: '',
													description: '',
													toWholeSale: 1,
													retailPrice: 1,
													wholePrice: 1,
													isActive: true,
												},
											],
										});
									}}>
									Thêm chi tiết
									<FontAwesomeIcon icon={faPlus} className={'h-4 w-4 ml-2'} />
								</Button>
								<Button
									size={'xs'}
									gradientDuoTone={'greenToBlue'}
									className={'w-fit self-center'}
									// onClick={formik.handleSubmit}
									onClick={() => {
										// setStep(2);
									}}>
									Thêm ảnh
									<FontAwesomeIcon icon={faArrowRight} className={'ml-2'} />
								</Button>
							</div>
						</Fragment>
					)}
					{step === 2 && (
						<Fragment>
							<span className='mr-3 text-md font-bold'>
								Thêm hình ảnh cho sản phẩm
							</span>
							<div className='grid grid-cols-2 gap-2'>
								<UpLoadImage productId={productCreated.id} />
								<div>
									<ProductInfo product={productCreated} />
								</div>
							</div>
						</Fragment>
					)} */}
				</Card>
			</div>
		</Fragment>
	);
}
